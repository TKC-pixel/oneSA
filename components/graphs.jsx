import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import {
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryAxis,
  VictoryTooltip,
  VictoryContainer,
  VictoryGroup,
  VictoryLegend,
} from "victory-native";

export default function Graphs({
  finalAppropriation,
  actualExpenditure,
  capitalAssets,
  employeeCompensation,
  goodsAndServices,
}) {
  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.card}>
        <Text style={styles.title}>Annual Appropriation</Text>
        <VictoryChart
          animate={{ duration: 1000 }}
          theme={VictoryTheme.material}
          containerComponent={<VictoryContainer responsive />}
          domainPadding={{ x: [20, 20], y: [0, 0] }}
          height={250}
          width={350}
        >
          <VictoryAxis
            label="Year"
            style={{
              axisLabel: { padding: 30, fontSize: 16, fill: "#333" },
              ticks: { stroke: "#B0B0B0" },
              tickLabels: { angle: -45, fontSize: 12, fill: "#555" },
            }}
          />
          <VictoryAxis
            dependentAxis
            label="Amount Rands (divided by 10)"
            style={{
              axisLabel: { padding: 37, fontSize: 16, fill: "#333" },
              ticks: { stroke: "#B0B0B0" },
              tickLabels: { fontSize: 12, padding: 1, fill: "#555" },
            }}
            domain={[0, 120000]}
            tickFormat={(x) => `${x / 1000}k`}
          />
          <VictoryBar
            data={finalAppropriation}
            x="year"
            y="amount"
            style={{
              data: {
                fill: "#1dd3b0", 
                width: 30,
                opacity: 0.95,
              },
              labels: {
                fontSize: 12,
              },
            }}
            labels={({ datum }) => `${datum.amount.toFixed(2)}k`}
            labelComponent={<VictoryTooltip />}
          />
        </VictoryChart>
      </View>

     
      <View style={styles.card}>
        <Text style={styles.title}>Expenditure Categories</Text>
        <VictoryChart
          animate={{ duration: 1000 }}
          theme={VictoryTheme.material}
          containerComponent={<VictoryContainer responsive />}
          domainPadding={{ x: [25, 20], y: [0, 0] }}
          height={250}
          width={350}
        >
          <VictoryAxis
            label="Year"
            style={{
              axisLabel: { padding: 30, fontSize: 16, fill: "#333" },
              ticks: { stroke: "#B0B0B0" },
              tickLabels: { angle: -45, fontSize: 12, fill: "#555" },
            }}
          />
          <VictoryAxis
            dependentAxis
            label="Amount Rands (divided by 10)"
            style={{
              axisLabel: { padding: 37, fontSize: 16, fill: "#333" },
              ticks: { stroke: "#B0B0B0" },
              tickLabels: { fontSize: 12, padding: 1, fill: "#555" },
            }}
            domain={[0, 100000]}
            tickFormat={(x) => `${x / 1000}k`}
          />
          <VictoryGroup
            offset={15}
            colorScale={["#072ac8", "#1e96fc", "#1a659e"]} 
          >
            <VictoryBar
              data={employeeCompensation}
              x="year"
              y="amount"
              style={{
                data: {
                  width: 15,
                  opacity: 0.95,
                },
              }}
              labels={({ datum }) => `${datum.amount.toFixed(2)}k`}
              labelComponent={<VictoryTooltip />}
            />
            <VictoryBar
              data={goodsAndServices}
              x="year"
              y="amount"
              style={{
                data: {
                  width: 15,
                  opacity: 0.95,
                },
              }}
              labels={({ datum }) => `${datum.amount.toFixed(2)}k`}
              labelComponent={<VictoryTooltip />}
            />
            <VictoryBar
              data={capitalAssets}
              x="year"
              y="amount"
              style={{
                data: {
                  width: 15,
                  opacity: 0.95,
                },
              }}
              labels={({ datum }) => `${datum.amount.toFixed(2)}k`}
              labelComponent={<VictoryTooltip />}
            />
          </VictoryGroup>
        </VictoryChart>
        <VictoryLegend
          x={0}
          y={0}
          orientation="vertical"
          gutter={20}
          style={{ border: { stroke: "transparent" } }}
          data={[
            { name: "Employee Compensation", symbol: { fill: "#072ac8" } },
            { name: "Goods and Services", symbol: { fill: "#1e96fc" } },
            { name: "Capital Assets", symbol: { fill: "#1a659e" } },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f4f4f4", 
  },
  card: {
    backgroundColor: "#fff", 
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50", 
  },
});
