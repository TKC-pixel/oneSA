import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, ScrollView, View, Pressable, ActivityIndicator } from "react-native";
import axios from "axios"; 
import NavBar from "./NavBar";
import * as Font from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";
import LoadingScreen from '../components/LoadingScreen';
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";

const BudgetAllocation = ({ dept, id, prov }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { userData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [departmentData, setDepartmentData] = useState(dept);
  const [current, setCurrent] = useState(prov);
  const [code, setCode] = useState(0);
  const [newCodes, setNewCodes] = useState([id]);
  const [department, setDepartment] = useState(departmentData[0]);
  const [scrapedData, setScrapedData] = useState([]); 
  const [scrapedData2, setScrapedData2] = useState({ links: [] });
  const cssExtractor = "%7B%22tables%22%3A%22table%22%2C%20%22rows%22%3A%22tr%22%2C%20%22cells%22%3A%22td%22%2C%20%22headers%22%3A%22th%22%7D";
  const apiKey = "1232de8bee06751cfdd2b48d0b8157e289d320fb";
  const [disp, setDisp] = useState("none");
  const [disp2, setDisp2] = useState("none");
  const provinces = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"];
  const userArray = Array.isArray(userData) ? userData : [userData];

  const fetchScrapedData = async (targetURL) => {
    try {
      const response = await axios.get(
        `https://api.zenrows.com/v1/?apikey=${apiKey}&url=${targetURL}&css_extractor=${cssExtractor}`,
        { timeout: 10000 }
      );

      if (response.data.error) {
        console.log("ZenRows Error:", response.data.error);
      } else {
        setScrapedData(response.data.rows); 
      }
    } catch (error) {
      console.log("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchScrapedData2 = async () => {
      const targetURL2 = "https://provincialgovernment.co.za/units/type/1/departments";
      const cssExtractor2 = "%7B%22links%22%3A%22a%20%40href%22%2C%20%22images%22%3A%22img%20%40src%22%7D";
    
      try {
        const response = await axios.get(
          `https://api.zenrows.com/v1/?apikey=${apiKey}&url=${targetURL2}&css_extractor=${cssExtractor2}`,
          { timeout: 70000 }
        );
        console.log('fetching:', `https://api.zenrows.com/v1/?apikey=${apiKey}&url=${targetURL2}&css_extractor=${cssExtractor2}`)
        if (response.data && response.data.links) {
          setScrapedData2({ links: response.data.links });
        } else {
          console.warn("No valid links found in the response.");
          setScrapedData2({ links: [] });
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchScrapedData2();
  }, []); 

  const filterDepartmentsByProvince = (current) => {
    console.log('Filtering departments for province:', current);
    const provinceMap = {};
    const codesMap = {};
    
    if (scrapedData2.links.length > 0) {
        scrapedData2.links.forEach((link) => {
            if (link.startsWith("/units/view/")) {
                const parts = link.split("/");
                if (parts.length >= 6) {
                    const provinceName = parts[4].replace(/-/g, ' ').toLowerCase();
                    const departmentName = parts[5];
                    const departmentCode = parts[3];
                    if (!provinceMap[provinceName]) {
                      provinceMap[provinceName] = [];
                      codesMap[provinceName] = [];
                    }
                    provinceMap[provinceName].push(departmentName);
                    codesMap[provinceName].push(departmentCode);
                }
            }
        });

        const normalizedCurrent = current.toLowerCase().replace(/-/g, ' ');
        const departments = provinceMap[normalizedCurrent] || [];
        console.log('Departments for', current, ':', departments);
        setDepartmentData(departments);
        
        const codes = codesMap[normalizedCurrent] || [];
        if (departments.length > 0) {
          setDepartment(departments[0]);
          setNewCodes(codes);
        } else {
          setDepartmentData(["No departments found"]);
          setDepartment("No departments found");
          setNewCodes([]);
        }
    } else {
        console.error("No links available to filter.");
        setDepartmentData(["No departments found"]);
        setDepartment("No departments found");
        setNewCodes([]);
    }
  };

  useEffect(() => {
    if (scrapedData2.links.length > 0) {
      filterDepartmentsByProvince(current);
    }
  }, [scrapedData2, current]);

  useEffect(() => {
    if (newCodes.length > 0 && department !== "No departments found") {
      setLoading(true); 
      const targetURL = `https://provincialgovernment.co.za/units/financial/${newCodes[code]}/${current}/${department}`;
      fetchScrapedData(targetURL);
    }
  }, [newCodes, department, current, code]);

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

  const displayData = () => {
    if (loading) return <Text>Loading...</Text>; 
    if (!scrapedData || !Array.isArray(scrapedData) || scrapedData.length === 0) {
        return <Text>No data available</Text>;
    }
    
    let outputHeading = "\n";
    let output = "";
    
    let output2Heading='\n';
    let output2 = "";
    
    let output3Heading='\n';
    let output3 = "";

    let output4Heading='\n';
    let output4 = "";

    const mappings = {
      "Total Final Appropriation": "Total Final Appropriation                         R ",
      "Actual Expenditure": "Actual Expenditure                                    R ",
      "Employee Compensation": "Employee Compensation                        R ",
      "Goods and Services": "Goods and Services                                  R ",
      "Capital Assets": "Capital Assets                                            R ",
      "Irregular Expenditure": "Irregular Expenditure                                R ",
      "Fruitless & Wasteful Expenditure": "Fruitless & Wasteful Expenditure           R ",
      "Posts Approved": "Posts Approved                                         R ",
      "Posts Filled": "Posts Filled                                                  R ",
    };
    
    const auditOutcomeRow = scrapedData[2];
    const auditOutcomeMatch = auditOutcomeRow.match(/AUDIT OUTCOME (.+)/);
    let auditOutcomes = [];
    if (auditOutcomeMatch) {
      auditOutcomes = auditOutcomeMatch[1].match(/(Financially Unqualified|Clean Audit|Qualified Audit|Adverse Audit)/g);
    }

    if (auditOutcomes.length > 0) {
      outputHeading += 'AUDIT OUTCOME\n\n';
      output += `${auditOutcomes[0]}`
    }

    const appropriationsIndex = scrapedData.indexOf("APPROPRIATION STATEMENT");
    const uifwIndex = scrapedData.indexOf("UIFW EXPENDITURE");
    const humanResourcesIndex = scrapedData.indexOf("HUMAN RESOURCES");

    output2Heading += "APPROPRIATION STATEMENT\n";
    for (let i = appropriationsIndex + 1; i < uifwIndex; i++) {
      const rowData = scrapedData[i];
      const match = rowData.match(/(.+?)(\d{1,3}(?: \d{3})*)/);
      if (match) {
        const label = match[1].trim();
        const value = match[2];
        if (mappings[label]) {
          output2 += `${mappings[label]}${value}\n`;
        }
      }
    }

    output3Heading += "UIFW EXPENDITURE\n";
    
    for (let i = uifwIndex; i < humanResourcesIndex; i++) {
      const rowData = scrapedData[i];
      const match = rowData.match(/(.+?)(\d{1,2}(?: \d{3})*)/);
      
      if (match) {
        const label = match[1].trim();
        let value = match[2].trim(); 
        value = value.slice(0, 5);
        if (mappings[label]) {
          output3 += `${mappings[label]}${value}\n`;
        } 
        else {
          output3 += `No funds found ${'\n'}`;
          // console.log('Unmapped label:', label); 
        }
      }
    }

    output4Heading += "HUMAN RESOURCES\n";
    
    for (let i = humanResourcesIndex + 1; i < scrapedData.length; i++) {
      const rowData = scrapedData[i];
      const match = rowData.match(/(.+?)(\d{1,3}(?: \d{3})*)/);

      if (match) {
        const label = match[1].trim();
        const value = match[2];
        if (mappings[label]) {
          output4 += `${mappings[label]}${value}\n`;
        }
      }
    }

    return(
      <View style={{backgroundColor: theme=='light'? 'white': 'black'}}>
        <Text style={theme=='light'? styles.headings : darkModeStyles.headings}>{outputHeading}</Text>
        <Text style={theme=='light'? styles.budget : darkModeStyles.budget}>{output}</Text>
        <Text style={theme=='light'? styles.headings : darkModeStyles.headings}>{output2Heading}</Text>
        <Text style={theme=='light'? styles.budget : darkModeStyles.budget}>{output2}</Text>
        <Text style={theme=='light'? styles.headings : darkModeStyles.headings}>{output3Heading}</Text>
        <Text style={theme=='light'? styles.budget : darkModeStyles.budget}>{output3}</Text>
        <Text style={theme=='light'? styles.headings : darkModeStyles.headings}>{output4Heading}</Text>
        <Text style={theme=='light'? styles.budget : darkModeStyles.budget}>{output4}</Text>
      </View>
    );
  };

  const toggleDisplay = () => {
    setDisp((prevDisp) => (prevDisp === "none" ? "block" : "none"));
  };

  const toggleDisplay2 = () => {
    setDisp2((prevDisp) => (prevDisp === "none" ? "block" : "none"));
  };
  if (loading) {
    return <LoadingScreen/>
  }
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  
  return (
    <SafeAreaView style={{backgroundColor: theme=='light'? 'white': 'black', flex: 1, width: '111.5%', marginLeft: '-6%'}}>
      <ScrollView style={{ flex:1,  padding: '4%'}}>
      <NavBar userInfo={userArray} />
      <Pressable>
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => {toggleDisplay2(); setDisp('none');}} style={theme =='light'? styles.pressable : darkModeStyles.pressable}>
            <Ionicons name="menu-outline" size={30} />
            <Text style={styles.buttonText}>Select province</Text>
          </Pressable>
          <Pressable onPress={() => {toggleDisplay(); setDisp2('none');}} style={theme =='light'? styles.pressable : darkModeStyles.pressable}>
            <Ionicons name="menu-outline" size={30} />
            <Text style={styles.buttonText}>Select department</Text>
          </Pressable>
        </View>
      </Pressable>
      <View style={[theme=='light' ? styles.dropdown : darkModeStyles.dropdown, { display: disp2 }]}>
        {provinces.map((department, deptIndex) => (
          <Pressable
            key={deptIndex}
            style={styles.dropdownItem}
            onPress={() => {
              setCurrent(department);
              setDisp2('none');
            }}
          >
            <Text style={theme=='light' ? styles.dropdownText : darkModeStyles.dropdownText}>{department}</Text>
          </Pressable>
        ))}
      </View>
      <View style={[theme=='light' ? styles.dropdown : darkModeStyles.dropdown, { display: disp }]}>
        {departmentData.map((department, deptIndex) => (
          <Pressable
            key={deptIndex}
            style={styles.dropdownItem}
            onPress={() => {
              setDepartment(department); 
              setCode(deptIndex);
              setDisp('none');
              setScrapedData([]);
              setLoading(true);

            }}
          >
            <Text style={theme=='light' ? styles.dropdownText : darkModeStyles.dropdownText}>{department}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={theme=='light' ? styles.headerText : darkModeStyles.headerText}>Budget Allocation for the department of:</Text>
      <Text style={theme=='light' ? styles.departmentText: darkModeStyles.departmentText}>
  {department ? department.replace(/-/g, ' ').replace(/\b\w/, char => char.toUpperCase()) : 'No Department Selected'} -  
  { current ? current.replace(/\b\w/, char => char.toUpperCase()) : 'No Province Selected'}
</Text>

      <Text>{displayData()}</Text>
    </ScrollView>
    </SafeAreaView>
  );
};

export default BudgetAllocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
     // Light mode background
  },
  headings: {
    fontFamily: "Poppins-Bold",
    fontWeight: 'bold',
    fontSize: '20px',
    color: 'grey'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    marginTop: 8
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', 
    borderRadius: 8,
    padding: 10,
    elevation: 3,
  },
  buttonText: {
    marginLeft: 8,
    color: '#333333',
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#f0f0f0', 
    borderRadius: 6,
    marginBottom: 9,
    padding: 4,
    
  },
  dropdownItem: {
    padding: 10,
    
  },
  dropdownText: {
    color: '#333333', // Dark text for dropdown items
    fontSize: 16,
  },
  headerText: {
    fontSize: 22,
    color: '#333333', // Dark text for header
    marginVertical: 10,
  },
  departmentText: {
    fontSize: 20,
    color: '#333333', // Dark text for department name
    marginBottom: 12,
  },
  dataText: {
    fontSize: 16,
    color: '#333333', // Dark text for data output
    lineHeight: 24,
    padding: 12,
    backgroundColor: '#f9f9f9', // Slightly darker background for data output
    borderRadius: 8,
    marginBottom: 20,
  },
  budget:{
    fontSize: 16,
    color: 'black', 
    lineHeight: 24,
    fontFamily: "Poppins-Regular",
  }
});
const darkModeStyles = StyleSheet.create({
  dropdownText: {
    color: 'white', // Dark text for dropdown items
    fontSize: 16,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'grey', 
    borderRadius: 8,
    padding: 10,
    elevation: 3,
  },
  container: {
    flex: 1,
    
  },
  headings: {
    fontFamily: "Poppins-Bold",
    fontWeight: 'bold',
    color: 'grey',
    fontSize: '18px',
  },
  budget:{
    fontSize: 16,
    color: 'white', 
    lineHeight: 24,
    fontFamily: "Poppins-Regular",
  },
  headerText: {
    fontSize: 22,
    color: 'white', 
    marginVertical: 10,
  },
  departmentText: {
    fontSize: 20,
    color: 'grey', // Dark text for department name
    marginBottom: 12,
  },
  dropdown: {
    backgroundColor: 'grey', 
    borderRadius: 6,
    marginBottom: 9,
    padding: 4,
     // Light border
  },
});
