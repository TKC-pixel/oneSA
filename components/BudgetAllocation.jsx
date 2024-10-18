import React, { useState, useEffect } from "react";
import { StyleSheet, Text, ScrollView, View, Pressable } from "react-native";
import axios from "axios"; 
import NavBar from "./NavBar";
import Ionicons from "@expo/vector-icons/Ionicons";

const BudgetAllocation = ({ dept, id, prov }) => {
  const [current, setCurrent] = useState(prov);
  const [code, setCode] = useState(0);
  const [department, setDepartment] = useState(dept[0]);
  const [scrapedData, setScrapedData] = useState([]); 
  const cssExtractor = "%7B%22tables%22%3A%22table%22%2C%20%22rows%22%3A%22tr%22%2C%20%22cells%22%3A%22td%22%2C%20%22headers%22%3A%22th%22%7D";
  const apiKey = "984e92c064d5b5c29b0f1718435fdec919b949a8";
  const targetURL = `https://provincialgovernment.co.za/units/financial/${id[code]}/${current}/${department}`;
  const [disp, setDisp] = useState("none");
  const [disp2, setDisp2] = useState("none");
  const provinces = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"];

  const fetchScrapedData = async (targetURL) => {
    try {
      const response = await axios.get(
        `https://api.zenrows.com/v1/?apikey=${apiKey}&url=${targetURL}&css_extractor=${cssExtractor}`,
        { timeout: 10000 }
      );

      if (response.data.error) {
        console.log("ZenRows Error:", response.data.error);
      } else {
        console.log("Full response:", response.data.rows);
        setScrapedData(response.data.rows); 
      }
    } catch (error) {
      console.log("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    const targetURL = `https://provincialgovernment.co.za/units/financial/${id[code]}/${current}/${department}`;
    fetchScrapedData(targetURL); 
  }, [department, current]);

  useEffect(() => {
    console.log("Scraped Data updated:", scrapedData);
  }, [scrapedData]);

  const displayData = () => {
    if (!scrapedData.length) return "Loading"; 

    let output = "\n\n";

    const mappings = {
      "Total Final Appropriation": "Total Final Appropriation                         R ",
      "Actual Expenditure": "Actual Expenditure                                  R ",
      "Employee Compensation": "Employee Compensation                        R ",
      "Goods and Services": "Goods and Services                                R ",
      "Capital Assets": "Capital Assets                                         R ",
      "Irregular Expenditure": "Irregular Expenditure                             R ",
      "Fruitless & Wasteful Expenditure": "Fruitless & Wasteful Expenditure          R ",
      "Posts Approved": "Posts Approved                                      R ",
      "Posts Filled": "Posts Filled                                             R ",
    };
    
    const auditOutcomeRow = scrapedData[2];
    const auditOutcomeMatch = auditOutcomeRow.match(/AUDIT OUTCOME (.+)/);
    let auditOutcomes = [];
    if (auditOutcomeMatch) {
      auditOutcomes = auditOutcomeMatch[1].match(/(Financially Unqualified|Clean Audit|Qualified Audit|Adverse Audit)/g);
    }

    if (auditOutcomes.length > 0) {
      output += 'AUDIT OUTCOME\n\n';
      output += `${auditOutcomes[0]}\n\n\n`
    }

    const appropriationsIndex = scrapedData.indexOf("APPROPRIATION STATEMENT");
    const uifwIndex = scrapedData.indexOf("UIFW EXPENDITURE");
    const humanResourcesIndex = scrapedData.indexOf("HUMAN RESOURCES");

    output += "APPROPRIATION STATEMENT\n\n";
    for (let i = appropriationsIndex + 1; i < uifwIndex; i++) {
      const rowData = scrapedData[i];
      const match = rowData.match(/(.+?)(\d{1,3}(?: \d{3})*)/);
      if (match) {
        const label = match[1].trim();
        const value = match[2];
        if (mappings[label]) {
          output += `${mappings[label]}${value}\n`;
        }
      }
    }

    output += "\nUIFW EXPENDITURE\n\n";
    
    for (let i = uifwIndex; i < humanResourcesIndex; i++) {
      const rowData = scrapedData[i];
      const match = rowData.match(/(.+?)(\d{1,2}(?: \d{3})*)/);
      
      if (match) {
        const label = match[1].trim();
        let value = match[2].trim(); 
        value = value.slice(0, 5);
        if (mappings[label]) {
          output += `${mappings[label]}${value}\n`;
        } 
        else {
          output += `No funds found ${'\n'}`;
          console.log('Unmapped label:', label); 
        }
      }
    }

    output += "\nHUMAN RESOURCES\n\n";
    
    for (let i = humanResourcesIndex + 1; i < scrapedData.length; i++) {
      const rowData = scrapedData[i];
      const match = rowData.match(/(.+?)(\d{1,3}(?: \d{3})*)/);

      if (match) {
        const label = match[1].trim();
        const value = match[2];
        if (mappings[label]) {
          output += `${mappings[label]}${value}\n`;
        }
      }
    }

    return output;
  };

  const toggleDisplay = () => {
    setDisp((prevDisp) => (prevDisp === "none" ? "block" : "none"));
  };

  const toggleDisplay2 = () => {
    setDisp2((prevDisp) => (prevDisp === "none" ? "block" : "none"));
  };

  return (
    <ScrollView style={styles.container}>
      <NavBar />
      <Pressable>
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => {toggleDisplay2(); setDisp('none');}} style={styles.pressable}>
            <Ionicons name="menu-outline" size={30} />
            <Text style={styles.buttonText}>Select province</Text>
          </Pressable>
          <Pressable onPress={() => {toggleDisplay(); setDisp2('none');}} style={styles.pressable}>
            <Ionicons name="menu-outline" size={30} />
            <Text style={styles.buttonText}>Select department</Text>
          </Pressable>
        </View>
      </Pressable>
      <View style={[styles.dropdown, { display: disp2 }]}>
        {provinces.map((department, deptIndex) => (
          <Pressable
            key={deptIndex}
            style={styles.dropdownItem}
            onPress={() => {
              setCurrent(department);
              setDisp2('none');
            }}
          >
            <Text style={styles.dropdownText}>{department}</Text>
          </Pressable>
        ))}
      </View>
      <View style={[styles.dropdown, { display: disp }]}>
        {dept.map((department, deptIndex) => (
          <Pressable
            key={deptIndex}
            style={styles.dropdownItem}
            onPress={() => {
              setDepartment(department); 
              setCode(deptIndex);
              setDisp('none');
            }}
          >
            <Text style={styles.dropdownText}>{department}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.headerText}>Budget Allocation for the department of:</Text>
      <Text style={styles.departmentText}>
  {department ? department.replace(/-/g, ' ').replace(/\b\w/, char => char.toUpperCase()) : 'No Department Selected'} - 
  {current ? current.replace(/\b\w/, char => char.toUpperCase()) : 'No Province Selected'}
</Text>

      <Text style={styles.dataText}>{displayData()}</Text>
    </ScrollView>
  );
};

export default BudgetAllocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Light mode background
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
    backgroundColor: '#f0f0f0', // Light background for buttons
    borderRadius: 8,
    padding: 10,
    elevation: 3,
  },
  buttonText: {
    marginLeft: 8,
    color: '#333333', // Dark text for readability
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#ffffff', // White background for dropdowns
    borderRadius: 8,
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#cccccc', // Light border
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: '#cccccc', // Light border for items
    borderBottomWidth: 1,
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
});
