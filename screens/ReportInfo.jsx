import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

export default function ReportInfo({ route, navigation }) {
    const { report } = route.params;

    const getProgressColor = (progress) => {
        switch (progress) {
            case 'In Progress':
                return '#FFC300';
            case 'Not Started':
                return 'red';
            case 'Complete':
                return 'green';
            default:
                return 'black'; 
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Image 
                source={report.image} 
                style={styles.image} 
                resizeMode="cover" 
            />
            <TouchableOpacity 
                style={styles.backBtn} 
                onPress={() => navigation.navigate('Report')}
            >
                <Icon name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.container}>
                <Text style={styles.heading}>{report.reportTitle}</Text>
                <Text style={styles.description}>{report.reportDescription}</Text>
                
                {report.department && (
                    <Text style={styles.depart}>{report.department}</Text>
                )}
                {report.progress && (
                    <Text style={[styles.progress, { color: getProgressColor(report.progress) }]}>
                        {report.progress}
                    </Text>
                )}

                {report.location && (
                    
                    <Text style={styles.location}><Icon name="location" size={13} color="red" />{report.location}</Text>
                )}
                {report.comments && (
                    <>
                    <Text style={styles.head}>Additional Comments</Text>
                    <Text style={styles.info}> {report.comments}</Text>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    backBtn: {
        position: 'absolute',
        width: 50,
        height: 50,
        backgroundColor: '#D9D9D9',
        borderRadius: 25, 
        top: 60, 
        left: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%', 
        height: 390,
        borderRadius: 45, 
    },
    description: {
        marginTop: 10,
        fontSize: 16,
    },
    depart: {
        marginTop: 12,
        fontSize: 17,
        fontWeight: 'bold'

    },
    head: {
        marginTop: 19,
        fontSize: 19,
        fontWeight: 'bold'

    },
    progress: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: '600',
    },
    info: {
        marginTop: 5,
        fontSize: 16,
    },
    location: {
        marginTop: 20,
        color: 'red'
    }
});
