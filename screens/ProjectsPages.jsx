import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../FIrebaseConfig';
import { UserContext } from '../context/UserContext';
import * as Font from "expo-font";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext'; // Import your theme context
import LoadingScreen from '../components/LoadingScreen';
const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { userData, setUserData } = useContext(UserContext);
  const { theme } = useContext(ThemeContext); 
  const navigation = useNavigation();

  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  useEffect(() => {
    const fetchMinisters = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ministers'));
        if (!querySnapshot.empty) {
          const ministersData = querySnapshot.docs.map(doc => doc.data());
          const allProjects = ministersData.flatMap(minister => minister.ministerDepartment.projects || []);
          // Sort projects by start date (latest first)
          const sortedProjects = allProjects.sort((a, b) => new Date(b.projectStartDate) - new Date(a.projectStartDate));
          setProjects(sortedProjects);
          setFilteredProjects(sortedProjects);
        } else {
          console.log('No documents found in the ministers collection.');
        }
      } catch (error) {
        console.error('Error fetching ministers: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMinisters();
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = projects.filter(project =>
      project.projectName?.toLowerCase().includes(text.toLowerCase()) &&
      project.projectDepartment?.toLowerCase().includes(departmentFilter.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleDepartmentFilter = (text) => {
    setDepartmentFilter(text);
    const filtered = projects.filter(project =>
      project.projectDepartment?.toLowerCase().includes(text.toLowerCase()) &&
      project.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleLikeProject = async (project) => {
    if (!userData) return;

    const isAlreadyLiked = userData.favorites?.some(fav => fav.projectName === project.projectName);

    try {
      const userRef = doc(db, 'Users', auth.currentUser.uid);
      if (isAlreadyLiked) {
        await updateDoc(userRef, {
          favorites: arrayRemove(project)
        });
        setUserData(prev => ({
          ...prev,
          favorites: prev.favorites.filter(fav => fav.projectName !== project.projectName)
        }));
        console.log('Project removed from favorites');
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(project)
        });
        setUserData(prev => ({
          ...prev,
          favorites: [...(prev.favorites || []), project]
        }));
        console.log('Project added to favorites');
      }
    } catch (error) {
      console.error('Error updating favorites: ', error);
    }
  };

  const navigateToProjectDetails = (project) => {
    navigation.navigate('ProjectDetails', { project });
  };

  if (loading) {
    return <LoadingScreen/>
  }

  return (
    <SafeAreaView style={theme === "light" ? styles.container : darkModeStyles.container}>
      <TextInput
        style={theme === "light" ? styles.searchInput : darkModeStyles.searchInput}
        placeholder="Search by project name"
        placeholderTextColor={theme === "light" ? "#aaa" : "#ccc"} // Change placeholder color based on theme
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <TextInput
        style={theme === "light" ? styles.searchInput : darkModeStyles.searchInput}
        placeholder="Filter by department"
        placeholderTextColor={theme === "light" ? "#aaa" : "#ccc"}
        value={departmentFilter}
        onChangeText={handleDepartmentFilter}
      />

      {filteredProjects.length > 0 ? (
        <FlatList
          data={filteredProjects}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: project }) => (
            <View style={theme === "light" ? styles.projectContainer : darkModeStyles.projectContainer}>
              <TouchableOpacity onPress={() => navigateToProjectDetails(project)}>
                <Text style={theme === "light" ? styles.projectName : darkModeStyles.projectName}>{project.projectName}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLikeProject(project)} style={styles.likeButton}>
                <Ionicons
                  name={userData.favorites?.some(fav => fav.projectName === project.projectName) ? 'heart' : 'heart-outline'}
                  size={24}
                  color="red"
                />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={theme === "light" ? styles.noProjectsText : darkModeStyles.noProjectsText}>No projects found.</Text>
      )}
    </SafeAreaView>
  );
};

export default ProjectPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 20,
    fontFamily: 'Poppins-Regular'
  },
  projectContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectName: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  likeButton: {
    paddingLeft: 10,
  },
  noProjectsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
});

// Dark mode styles
const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212', // Dark background
  },
  searchInput: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
    color: '#fff', // White text
  },
  projectContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#1e1e1e', // Darker project background
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectName: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#fff', // White text for project name
  },
  noProjectsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ccc', // Lighter text for no projects
  },
});
