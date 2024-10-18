import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../FIrebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    email: null,
    name: null,
    surname: null,
    phone: null,
    isMinister: false,
    bio: null,
    coverPic: null,
    favorites: null,
    isVerified: null,
    profilePic: null,
    reports: null,
  });

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
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
