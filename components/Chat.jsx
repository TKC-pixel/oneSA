import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  where,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../FIrebaseConfig";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  MessageText,
  Avatar,
  Send,
} from "react-native-gifted-chat";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Icon } from "react-native-elements";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "react-native-image-viewing";
const storage = getStorage();

export default function Chat({ route }) {
  const { userData } = useContext(UserContext);
  const navigation = useNavigation();
  const userID = auth.currentUser.uid;
  const { groupID, debatename } = route.params;
  const [messages, setMessages] = useState([]);
  const [showInput, setShowInput] = useState(userData.isVerified);
  const { theme } = useContext(ThemeContext);
  const [isSending, setIsSending] = useState(false);

  // my state to keep track of images and files
  const [isAttachImage, setIsAttachImage] = useState(false);

  const [imagePath, setImagePath] = useState("");

  const [imageVisible, setImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const uploadImage = async () => {
    try {
      const imageName = imagePath.split("/").pop();
      const storageRef = ref(storage, `messageImages/${groupID}/${imageName}`);
      const response = await fetch(imagePath);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob).then((snapshot) => {
        console.log("image uploaded");
      });
      return await getDownloadURL(storageRef);
    } catch (err) {
      console.log(err);
    }
  };

  const onSend = useCallback(
    async (newMessages = []) => {
      setIsSending(true);

      const message = newMessages[0];

      try {
        if (isAttachImage) {
          const imgURL = await uploadImage();
          if (!imgURL) {
            console.error("Image URL is undefined. Cannot send message.");
            setIsSending(false);
            return;
          }
          await addDoc(collection(db, "messages"), {
            groupID: groupID,
            message: message.text,
            senderId: userID,
            timestamp: serverTimestamp(),
            senderName: userData.name,
            senderAvatar: userData.profileImageUrl,
            image: imgURL,
            file: "",
          });
          setImagePath("");
          setIsAttachImage(false);
        } else {
          await addDoc(collection(db, "messages"), {
            groupID: groupID,
            message: message.text,
            senderId: userID,
            timestamp: serverTimestamp(),
            senderName: userData.name,
            senderAvatar: userData.profileImageUrl,
            image: "",
            file: "",
          });
        }
        console.log("Message sent successfully");
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsSending(false);
      }
    },
    [isAttachImage, imagePath]
  );

  const renderBubble = (props) => {
    const { currentMessage } = props;

    const hasImage = currentMessage.image;
    return (
      <TouchableOpacity
        onPress={() => {
          console.log("Bubble pressed");
          if (hasImage) {
            setSelectedImage(currentMessage.image);
            setImageVisible(true);
            console.log("Selected Image:", selectedImage);
          }
        }}
      >
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: "#fff",
              borderRadius: 10,
              // Shadow for iOS
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              // Shadow for Android
              elevation: 4,
            },
            right: {
              backgroundColor: "#B7C42E",
              borderRadius: 10,
              // Shadow for iOS
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              // Shadow for Android
              elevation: 4,
            },
          }}
          textStyle={{
            left: {
              color: "black",
            },
            right: {
              color: "white",
            },
          }}
        />
      </TouchableOpacity>
    );
  };

  const renderInputToolbar = (props) => {
    if (!showInput) return null;
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: theme === "light" ? "white" : "#333",
          borderWidth: 0.5,
          borderColor: theme === "light" ? "#cccccc" : "white",
          paddingVertical: 3,
          paddingHorizontal: 10,
          borderRadius: 20,
          marginBottom: 40,
          width: 380,
          margin: "auto",
        }}
        textInputStyle={{ fontFamily: "Poppins-Regular" }}
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
            color: "#000",
            // fontStyle: "italic",
            marginLeft: 10,
            fontFamily: "Poppins-Bold",
          }}
        >
          {isCurrentUser ? "You" : currentMessage.user.name}
        </Text>
        <MessageText
          {...props}
          textStyle={{
            left: { color: "black", fontFamily: "Poppins-Regular" },
            right: { color: "white", fontFamily: "Poppins-Regular" },
          }}
        />
      </View>
    );
  };

  const renderSend = (props) => {
    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}
      >
        {isSending && isAttachImage ? (
          <ActivityIndicator
            size="small"
            color="gray"
            style={{ marginRight: 10, marginBottom: 10 }}
          />
        ) : (
          <>
            {/* Image Icon */}
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={pickImage}
            >
              <Ionicons name="image-outline" size={25} />
            </TouchableOpacity>

            {/* Send Button */}
            <Send
              {...props}
              containerStyle={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View>
                <Ionicons name="send-outline" size={25} color="green" />
              </View>
            </Send>
          </>
        )}
      </View>
    );
  };
  const renderMessageImage = (props) => {
    const { currentMessage } = props;

    if (!currentMessage.image) return null;

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedImage([currentMessage.image]);
          setImageVisible(true);
          console.log("Selected Image:", selectedImage);
        }}
      >
        <Image
          source={{ uri: currentMessage.image }}
          style={{
            width: 150,
            height: 150,
            borderRadius: 10,
            margin: 5,
          }}
        />
      </TouchableOpacity>
    );
  };

  const renderChatFooter = useCallback(() => {
    if (imagePath) {
      return (
        <View style={styles.chatFooter}>
          <Image
            source={{ uri: imagePath }}
            style={{ height: 75, width: 75 }}
          />
          <TouchableOpacity
            onPress={() => setImagePath("")}
            style={styles.buttonFooterChatImg}
          >
            <Ionicons name="close-circle-outline" size={25} color="red" />
            {/* <Text style={styles.textFooterChat}>X</Text> */}
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }, [imagePath]);

  const renderAvatar = (props) => {
    const { currentMessage } = props;
    return <Avatar {...props} source={{ uri: currentMessage.user.avatar }} />;
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
          image: doc.data().image || null,
          file: doc.data().file || null,
        });
      });
      setMessages(messages);
    });
    return unSubscribe;
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (result.canceled) {
        console.log("user cancelled image picker");
        return;
      }
      const fileUri = result.assets[0].uri;
      if (!fileUri) {
        console.log("File URI is undefined or null");
        return;
      }
      console.log("image selected", fileUri);
      setImagePath(fileUri);
      setIsAttachImage(true);
      console.log(`image path: ${imagePath}, isAttachImage: ${isAttachImage}`);
    } catch (err) {
      console.log("error selecting image with image picker", err);
    }
  };

  useEffect(() => {
    const unSubscribe = fetchMessages(groupID);
    return () => unSubscribe();
  }, [groupID]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme === "light" ? "white" : "#121212",
      }}
    >
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={[
              styles.backBtn,
              { backgroundColor: theme === "light" ? "#D3D3D3" : "black" },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>
          <ScrollView>
            <Text
              style={{
                color: theme === "light" ? "black" : "white",
                fontSize: 18,
                fontFamily: "Poppins-SemiBold",
              }}
            >
              {debatename}
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>

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
        renderSend={renderSend}
        renderChatFooter={renderChatFooter}
        renderAvatar={renderAvatar}
        renderMessageImage={renderMessageImage}
        alwaysShowSend
      />
      {imageVisible && selectedImage && (
        <ImageViewer
          images={
            selectedImage ? selectedImage.map((img) => ({ uri: img })) : []
          }
          visible={imageVisible}
          onRequestClose={() => setImageVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backBtn: {
    width: 40,
    height: 40,

    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  chatFooter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#1F2687",
    shadowOpacity: 0.37,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  fileContainer: {
    flex: 1,
    maxWidth: 300,
    marginVertical: 2,
    borderRadius: 15,
  },
  fileText: {
    marginVertical: 5,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 10,
    marginRight: 5,
  },
  buttonFooterChat: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderColor: "black",
    right: 3,
    top: -2,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  buttonFooterChatImg: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderColor: "black",
    left: 66,
    top: -4,
    backgroundColor: "#fff",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    // Shadow for Android
    elevation: 5,
  },
  textFooterChat: {
    color: "red",
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  closeButton: {
    color: "white",
    fontSize: 24,
    position: "absolute",
    top: 40,
    right: 20,
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
});
