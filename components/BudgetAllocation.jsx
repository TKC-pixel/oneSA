import React, { useState, useEffect } from "react";
import { StyleSheet, Text, ScrollView, View, Pressable } from "react-native";
import axios from "axios"; 
import NavBar from "./NavBar";
import Ionicons from "@expo/vector-icons/Ionicons";
const BudgetAllocation = ({ dept, id, prov })=> {
  const [current, setCurrent] = useState(prov);
  console.log('prov', current);
  const [code, setCode] = useState(0);
  const [department, setDepartment] = useState(dept[0]);
  const [scrapedData, setScrapedData] = useState([]); 
  const cssExtractor = "%7B%22tables%22%3A%22table%22%2C%20%22rows%22%3A%22tr%22%2C%20%22cells%22%3A%22td%22%2C%20%22headers%22%3A%22th%22%7D";
  const apiKey = "984e92c064d5b5c29b0f1718435fdec919b949a8";
  const targetURL = `https://provincialgovernment.co.za/units/financial/${id[code]}}/${current}}/${department}`;
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
      output+='AUDIT OUTCOME\n\n';
      output+=`${auditOutcomes[0]}\n\n\n`
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
    <ScrollView>
      <NavBar />
      <Pressable>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Pressable onPress={() => {toggleDisplay2();setDisp('none');}}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons name="menu-outline" size={30} style={{marginTop: '-2%'}}/>
              <Text style={{marginTop: '4%'}}>Select province</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => {toggleDisplay();setDisp2('none');}}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons name="menu-outline" size={30} style={{marginTop: '-2%'}}/>
              <Text style={{marginTop: '4%'}}>Select department</Text>
            </View>
          </Pressable>
        </View>
      </Pressable>
      <View style={{display: disp2, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '10%', marginRight: 160, marginLeft: 20, padding: '3%'}}>
      {provinces.length > 0 ? ( 
        provinces.map((department, deptIndex) => (
            <Pressable
              key={deptIndex}
              style={{  marginBottom: "5%" }}
              onPress={() => {
                setCurrent(department);
                setDisp2('none');
              }}
            >
              <Text>{department}</Text>
            </Pressable>
          ))
        ) : (
          <Text>No departments available for this province.</Text>
        )}
      </View>
      <View style={{display: disp, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '10%', marginLeft: 100, padding: '3%'}}>
      {dept.length > 0 ? ( 
        dept.map((department, deptIndex) => (
            <Pressable
              key={deptIndex}
              style={{ marginBottom: "5%" }}
              onPress={() => {
                setDepartment(department); 
                setCode(deptIndex);
                setDisp('none');
              }}
            >
              <Text>{department}</Text>
            </Pressable>
          ))
        ) : (
          <Text>No departments available for this province.</Text>
        )}
      </View>
      <Text style={{marginTop: 10, fontWeight: 'bold', marginBottom: 10, fontSize: '17%'}}>Budget Allocation for the department of:</Text>
      <Text style={{fontSize: '17%'}}>{department.replace(/-/g, ' ').replace(/\b\w/, char => char.toUpperCase())} - {current.replace(/\b\w/, char => char.toUpperCase())}</Text>
      <Text>{displayData()}</Text>
    </ScrollView>
  );
};

export default BudgetAllocation;

const styles = StyleSheet.create({});
