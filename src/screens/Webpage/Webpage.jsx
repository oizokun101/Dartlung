import React, { useState, useEffect } from "react";
import { AgeStepper } from "../../components/AgeStepper";
import { PausePlay } from "../../components/PausePlay";
import { MaleFemale } from "../../components/MaleFemale";
import { SimulationGraphs } from "../../components/SimulationGraphs";
import "./style.css";

export const Webpage = () => {
  const [time, setTime] = useState(0);
  const [age, setAge] = useState(1);
  const [isRunning, setIsRunning] = useState(true);
  const [sex, setSex] = useState("Male");
  const [stateVariables, setStateVariables] = useState({
    C: 0,
    Raw: 0,
    Pmax: 0,
    B: 0,
  });

  const calculateMeasurements = (age, sex) => {
    const weight = sex === "Male" ? 0.2325 * age + 3.5 : 0.2 * age + 3.34;
    const height = sex === "Male" ? 0.8 * age + 50 : 0.8625 * age + 50.9;
    return {
      weight: weight.toFixed(1),
      height: height.toFixed(1),
    };
  };

  // Calculate state variables based on age and sex
  useEffect(() => {
    // Convert sex string to numerical value for calculations
    const sexValue = sex === "Male" ? 0 : 1;

    // Calculate length, weight, and derived variables
    let weight, length, C, airwayRadius, R, RR;

    if (sexValue === 0) {
      // Male
      weight = 3.34 + 0.2 * age;
      length = (50 + 0.8 * age) * 0.01; // cm to m
      C = 0.88 * Math.pow(weight, 1.09);
      airwayRadius = (0.2 * weight + 4.5) / 1000; // m
      R =
        ((8 * 0.05 * 1.8e-5) / (Math.PI * Math.pow(airwayRadius, 4))) * 0.0102; // cmH2O
      RR = -1.71 * weight + 40.57; // breaths/min
    } else {
      // Female
      weight = 3.5 + 0.2325 * age;
      length = (50.9 + 0.8625 * age) * 0.01; // cm to m
      C = 0.88 * Math.pow(weight, 1.09);
      airwayRadius = (0.2 * weight + 4.5) / 1000; // m
      R =
        ((8 * 0.05 * 1.8e-5) / (Math.PI * Math.pow(airwayRadius, 4))) * 0.0102; // cmH2O
      RR = -1.71 * weight + 40.57; // breaths/min
    }

    // Convert to appropriate units for display
    const complianceInMlPerCmH2O = C;
    const resistanceInCmH2OPerLPerSec = R; // Already in cmH2O/L/sec
    const Pmax = 20; // Maximum pressure in cmH2O

    setStateVariables({
      C: complianceInMlPerCmH2O.toFixed(2),
      Raw: resistanceInCmH2OPerLPerSec.toFixed(2),
      Pmax: Pmax.toFixed(0),
      B: RR.toFixed(1),
    });
  }, [age, sex]);

  const measurements = calculateMeasurements(age, sex);

  // Timer effect with 10ms interval for smoother milliseconds
  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 10); // Increment by 10ms
      }, 10);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  // Handle pause/play button click
  const handlePausePlayClick = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="webpage">
      <div className="div-2">
        <header className="header">
          <div className="text-wrapper-8">DartLung</div>
          <div className="header-controls">
            <PausePlay
              className="pause-play-instance"
              property1={isRunning ? "pause-button" : "play-button"}
              onClick={handlePausePlayClick}
            />
          </div>
        </header>
        <div className="main-content">
          <div className="top-row">
            {/* Lung Model Box */}
            <div className="box lung-model">
              <img className="lungs-image" alt="Lungs" src="/img/lungss.png" />
            </div>

            {/* Infant Data Box */}
            <div className="box infant-data">
              <div className="box-header">
                <div className="text-wrapper-10">Infant Data</div>
              </div>
              <div className="box-content">
                <div className="data-grid">
                  <div className="data-row">
                    <div className="data-col">
                      <div className="text-wrapper-12">Age (Weeks)</div>
                      <AgeStepper
                        className="age-stepper-instance"
                        onChange={setAge}
                        min={1}
                        max={12}
                        value={age}
                      />
                    </div>

                    <div className="data-col">
                      <div className="text-wrapper-15">Sex</div>
                      <MaleFemale
                        className="male-female-selector"
                        onChange={setSex}
                      />
                    </div>
                  </div>
                  <div className="data-row">
                    <div className="data-col">
                      <div className="text-wrapper-14">Height (Cm)</div>
                      <div className="measurement-display">
                        {measurements.height}
                      </div>
                    </div>

                    <div className="data-col">
                      <div className="text-wrapper-13">Weight (Kg)</div>
                      <div className="measurement-display">
                        {measurements.weight}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* State Variables Box */}
            <div className="box state-variables">
              <div className="box-header">
                <div className="text-wrapper-10">State Variables</div>
              </div>
              <div className="box-content">
                <div className="bottom-section">
                  {/* C and Raw Row */}
                  <div className="first-row">
                    <div className="variable-group">
                      <span className="variable-label">
                        C (ml/cmH<span className="sub">2</span>O)
                      </span>
                      <div className="variable-value">{stateVariables.C}</div>
                    </div>
                    <div className="variable-group">
                      <span className="variable-label">
                        Raw (cmH<span className="sub">2</span>O/L/sec)
                      </span>
                      <div className="variable-value">{stateVariables.Raw}</div>
                    </div>
                  </div>

                  {/* Pmax and B Row */}
                  <div className="first-row">
                    <div className="variable-group">
                      <span className="variable-label">
                        Pmax (cmH<span className="sub">2</span>O)
                      </span>
                      <div className="variable-value">
                        {stateVariables.Pmax}
                      </div>
                    </div>
                    <div className="variable-group">
                      <span className="variable-label">B (breaths/min)</span>
                      <div className="variable-value">{stateVariables.B}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom-row">
            {/* Graphics Box */}
            <div className="box graphics">
              <div className="box-header">
                <div className="text-wrapper-10">Graphics</div>
              </div>
              <div className="box-content" style={{ height: "600px" }}>
                <SimulationGraphs
                  age={age}
                  time={time}
                  isRunning={isRunning}
                  sex={sex}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
