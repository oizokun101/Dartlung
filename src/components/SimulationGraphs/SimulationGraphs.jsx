import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SimulationGraphs = ({ age = 1, time, isRunning, sex = "Female" }) => {
  const [data, setData] = useState([]);

  // Convert sex string to numerical value
  const sexValue = sex === "Male" ? 0 : 1;

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    // Function to calculate weight, length, compliance, airway radius, resistance, and respiratory rate
    const calculateParameters = (sex, age) => {
      let weight, length, C, airwayRadius, R, RR;

      if (sex === 0) {
        // Male
        weight = 3.34 + 0.2 * age;
        length = (50 + 0.8 * age) * 0.01; // cm to m
        C = 0.88 * Math.pow(weight, 1.09);
        airwayRadius = (0.2 * weight + 4.5) / 1000; // m
        R =
          ((8 * 0.05 * 1.8e-5) / (Math.PI * Math.pow(airwayRadius, 4))) *
          0.0102; // cmH2O  the big resitance number messes up the graph
        RR = -1.71 * weight + 40.57; // breaths/min
      } else {
        // Female
        weight = 3.5 + 0.2325 * age;
        length = (50.9 + 0.8625 * age) * 0.01; // cm to m
        C = 0.88 * Math.pow(weight, 1.09);
        // C = 5.36e-4 * Math.pow(length * 100, 2.27); // length back to cm for this calculation
        airwayRadius = (0.2 * weight + 4.5) / 1000; // m
        R =
          ((8 * 0.05 * 1.8e-5) / (Math.PI * Math.pow(airwayRadius, 4))) *
          0.0102; // cmH2O
        RR = -1.71 * weight + 40.57; // breaths/min
      }

      return { weight, length, C, airwayRadius, R, RR };
    };

    // Calculate parameters based on age and sex
    const { R, C, RR } = calculateParameters(sexValue, age);

    // Define additional parameters
    const Pmax = 20; // Maximum pressure (cmH2O)
    const omega = (2 * Math.PI * RR) / 60; // Convert breaths/min to rad/sec
    const L = 0.3; // Inertance parameter

    // Time step (seconds)
    const dt = 0.01;
    const t = time / 1000;

    // Simulate respiratory model using Euler method
    const simulateRespiration = (t) => {
      // Initialize arrays to store solutions
      const tValues = [];
      const QValues = [];
      const VValues = [];
      const PalvValues = [];
      const PmusValues = [];

      // Initial conditions
      let Q = 0; // Flow rate
      let V = 0; // Volume
      let Palv = 0; // Alveolar pressure

      // Number of steps (simulate for enough points to show proper waveform)
      const numSteps = Math.min(Math.floor(t / dt) + 1, 6000); // Limit to 6000 points max

      // Euler integration
      for (let i = 0; i < numSteps; i++) {
        const currentTime = i * dt;

        // Calculate muscle pressure at this time step
        const Pmus = Pmax * Math.sin(omega * currentTime);

        // ODEs from the Python model
        // dVdt = Q
        // dPalvdt = Q * (1/C)
        // dQdt = (1/L) * (Pmus - Palv - Q * R)

        // Update values using Euler method
        V += Q * dt * 1000;
        Palv += Q * (1 / C) * dt;
        Q += (1 / L) * (Pmus - Palv - Q * R) * dt;

        // Store values
        tValues.push(currentTime);
        QValues.push(Q);
        VValues.push(V);
        PalvValues.push(Palv);
        PmusValues.push(Pmus);
      }

      // Convert to data format for recharts
      return tValues.map((time, index) => ({
        time,
        Q: QValues[index],
        V: VValues[index],
        Palv: PalvValues[index],
        Pmus: PmusValues[index],
      }));
    };

    setData(simulateRespiration(t));
  }, [time, isRunning, age, sexValue]);

  const graphs = [
    {
      title: "Flow (Q) vs Time",
      dataKey: "Q",
      yLabel: "Flow (mL/s)",
      domain: [-1, 1],
      ticks: [-1, -0.5, 0, 0.5, 1],
    },
    {
      title: "Volume (V) vs Time",
      dataKey: "V",
      yLabel: "Volume (mL)",
      domain: [-100, 500],
      ticks: [-100, 0, 100, 200, 300, 400, 500],
    },
    {
      title: "Alveolar Pressure (Palv) vs Time",
      dataKey: "Palv",
      yLabel: "Pressure (cmH₂O)",
      domain: [-0.125, 0.125],
      ticks: [-0.125, 0, 0.125],
    },
    {
      title: "Muscle Pressure (Pmus) vs Time",
      dataKey: "Pmus",
      yLabel: "Pressure (cmH₂O)",
      domain: [-25, 25],
      ticks: [-25, -15, -5, 0, 5, 15, 25],
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-8 h-full p-4">
      {graphs.map((graph, index) => (
        <div key={index} className="h-64 bg-white">
          <div
            className="text-lg font-bold mb-2"
            style={{ marginLeft: "40px" }}
          >
            {graph.title}
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 30, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                type="number"
                domain={[0, 60]}
                tickCount={11}
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: "#333" }}
                tickFormatter={(tick) => tick}
                label={{
                  value: "Time (s)",
                  position: "insideBottom",
                  offset: -10,
                  style: { textAnchor: "middle", fontSize: 12 },
                }}
              />
              <YAxis
                domain={graph.domain}
                ticks={graph.ticks}
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: "#333" }}
                label={{
                  value: graph.yLabel,
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fontSize: 12 },
                  dx: -15,
                }}
              />
              <Tooltip
                formatter={(value) => value.toFixed(3)}
                labelFormatter={(label) => `Time: ${label.toFixed(2)}s`}
              />
              <Line
                type="monotone"
                dataKey={graph.dataKey}
                stroke="#0066CC"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                name={graph.dataKey}
                // Remove the legend completely
              />
              {/* Removed the Legend component */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default SimulationGraphs;
