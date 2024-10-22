import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Linking } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from "../context/UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
const PrivacySettingsScreen = ({navigation}) => {
  const { locationPermissions, updateLocationPermission, toggleLocation, dataAccess, updateDataAccess } = useContext(UserContext);
  const { theme } = useContext(ThemeContext); 
  
  const [location, setLocation] = useState(false);
  
  useEffect(() => {
    setLocation(locationPermissions === 'yes');
  }, [locationPermissions]);
  
  
  const handleToggleLocationSharing = async (newValue) => {
    try {
      let { status } = await Location.getForegroundPermissionsAsync();  
      
      if (status === 'denied' || status === 'blocked') {
        Alert.alert(
          "Permission Required",
          "Location sharing is disabled. To enable it, go to your phone's Settings > Privacy > Location Services and set it to 'While Using the App' or 'Ask Next Time'.",
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        setLocation(false);
        updateLocationPermission('no');  
      } 
      else if (status === 'granted') {
        if (!newValue) {
          Alert.alert(
            "Disable Location Sharing",
            "To disable location sharing, please go to your phone's Settings > Privacy > Location Services and set it to 'Never'.",
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),  
              },
            ]
          );
        } else {
          setLocation(true);
          updateLocationPermission('no');
        }
      } 
      else if (status === 'undetermined') {
        let { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        
        if (newStatus === 'granted') {
          
          setLocation(newValue);
          const newPermission = newValue ? 'yes' : 'no';
          updateLocationPermission(newPermission);
        } else {
          Alert.alert(
            "Permission Denied",
            "Location sharing is disabled. You can enable it in your phone's Settings > Privacy > Location Services.",
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          setLocation(false);
          updateLocationPermission('no');
        }
      }
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      Alert.alert("Error", "Failed to request location permission.");
    }
  };
  
  const handleToggleTheme = () => {
    toggleTheme(); 
    Alert.alert(
      "Theme Changed",
      `The theme has been changed to ${theme === "light" ? "Dark" : "Light"}.`
    );
  };
  useEffect(() => {
    const loadDataAccess = async () => {
      try {
        const storedDataAccess = await AsyncStorage.getItem('dataAccess');
        if (storedDataAccess !== null) {
          updateDataAccess(storedDataAccess === 'true');  
        }
      } catch (error) {
        console.error('Error loading data access from AsyncStorage:', error);
      }
    };
    loadDataAccess();
  }, []);
  
  const handleToggleDataAccess = async (newDataAccess) => {
    try {
      const newAccess = newDataAccess.toString();  
      await AsyncStorage.setItem('dataAccess', newAccess);
      updateDataAccess(newDataAccess);  
      // console.log('Data Access updated to:', newDataAccess);
    } catch (error) {
      console.error('Error saving data access:', error);
    }
  };
  

  const handlePrivacyPolicyPress = () => {
    Linking.openURL('https://onesa.netlify.app/'); 
  };

  const handleSaveSettings = () => {
    Alert.alert("Settings Saved", "Your privacy preferences have been saved.");
    navigation.navigate('Welcome')
  };
  const stringToBoolean = (str) => {
    return str === 'true';  
  };

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <View>
        <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
          Privacy Settings
        </Text>

        <View style={styles.settingItem}>
          <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
            Enable Location Sharing:
          </Text>
          <Switch
            value={location}
            onValueChange={handleToggleLocationSharing}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
            Allow Data Access:
          </Text>
          <Switch
            value={dataAccess}  
            onValueChange={(newValue) => handleToggleDataAccess(newValue)}
          />

        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme === 'dark' ? '#0056b3' : '#007bff' }]} onPress={handlePrivacyPolicyPress}>
          <Text style={styles.buttonText}>View Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme === 'dark' ? '#0056b3' : '#007bff' }]} onPress={handleSaveSettings}>
          <Text style={styles.buttonText}>Save Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  lightBackground: {
    backgroundColor: '#f8f9fa', // Light background color
  },
  darkBackground: {
    backgroundColor: '#1c1c1e', // Dark background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  darkText: {
    color: '#ffffff', // Light text color for dark mode
  },
  lightText: {
    color: '#000000', // Dark text color for light mode
  },
});

export default PrivacySettingsScreen;
