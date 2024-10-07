import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { db } from '../FIrebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import NavBar from './NavBar';

const MinistersComponent = () => {
  const [ministers, setMinisters] = useState([]);
  const navigation = useNavigation();

  const fetchMinisters = async () => {
    const querySnapshot = await getDocs(collection(db, 'ministers'));
    const ministersData = querySnapshot.docs.map((doc) => doc.data());
    setMinisters(ministersData);
  };

  useEffect(() => {
    fetchMinisters();
  }, []);

  const handlePress = (minister) => {
    navigation.navigate('MinisterDetails', { minister });
  };

  const renderMinister = ({ item }) => (
    <TouchableOpacity style={styles.ministerCard} onPress={() => handlePress(item)}>
      <Image style={styles.ministerProfileImage} source={{ uri: item.ministerProfileImage }} />
      <View>
        <Text style={styles.ministerName}>{item.ministerName}</Text>
        <Text style={styles.ministerDepartment}>{item.ministerDepartment.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <NavBar/>
      <FlatList
        data={ministers}
        keyExtractor={(item) => item.ministerID}
        renderItem={renderMinister}
        ListHeaderComponent={<Text style={styles.header}>Ministers</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MinistersComponent;

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  ministerCard: {
    padding: 20,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  ministerProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  ministerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ministerDepartment: {
    fontSize: 16,
    color: 'gray',
  },
});