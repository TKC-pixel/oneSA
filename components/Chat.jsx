import { View, Text } from "react-native";
import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  where,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../FIrebaseConfig";
import { GiftedChat, Bubble,InputToolbar } from "react-native-gifted-chat";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";

export default function Chat({ route }) {
  const { userData } = useContext(UserContext);
  const navigation = useNavigation();
  const userID = auth.currentUser.uid;
  const { groupID } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showInput, setShowInput] = useState(userData.isVerified);

  const onSend = useCallback(async (newMessages = []) => {
    const message = newMessages[0];
    try {
      await addDoc(collection(db, "messages"), {
        groupID: groupID,
        message: message.text,
        senderId: userID,
        timestamp: serverTimestamp(),
        senderName: userData.name, 
        senderAvatar: userData.profilePic,
      });
      console.log("Message sent successfully", `user: ${userData.name}`);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#B7C42E", // Sender's bubble color
          },
        }}
      />
    );
  };
  const renderInputToolbar = (props) => {
    if (showInput) {
      return null;
    }
    return <InputToolbar {...props} />;
  };
  function fetchMessages(groupChatId) {
    const q = query(
      collection(db, "messages"),
      where("groupID", "==", groupChatId),
      orderBy("timestamp", "desc")
    );
    const unSubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({
          _id: doc.id,
          text: doc.data().message,
          createdAt: doc.data().timestamp?.toDate() || new Date(),
          user: {
            _id: doc.data().senderId,
            name: doc.data().senderName || "Anonymous",
            avatar: doc.data().senderAvatar || null,
          },
        });
      });
      setMessages(messages);
    });
    return unSubscribe;
  }
  useEffect(() => {
    const unSubscribe = fetchMessages(groupID);

    return () => unSubscribe();
  }, [groupID]);

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: userID,
          avatar: userData.profilePic,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
      />
    </View>
  );
}
