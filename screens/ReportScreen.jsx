import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import NavBar from '../components/NavBar';

const favicon = require('../assets/images/Favicon.png');

export default function ReportScreen({ navigation }) {
    const dummyData = [
        {
            profileImage: favicon,
            name: "Candice",
            reportTitle: "Public Hospital Renovations",
            reportDescription: "Lerato mentions that while renovations at the Soweto General Hospital have been exhausted.",
            image: require("../assets/images/rural.jpg"),
            department: 'Department of Health and Science',
            progress: 'In Progress',
            location: 'Johannesburg General Hospital',
            comments: 'Contractors have requested an extension due to bad weather conditions last month.'
        },
        {
            profileImage: favicon,
            name: "John",
            reportTitle: "Community Center Updates",
            reportDescription: "John reports that the new community center will open next month.",
            image: require("../assets/images/rural.jpg"),
            department: 'Department of Health and Science',
            progress: 'Not Started',
            location: 'Johannesburg',
            comments: 'Contractors have requested an extension due to bad weather conditions last month.'

        },
        {
            profileImage: favicon,
            name: "Sarah",
            reportTitle: "School Construction",
            reportDescription: "Sarah highlights the progress on the new school building in the area.",
            image: require("../assets/images/rural.jpg"),
            department: 'Department of Health and Science',
            progress: 'Complete',
            location: 'Johannesburg',
            comments: 'Contractors have requested an extension due to bad weather conditions last month.'

        },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <NavBar />
    
                <Text style={styles.heading}>File a Report</Text>
    
                <View style={styles.container}>
                    {dummyData.map((data, index) => (
                        <TouchableOpacity key={index} onPress={() => navigation.navigate('ReportInfo', { report: data })} style={styles.card}>
                            <View style={styles.profileContainer}>
                                <Image source={data.profileImage} style={styles.profImage} />
                                <Text style={styles.name}>{data.name}</Text>
                            </View>
                            <Image source={data.image} style={styles.image} />
                            <View style={styles.info}>
                                <Text style={styles.name}>{data.reportTitle}</Text>
                                <Text>{data.reportDescription}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    heading: {
        marginLeft: 10,
        fontSize: 32,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: 350,
        height: 450,
        marginTop: 30,
        borderRadius: 10,
        borderColor: '#ddd', 
        borderWidth: 1, 
        padding: 10, 
    },
    profileContainer: {
        marginLeft: 15,
        alignItems: 'center',
        flexDirection: 'row'
    },
    profImage: {
        borderWidth: 1,
        backgroundColor: 'grey',
        width: 35,
        height: 35,
        borderRadius: 50, 
    },
    name: {
        marginLeft: 7,
        fontSize: 18,
        fontWeight: '600',
    },
    image: {
        marginTop: 10,
        marginLeft: 16,
        width: 300,
        height: 300,
        borderRadius: 10,
    },
    info: {
        marginLeft: 20,
    }
});
