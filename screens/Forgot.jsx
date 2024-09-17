import {View, Text, SafeAreaView, Image, StyleSheet, TextInput, Pressable} from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail} from "@firebase/auth";
import { useState } from 'react';


const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
export default function Forgot(){
    const [email, setEmail ]= useState('');

    const handleEmailChange = (text) => {
        setEmail(text);
    }
    let ForgotPass= ()=>{
        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Password reset email sent successfully');
        })
        .catch((error)=>{
            alert('Error sending password reset email: ', error);
        })
    }
    return(
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                    source={require("../assets/images/logo.jpg")}
                    style={styles.logo}
                />
                <Text style={{fontSize: '20%'}}>Forgot Password</Text>
                <Image source={{uri : 'https://as1.ftcdn.net/v2/jpg/04/92/75/18/1000_F_492751838_Ybun2zwpQC8AZv11AwZLdXJk4cUrTt5z.jpg'}} style={{height: '40%', width : '100%', marginTop: '20%', marginBottom: '20%'}}/>
                <TextInput placeholder='Enter your email' placeholderTextColor={'black'} style={{borderWidth: 1, padding: '3%',borderColor: "#ccc", borderWidth: 1, borderRadius: 5, width: '80%'}} onChangeText={handleEmailChange} value={email}/>
                <Pressable style={styles.loginButton} onPress={() => { if (email.trim() !== '') {ForgotPass();} else {Alert.alert('Please enter a valid email address');}}}>
                    <Text style={{color: 'white', fontSize: '16%'}}>Send Reset Link</Text>
                </Pressable>
                
            </View>
        </SafeAreaView>
        
    );
}


const styles = StyleSheet.create({

    logo: {
      height: "20%",
      width: "100%",
      alignSelf: "center",
    },
    loginButton: {
        backgroundColor: "#B7C42E",
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
        marginTop: 40,
        width: '80%'
    }
  });
  