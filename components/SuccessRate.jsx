import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import NavBar from "./NavBar";
import * as Font from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";
import LoadingScreen from "../components/LoadingScreen";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Graphs from "./graphs";
import { Dimensions } from "react-native";

const SuccessRate = ({ dept, id, prov }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { userData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(prov);
  const [code, setCode] = useState(0);
  const [newCodes, setNewCodes] = useState([id]);
  const [department, setDepartment] = useState(dept[0]);
  const [departmentData, setDepartmentData] = useState(dept);
  const [scrapedData, setScrapedData] = useState([]);
  const [scrapedData2, setScrapedData2] = useState({ links: [] });
  const cssExtractor =
    "%7B%22tables%22%3A%22table%22%2C%20%22rows%22%3A%22tr%22%2C%20%22cells%22%3A%22td%22%2C%20%22headers%22%3A%22th%22%7D";
  const apiKey = "e4a5f7fae9a8479a1897ea2e74f6c32668c5955a";
  const targetURL = `https://provincialgovernment.co.za/units/financial/${id[code]}/${current}/${department}`;
  const [disp, setDisp] = useState("none");
  const [disp2, setDisp2] = useState("none");
  const { width } = Dimensions.get("window");

  //my state to store data for the graphs
  const [finalAppropriation, setFinalApproapriation] = useState([]);
  const [employeeCompensation, setEmployeeCompensation] = useState([]);
  const [goodsAndServices, setGoodsAndServices] = useState([]);
  const [capitalAssets, setCapitalAssets] = useState([]);
  const [actualExpenditure, setActualExpediture] = useState([]);

  const provinces = [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "Northern Cape",
    "North West",
    "Western Cape",
  ];
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
        // console.log("Full response:", response.data.rows);
        setScrapedData(response.data.rows);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    const fetchScrapedData2 = async () => {
      const targetURL2 =
        "https://provincialgovernment.co.za/units/type/1/departments";
      const cssExtractor2 =
        "%7B%22links%22%3A%22a%20%40href%22%2C%20%22images%22%3A%22img%20%40src%22%7D";

      try {
        const response = await axios.get(
          `https://api.zenrows.com/v1/?apikey=${apiKey}&url=${targetURL2}&css_extractor=${cssExtractor2}`,
          { timeout: 70000 }
        );
        console.log(
          "fetching:",
          `https://api.zenrows.com/v1/?apikey=${apiKey}&url=${targetURL2}&css_extractor=${cssExtractor2}`
        );
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
    console.log("Filtering departments for province:", current);
    const provinceMap = {};
    const codesMap = {};

    if (scrapedData2.links.length > 0) {
      scrapedData2.links.forEach((link) => {
        if (link.startsWith("/units/view/")) {
          const parts = link.split("/");
          if (parts.length >= 6) {
            const provinceName = parts[4].replace(/-/g, " ").toLowerCase();
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

      const normalizedCurrent = current.toLowerCase().replace(/-/g, " ");
      const departments = provinceMap[normalizedCurrent] || [];
      console.log("Departments for", current, ":", departments);
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
  useEffect(() => {
    const targetURL = `https://provincialgovernment.co.za/units/financial/${id[code]}/${current}/${department}`;
    fetchScrapedData(targetURL);
  }, [department, current]);

  //this is where im structuring the scraped data
  const structure = (scrapedData) => {
    const localFinalAppropriation = [];
    const localEmployeeCompensation = [];
    const localGoodsAndServices = [];
    const localCapitalAssets = [];
    const localActualExpenditure = [];

    const headings = {
      "Total Final Appropriation": "Total Final Appropriation",
      "Actual Expenditure": "Actual Expenditure",
      "Employee Compensation": "Employee Compensation",
      "Goods and Services": "Goods and Services",
      "Capital Assets": "Capital Assets",
      "Irregular Expenditure": "Irregular Expenditure",
      "Fruitless & Wasteful Expenditure": "Fruitless & Wasteful Expenditure",
      "Posts Approved": "Posts Approved",
      "Posts Filled": "Posts Filled",
    };

    const indexOfFinalAppropriation = scrapedData.indexOf(
      "APPROPRIATION STATEMENT"
    );
    const indexOfUIFExpenditure = scrapedData.indexOf("UIFW EXPENDITURE");
    const indexOfHRm = scrapedData.indexOf("HUMAN RESOURCES");

    for (
      let i = indexOfFinalAppropriation + 1;
      i < indexOfUIFExpenditure;
      i++
    ) {
      const rowData = scrapedData[i];
      // i did it this way because regex is hard for me, please don't judge and i didnt wanna prompt chat
      const match = rowData.match(
        /(.+?)(\d{1,3}(?: \d{3})*)(\d{1,3}(?: \d{3})*)(\d{1,3}(?: \d{3})*)(\d{1,3}(?: \d{3})*)(\d{1,3}(?: \d{3})*)/
      );
      if (match) {
        const label = match[1].trim();
        const y1 = match[2];
        const y2 = match[3];
        const y3 = match[4];
        const y4 = match[5];
        const y5 = match[6];

        if (headings[label]) {
          switch (headings[label]) {
            case "Total Final Appropriation":
              localFinalAppropriation.push(
                {
                  year: "18/19",
                  amount: parseInt(y5.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "19/20",
                  amount: parseInt(y4.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "20/21",
                  amount: parseInt(y3.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "21/22",
                  amount: parseInt(y2.replace(/\s+/g, "")) / 10,
                },
                { year: "22/23", amount: parseInt(y1.replace(/\s+/g, "")) / 10 }
              );
              break;
            case "Actual Expenditure":
              localActualExpenditure.push(
                {
                  year: "18/19",
                  amount: parseInt(y5.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "19/20",
                  amount: parseInt(y4.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "20/21",
                  amount: parseInt(y3.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "21/22",
                  amount: parseInt(y2.replace(/\s+/g, "")) / 10,
                },
                { year: "22/23", amount: parseInt(y1.replace(/\s+/g, "")) / 10 }
              );
              break;
            case "Employee Compensation":
              localEmployeeCompensation.push(
                {
                  year: "18/19",
                  amount: parseInt(y5.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "19/20",
                  amount: parseInt(y4.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "20/21",
                  amount: parseInt(y3.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "21/22",
                  amount: parseInt(y2.replace(/\s+/g, "")) / 10,
                },
                { year: "22/23", amount: parseInt(y1.replace(/\s+/g, "")) / 10 }
              );
              break;
            case "Goods and Services":
              localGoodsAndServices.push(
                {
                  year: "18/19",
                  amount: parseInt(y5.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "19/20",
                  amount: parseInt(y4.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "20/21",
                  amount: parseInt(y3.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "21/22",
                  amount: parseInt(y2.replace(/\s+/g, "")) / 10,
                },
                { year: "22/23", amount: parseInt(y1.replace(/\s+/g, "")) / 10 }
              );
              break;
            case "Capital Assets":
              localCapitalAssets.push(
                {
                  year: "18/19",
                  amount: parseInt(y5.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "19/20",
                  amount: parseInt(y4.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "20/21",
                  amount: parseInt(y3.replace(/\s+/g, "")) / 10,
                },
                {
                  year: "21/22",
                  amount: parseInt(y2.replace(/\s+/g, "")) / 10,
                },
                { year: "22/23", amount: parseInt(y1.replace(/\s+/g, "")) / 10 }
              );
              break;
            default:
              console.log("No label matches");
          }
          console.log(
            `${headings[label]} \n year 22/23: ${y1}\n year 21/22:${y2}\n year 20/21: ${y3}\n year 19/20: ${y4}\n year 18/19: ${y5} \n`
          );
        }
      }
    }
    setFinalApproapriation(localFinalAppropriation);
    setActualExpediture(localActualExpenditure);
    setCapitalAssets(localCapitalAssets);
    setEmployeeCompensation(localEmployeeCompensation);
    setGoodsAndServices(localGoodsAndServices);
    console.log(
      localFinalAppropriation,
      `\n`,
      localActualExpenditure,
      `\n`,
      localEmployeeCompensation,
      `\n`,
      localGoodsAndServices,
      `\n`,
      localCapitalAssets,
      `\n`
    );
  };

  useEffect(() => {
    console.log("Scraped Data updated:", scrapedData);
    structure(scrapedData);
  }, [scrapedData]);
  const toggleDisplay = () => {
    setDisp((prevDisp) => (prevDisp === "none" ? "block" : "none"));
  };

  const toggleDisplay2 = () => {
    setDisp2((prevDisp) => (prevDisp === "none" ? "block" : "none"));
  };
  if (loading) {
    return <LoadingScreen />;
  }
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <>
      <NavBar userInfo={userArray} />
      <Pressable>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => {
              toggleDisplay2();
              setDisp("none");
            }}
            style={
              theme == "light" ? styles.pressable : darkModeStyles.pressable
            }
          >
            <Ionicons name="menu-outline" size={30} />
            <Text style={styles.buttonText}>Select province</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              toggleDisplay();
              setDisp2("none");
            }}
            style={
              theme == "light" ? styles.pressable : darkModeStyles.pressable
            }
          >
            <Ionicons name="menu-outline" size={30} />
            <Text style={styles.buttonText}>Select department</Text>
          </Pressable>
        </View>
      </Pressable>
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: width }}>
        <View
          style={[
            theme == "light" ? styles.dropdown : darkModeStyles.dropdown,
            { display: disp2 },
          ]}
        >
          {provinces.map((department, deptIndex) => (
            <Pressable
              key={deptIndex}
              style={styles.dropdownItem}
              onPress={() => {
                setCurrent(department);
                setDisp2("none");
              }}
            >
              <Text
                style={
                  theme == "light"
                    ? styles.dropdownText
                    : darkModeStyles.dropdownText
                }
              >
                {department}
              </Text>
            </Pressable>
          ))}
        </View>
        <View
          style={[
            theme == "light" ? styles.dropdown : darkModeStyles.dropdown,
            { display: disp },
          ]}
        >
          {dept.map((department, deptIndex) => (
            <Pressable
              key={deptIndex}
              style={styles.dropdownItem}
              onPress={() => {
                setDepartment(department);
                setCode(deptIndex);
                setDisp("none");
              }}
            >
              <Text
                style={
                  theme == "light"
                    ? styles.dropdownText
                    : darkModeStyles.dropdownText
                }
              >
                {department}
              </Text>
            </Pressable>
          ))}
        </View>
        <Graphs
          finalAppropriation={finalAppropriation}
          actualExpenditure={actualExpenditure}
          capitalAssets={capitalAssets}
          employeeCompensation={employeeCompensation}
          goodsAndServices={goodsAndServices}
        />
      </ScrollView>
    </>
  );
};

export default SuccessRate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Light mode background
  },
  headings: {
    fontFamily: "Poppins-Bold",
    // fontWeight: "bold",
    fontSize: "20px",
    color: "grey",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    marginTop: 8,
  },
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    elevation: 3,
  },
  buttonText: {
    marginLeft: 8,
    color: "#333333",
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    marginBottom: 9,
    padding: 4,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    color: "#333333", // Dark text for dropdown items
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  headerText: {
    fontSize: 22,
    color: "#333333", // Dark text for header
    marginVertical: 10,
    fontFamily: "Poppins-Bold",
  },
  departmentText: {
    fontSize: 20,
    color: "#333333", // Dark text for department name
    marginBottom: 12,
    fontFamily: "Poppins-SemiBold",
  },
  dataText: {
    fontSize: 16,
    color: "#333333", // Dark text for data output
    lineHeight: 24,
    padding: 12,
    backgroundColor: "#f9f9f9", // Slightly darker background for data output
    borderRadius: 8,
    marginBottom: 20,
    fontFamily: "Poppins-SemiBold",
  },
  budget: {
    fontSize: 16,
    color: "black",
    lineHeight: 24,
    fontFamily: "Poppins-Regular",
  },
});
const darkModeStyles = StyleSheet.create({
  dropdownText: {
    color: "white", // Dark text for dropdown items
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "grey",
    borderRadius: 8,
    padding: 10,
    elevation: 3,
  },
  container: {
    flex: 1,
  },
  headings: {
    fontFamily: "Poppins-Bold",
    // fontWeight: "bold",
    color: "grey",
    fontSize: "18px",
  },
  budget: {
    fontSize: 16,
    color: "white",
    lineHeight: 24,
    fontFamily: "Poppins-Regular",
  },
  headerText: {
    fontSize: 22,
    color: "white",
    marginVertical: 10,
    fontFamily: "Poppins-Bold",
  },
  departmentText: {
    fontSize: 20,
    color: "grey", // Dark text for department name
    marginBottom: 12,
    fontFamily: "Poppins-SemiBold",
  },
  dropdown: {
    backgroundColor: "grey",
    borderRadius: 6,
    marginBottom: 9,
    padding: 4,
    fontFamily: "Poppins-Regular",
    // Light border
  },
});
