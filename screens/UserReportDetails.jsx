import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";

const UserReportDetails = ({ route }) => {
    const { item } = route.params; // Access the passed item data
    const [fontsLoaded, setFontsLoaded] = useState(false);

    const loadFonts = async () => {
        await Font.loadAsync({
            "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
            "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        });
    };

    useEffect(() => {
        loadFonts().then(() => setFontsLoaded(true));
    }, []);

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <SafeAreaView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Report Details</Text>

            {item.projectImage && (
                <Image
                    source={{ uri: item.projectImage }}
                    style={styles.reportImage}
                />
            )}

            <Text style={styles.description}>Description:</Text>
            <Text style={styles.info}>{item.description}</Text>

            <Text style={styles.description}>Location:</Text>
            <Text style={styles.info}>{item.location}</Text>

            <Text style={styles.description}>Status:</Text>
            <Text style={styles.info}>{item.status}</Text>

            <Text style={styles.description}>Additional Comments:</Text>
            <Text style={styles.info}>{item.additionalComments || "N/A"}</Text>
        </SafeAreaView>
    );
};

export default UserReportDetails;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff', // Light background color
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold', // Use Poppins Bold
        marginBottom: 20,
        textAlign: 'center',
        color: '#343a40', // Dark text color
    },
    reportImage: {
        width: '100%', // Full width
        height: 200,   // Set height as needed
        borderRadius: 10,
        marginBottom: 20,
        alignSelf: 'center',
    },
    description: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold', // Use Poppins Bold for descriptions
        marginVertical: 10,
        color: '#495057', // Darker text color for descriptions
    },
    info: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular', // Use Poppins Regular for info
        marginBottom: 15,
        lineHeight: 24,
        color: '#6c757d', // Gray text color for info
    },
});
