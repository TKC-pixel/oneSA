import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';
import { ThemeContext } from '../context/ThemeContext';

const NewsPage = ({ navigation }) => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useContext(ThemeContext);

  const fetchNews = async (query = '') => {
    setLoading(true);
    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query || 'South Africa economy',
          language: 'en',
          pageSize: 10,
          apiKey: 'd818bfd8d12940ff8d46d2e58aafe2bd',
        },
      });
      setNewsData(response.data.articles);
    } catch (error) {
      console.error('Error fetching news data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = () => {
    fetchNews(searchQuery);
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.newsItem,
        { backgroundColor: theme === 'light' ? '#ffffff' : '#333' }
      ]}
      onPress={() => navigation.navigate('NewsDetails', { article: item })}
    >
      {item.urlToImage ? (
        <Image source={{ uri: item.urlToImage }} style={styles.thumbnail} />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      <View style={styles.newsContent}>
        <Text style={[styles.newsTitle, { color: theme === 'light' ? '#333' : '#ffffff' }]}>{item.title}</Text>
        <Text style={[styles.newsDate, { color: theme === 'light' ? '#999' : '#ccc' }]}>
          {new Date(item.publishedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e' }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme === 'light' ? '#f0f0f0' : '#333',
              color: theme === 'light' ? '#000' : '#fff',
            },
          ]}
          placeholder="Search news..."
          placeholderTextColor={theme === 'light' ? '#999' : '#777'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <LoadingScreen />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={newsData}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.url}
        />
      )}
    </SafeAreaView>
  );
};

export default NewsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Regular',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#B7C42E',
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  newsItem: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  noImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  noImageText: {
    color: '#ddd',
    fontSize: 12,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  newsDate: {
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Poppins-SemiBold',
  },
});
