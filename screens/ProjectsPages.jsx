import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../FIrebaseConfig';
import { UserContext } from '../context/UserContext';  // Import the UserContext

const ProjectPage = () => {
  const [ministers, setMinisters] = useState([]);
  const [filteredMinisters, setFilteredMinisters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState(''); // New department filter

  const { userData, setUserData } = useContext(UserContext);  // Access the current user data

  // Fetch ministers and their projects from Firestore
  useEffect(() => {
    const fetchMinisters = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ministers'));
        if (!querySnapshot.empty) {
          const ministersData = querySnapshot.docs.map(doc => doc.data());
          setMinisters(ministersData);
          setFilteredMinisters(ministersData);
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

  // Search and filter ministers by name and department
  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = ministers.filter(minister =>
      minister.ministerName?.toLowerCase().includes(text.toLowerCase()) &&
      minister.ministerDepartment.name?.toLowerCase().includes(departmentFilter.toLowerCase())
    );
    setFilteredMinisters(filtered);
  };

  // Handle department filter
  const handleDepartmentFilter = (text) => {
    setDepartmentFilter(text);
    const filtered = ministers.filter(minister =>
      minister.ministerDepartment.name?.toLowerCase().includes(text.toLowerCase()) &&
      minister.ministerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMinisters(filtered);
  };

  // Handle like action (add project to user's favorites)
  const handleLikeProject = async (project) => {
    if (!userData) return;  // Ensure the user is logged in

    try {
      const userRef = doc(db, 'Users', auth.currentUser.uid);

      // Update the user's favorites array in Firestore
      await updateDoc(userRef, {
        favorites: arrayUnion(project)  // Add project to favorites
      });

      // Update the local user data state
      setUserData(prev => ({
        ...prev,
        favorites: [...(prev.favorites || []), project]
      }));

      console.log('Project added to favorites');
    } catch (error) {
      console.error('Error liking project: ', error);
    }
  };

  // Display while data is being fetched
  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by minister name"
        value={searchTerm}
        onChangeText={handleSearch}
      />
      
      {/* Department Filter */}
      <TextInput
        style={styles.searchInput}
        placeholder="Filter by department"
        value={departmentFilter}
        onChangeText={handleDepartmentFilter}
      />

      {/* List of Ministers */}
      {filteredMinisters.length > 0 ? (
        <FlatList
          data={filteredMinisters}
          keyExtractor={(item) => item.ministerID}
          renderItem={({ item }) => (
            <View style={styles.ministerContainer}>
              {/* Minister Info */}
              <Text style={styles.ministerName}>{item.ministerName}</Text>
              <Text style={styles.bio}>{item.bio}</Text>
              
              {/* Minister Profile Image */}
              <Image
                source={{ uri: item.ministerProfileImage }}
                style={styles.profileImage}
              />
        
              {/* Minister's Projects */}
              <Text style={styles.projectHeading}>Projects:</Text>
              {item.ministerDepartment.projects && item.ministerDepartment.projects.length > 0 ? (
                <FlatList
                  data={item.ministerDepartment.projects}  // Accessing projects from ministerDepartment
                  keyExtractor={(project, index) => index.toString()}  // Ensure unique keys for the projects
                  renderItem={({ item: project }) => (
                    <View style={styles.projectContainer}>
                      <Text style={styles.projectName}>{project.projectName}</Text>
                      <Text>Status: {project.projectCompletionStatus}</Text>
                      <Text>Budget: {project.projectBudgetAllocation}</Text>
                      <Text>Start Date: {project.projectStartDate}</Text>
                      <Text>Tender Company: {project.projectTenderCompany}</Text>

                      {/* Like button to add project to favorites */}
                      <TouchableOpacity
                        style={styles.likeButton}
                        onPress={() => handleLikeProject(project)}  // Handle like action
                      >
                        <Text style={styles.likeButtonText}>Like</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              ) : (
                <Text>No projects available for this minister.</Text>
              )}
            </View>
          )}
        />
      ) : (
        <Text>No ministers found.</Text>
      )}
    </View>
  );
};

export default ProjectPage;

// Styles for the component
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
  },
  ministerContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  ministerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  projectHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  projectContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
  },
  projectName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  likeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  likeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
