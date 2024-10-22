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
              axisLabel: {
                padding: 30,
                fontSize: 16,
                fill: "#333",
                fontFamily: "Poppins-SemiBold",
              },
              ticks: { stroke: "#B0B0B0" },
              tickLabels: {
                angle: -45,
                fontSize: 12,
                fill: "#555",
                fontFamily: "Poppins-SemiBold",
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            label="Amount Rands (divided by 10)"
            style={{
              axisLabel: {
                padding: 37,
                fontSize: 16,
                fill: "#333",
                fontFamily: "Poppins-SemiBold",
              },
              ticks: { stroke: "#B0B0B0" },
              tickLabels: {
                fontSize: 12,
                padding: 1,
                fill: "#555",
                fontFamily: "Poppins-SemiBold",
              },
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
                cornerRadius: { top: 10 },
                borderRadius: 10,
              },
              labels: {
                fontSize: 12,
                fontFamily: "Poppins-SemiBold",
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
              axisLabel: {
                padding: 30,
                fontSize: 110,
                fill: "#333",
                fontFamily: "Poppins-SemiBold",
              },
              ticks: { stroke: "#B0B0B0" },
              tickLabels: {
                angle: -45,
                fontSize: 12,
                fill: "#555",
                fontFamily: "Poppins-SemiBold",
              },
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
                  cornerRadius: { top: 10 },
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
                  cornerRadius: { top: 10 },
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
                  cornerRadius: { top: 10 },
                },
              }}
              labels={({ datum }) => `${datum.amount.toFixed(2)}k`}
              labelComponent={<VictoryTooltip />}
            />
          </VictoryGroup>
        </VictoryChart>
        <VictoryLegend
          x={5}
          y={0}
          orientation="vertical"
          gutter={20}
          style={{
            border: { stroke: "transparent" },
            borderRadius: 15,
            labels: {
              fontSize: 12,
              fill: "#333",
              fontFamily: "Poppins-SemiBold",
            },
          }}
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
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
    color: "#34495e",
    fontFamily: "Poppins-Bold",
  },
  axisLabel: {
    fontFamily: "Poppins-SemiBold",
  },
  tickLabel: {
    fontFamily: "Poppins-SemiBold",
  },
});
