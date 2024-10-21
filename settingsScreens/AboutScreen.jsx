import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Adjust the import path as needed

const AboutScreen = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <View style={{padding: 15}}>
      <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>About OneSA</Text>
      <Text style={[styles.description, theme === 'dark' ? styles.darkText : styles.lightText]}>
        OneSA is an innovative application designed to promote transparency and accountability in government fund usage. 
        Our mission is to empower citizens by providing them with the tools to track government spending, 
        ensuring that public funds are used effectively for the benefit of all South Africans.
      </Text>

      <Text style={[styles.subheading, theme === 'dark' ? styles.darkText : styles.lightText]}>Mission</Text>
      <Text style={[styles.description, theme === 'dark' ? styles.darkText : styles.lightText]}>
        To foster a culture of transparency and citizen engagement in government funding, enabling individuals to make 
        informed decisions and hold public officials accountable.
      </Text>

      <Text style={[styles.subheading, theme === 'dark' ? styles.darkText : styles.lightText]}>Vision</Text>
      <Text style={[styles.description, theme === 'dark' ? styles.darkText : styles.lightText]}>
        A South Africa where every citizen has access to clear and accurate information regarding government spending, 
        leading to a more accountable and responsible government.
      </Text>

      <Text style={[styles.subheading, theme === 'dark' ? styles.darkText : styles.lightText]}>Features</Text>
      <Text style={[styles.description, theme === 'dark' ? styles.darkText : styles.lightText]}>
        - Track government spending in real-time {'\n'}
        - Access detailed reports on fund allocation {'\n'}
        - Participate in community discussions about fund usage {'\n'}
        - Receive notifications on important updates regarding government transparency {'\n'}
        - Engage in debates with fellow citizens and officials
      </Text>

      <Text style={[styles.footer, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Thank you for being part of our mission to create a transparent and accountable government!
      </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginBottom: 10,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  footer: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
  darkText: {
    color: '#ffffff', // Light text color for dark mode
  },
  lightText: {
    color: '#000000', // Dark text color for light mode
  },
});

export default AboutScreen;
