import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../FIrebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [locationPermissions, setLocationPermissions] = useState('no');
  const [userData, setUserData] = useState({
    email: null,
    name: null,
    surname: null,
    phone: null,
    isMinister: false,
    ministerID: null,
    bio: null,
    coverPic: null,
    favorites: null,
    isVerified: null,
    profilePic: null,
    reports: null,
  });

  const updateLocationPermission = async (newPermission) => {
    try {
      await AsyncStorage.setItem('locationPermission', newPermission);
      setLocationPermissions(newPermission);
      console.log("Location permission updated to:", newPermission); // Debug log
    } catch (error) {
      console.error("Error updating location permissions", error);
    }
  };
  
  const toggleLocation = async () => {
    const newLocation = locationPermissions === 'yes' ? 'no' : 'yes';
    await updateLocationPermission(newLocation); // Call this to update both AsyncStorage and state
  };

  useEffect(() => {
    const loadLocationPermissions = async () => {
      try {
        const storedLocation = await AsyncStorage.getItem('locationPermission'); // Check for 'locationPermission'
        if (storedLocation) {
          setLocationPermissions(storedLocation); 
        } else {
          setLocationPermissions('no'); 
        }
      } catch (error) {
        console.error('Failed to load location permission:', error);
      }
    };

    loadLocationPermissions();
  }, []);
  
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User logged in:", user);
        console.log("User UID:", user.uid);

        const userRef = doc(db, "Users", user.uid);

        const unsubscribeSnapshot = onSnapshot(userRef, (userSnap) => {
          if (userSnap.exists()) {
            const data = userSnap.data();
            console.log("Fetched user data (real-time):", data);

            setUserData((prevUserData) => ({
              ...prevUserData,
              email: data.email || user.email,
              name: data.name || "",
              surname: data.surname || "",
              phone: data.phone || "",
              isMinister: data.isMinister || false,
              ministerID: data.isMinister ? data.ministerID : null, // Conditionally include ministerID
              bio: data.bio || "",
              coverPic: data.coverPic || "",
              coverImageUrl: data.coverImageUrl || "",
              favorites: data.favorites || [],
              isVerified: data.isVerified || false,
              profileImageUrl: data.profileImageUrl || "",
              reports: data.reports || [],
            }));
          } else {
            console.log("No such user data!");
          }
        });

        return () => unsubscribeSnapshot();
      } else {
        console.log("User not logged in");
        setUserData(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, updateLocationPermission, toggleLocation, locationPermissions }}>
      {children}
    </UserContext.Provider>
  );
};
