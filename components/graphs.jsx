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
  VictoryArea,
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
      <View style={styles.chartContainer}>
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
              axisLabel: { padding: 30, fontSize: 16, fill: "#4A4A4A" },
              ticks: { stroke: "#B0B0B0" },
              tickLabels: { angle: -45, fontSize: 12, fill: "#4A4A4A" },
            }}
          />
          <VictoryAxis
            dependentAxis
            label="Amount Rands (divided by 10)"
            style={{
              axisLabel: { padding: 37, fontSize: 16, fill: "#4A4A4A" },
              ticks: { stroke: "#B0B0B0" },
              tickLabels: { fontSize: 12, padding: 1, fill: "#4A4A4A" },
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
                fill: "#4A90E2",
                width: 30,
                opacity: 0.9,
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

      <View style={styles.chartContainer}>
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
              axisLabel: { padding: 30, fontSize: 16, fill: "#4A4A4A" },
              ticks: { stroke: "#B0B0B0" },
              tickLabels: { angle: -45, fontSize: 12, fill: "#4A4A4A" },
            }}
          />
          <VictoryAxis
            dependentAxis
            label="Amount Rands (divided by 10)"
            style={{
              axisLabel: { padding: 37, fontSize: 16, fill: "#4A4A4A" },
              ticks: { stroke: "#B0B0B0" },
              tickLabels: { fontSize: 12, padding: 1, fill: "#4A4A4A" },
            }}
            domain={[0, 100000]}
            tickFormat={(x) => `${x / 1000}k`}
          />
          <VictoryGroup offset={15} colorScale={["#0DB85C", "#EDE700", "#07008C"]}>
            <VictoryBar
              data={employeeCompensation}
              x="year"
              y="amount"
              style={{
                data: {
                  width: 15,
                  opacity: 0.9,
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
                  opacity: 0.9,
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
                  opacity: 0.9,
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
          style={{ border: { stroke: "black" } }}
          data={[
            { name: "Employee Compensation", symbol: { fill: "#0DB85C" } },
            { name: "Goods and Services", symbol: { fill: "#EDE700" } },
            { name: "Capital Assets", symbol: { fill: "#07008C" } },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  chartContainer: {
    marginBottom: 20,
    marginLeft: 20, 
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
});
