import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  where,
  query,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../FIrebaseConfig";
import { GiftedChat, Bubble, InputToolbar, MessageText, Avatar } from "react-native-gifted-chat";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
export default function Chat({ route }) {
  const { userData } = useContext(UserContext);
  const navigation = useNavigation();
  const userID = auth.currentUser.uid;
  const { groupID, debatename } = route.params;
  const [messages, setMessages] = useState([]);
  const [showInput, setShowInput] = useState(true);
  const { theme } = useContext(ThemeContext);
  const onSend = useCallback(async (newMessages = []) => {
    const message = newMessages[0];
    try {
      await addDoc(collection(db, "messages"), {
        groupID: groupID,
        message: message.text,
        senderId: userID,
        timestamp: serverTimestamp(),
        senderName: userData.name, 
        senderAvatar: userData.profileImageUrl,
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
          left: {
            backgroundColor: '#e0e0e0',
            borderRadius: 10,
          },
          right: {
            backgroundColor: '#B7C42E',
            borderRadius: 10,
          },
        }}
        textStyle={{
          left: {
            color: 'black',
          },
          right: {
            color: 'white',
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    if (!showInput) {
      return null;
    }
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: theme === 'light' ? 'white' : '#333',
          borderWidth: 0.5,
          borderColor: theme === 'light' ? '#cccccc' : 'white',
          paddingVertical: 3,
          borderRadius: 20,
          color: theme === 'light' ? 'black' : 'white',
        }}
      />
    );
  };

  const renderMessageText = (props) => {
    const { currentMessage } = props;
    const isCurrentUser = currentMessage.user._id === userID;
    return (
      <View>
         <Text
          style={{
            color: 'grey',
            fontStyle: 'italic',
            marginLeft: 10,
          }}
        >
          {isCurrentUser ? 'You' : currentMessage.user.name} 
        </Text>
        <MessageText
          {...props}
          
          textStyle={{
            left: { color: 'black' },
            right: { color: 'white' },
          }}
        />
      </View>
      
    );
  };

  // Updated renderAvatar function to correctly receive props
  const renderAvatar = (props) => {
    const { currentMessage } = props; // Get current message from props
    return (
      <Avatar
        {...props}
        source={{ uri: currentMessage.user.avatar }} // Use the avatar from currentMessage
      />
    );
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme === 'light' ? 'white' : 'black' }}>
      <View style={{flexDirection: 'row', height: 40}}>
        <Pressable>
          <Ionicons name="arrow-back" size={24} color={theme=='light' ? 'black': 'white'} />
        </Pressable>
        <Text style={{ color: theme === 'light' ? 'black' : 'white', fontSize: 17, marginTop: 3 }}>{debatename}</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: userID,
          avatar: userData.profileImageUrl,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderMessageText={renderMessageText}
        renderAvatar={renderAvatar} 
      />
    </SafeAreaView>
  );
}
