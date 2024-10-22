import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Adjust the import path as needed
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from "../assets/images/logo.jpg"; // Import your logo here

const AboutScreen = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
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
          <View style={styles.featureList}>
            <Text style={[styles.featureItem, theme === 'dark' ? styles.darkText : styles.lightText]}>• Track government spending in real-time</Text>
            <Text style={[styles.featureItem, theme === 'dark' ? styles.darkText : styles.lightText]}>• Access detailed reports on fund allocation</Text>
            <Text style={[styles.featureItem, theme === 'dark' ? styles.darkText : styles.lightText]}>• Participate in community discussions about fund usage</Text>
            <Text style={[styles.featureItem, theme === 'dark' ? styles.darkText : styles.lightText]}>• Receive notifications on important updates regarding government transparency</Text>
            <Text style={[styles.featureItem, theme === 'dark' ? styles.darkText : styles.lightText]}>• Engage in debates with fellow citizens and officials</Text>
          </View>

          <Text style={[styles.footer, theme === 'dark' ? styles.darkText : styles.lightText]}>
            Thank you for being part of our mission to create a transparent and accountable government!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  lightBackground: {
    backgroundColor: '#f9f9f9',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  content: {
    padding: 15,
  },
  logo: {
    width: '100%',
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 26,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: "Poppins-Bold",
    color: '#B7C42E',
  },
  subheading: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 10,
    fontFamily: "Poppins-Bold",
    color: '#B7C42E',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: "Poppins-Regular",
    textAlign: 'justify',
  },
  featureList: {
    marginBottom: 20,
    paddingLeft: 10,
  },
  featureItem: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "Poppins-Regular",
    color: '#0A3D62',
  },
  footer: {
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: "Poppins-BlackItalic",
    color: '#B7C42E',
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#333333',
  },
});

export default AboutScreen;
