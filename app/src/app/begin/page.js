"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function BeginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const starter = searchParams.get("starter");
  const [loading, setLoading] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  // Survey State
  const [survey, setSurvey] = useState({
    name: "",
    monthlySpending: "",
    rideHailingUsage: "",
    energyConsumption: "",
    houseType: "",
  });

  // House type energy consumption estimates
  const houseTypeEnergyMap = {
    "1-room": 150,
    "2-room": 250,
    "3-room": 350,
    "4-room": 450,
    "5-room": 550,
  };

  useEffect(() => {
    if (!starter) {
      router.push("/");
    }
  }, [starter, router]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurvey((prev) => ({ ...prev, [name]: value }));
  };

  // Handle house type selection (auto-fill energy consumption)
  const handleHouseTypeChange = (e) => {
    const houseType = e.target.value;
    setSurvey((prev) => ({
      ...prev,
      houseType,
      energyConsumption: houseTypeEnergyMap[houseType] || "",
    }));
  };

  // Ensure all fields are filled before submission
  const isFormComplete = () => {
    return (
      survey.name.trim() &&
      survey.monthlySpending.trim() &&
      survey.rideHailingUsage.trim() &&
      (survey.energyConsumption.toString().trim() || survey.houseType.trim())
    );
  };

  // Submit survey and store data
  const handleSubmitSurvey = (e) => {
    e.preventDefault();

    if (!isFormComplete()) {
      alert("Please fill in all the required fields before proceeding!");
      return;
    }

    localStorage.setItem("gameSurveyData", JSON.stringify(survey)); // ✅ Save data
    setSurveyCompleted(true);
  };

  const startGame = () => {
    setLoading(true);
    setTimeout(() => {
      router.push(`/game?starter=${starter}`);
    }, 500);
  };

  if (!starter) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Your Starter Pokémon</h1>

      <Image src={`/sprites/${starter}.gif`} alt={starter} width={150} height={150} />
      <p className="mt-4 text-lg">You chose <strong>{starter.toUpperCase()}</strong>!</p>

      {!surveyCompleted ? (
        <form onSubmit={handleSubmitSurvey} className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Before we start, tell us a bit about yourself!</h2>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">1. What's your name?</label>
            <input
              type="text"
              name="name"
              value={survey.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none"
            />
          </div>

          {/* Monthly Spending */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              2. On average, how much do you spend on non-essential goods & services every month?
            </label>
            <input
              type="number"
              name="monthlySpending"
              value={survey.monthlySpending}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none"
            />
          </div>

          {/* Ride-Hailing Usage */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              3. How often do you take ride-hailing services per week?
            </label>
            <input
              type="number"
              name="rideHailingUsage"
              value={survey.rideHailingUsage}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none"
            />
          </div>

          {/* Energy Consumption */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">4. How much energy do you consume per month?</label>
            <label className="block text-sm font-medium mb-1">(Put 0 if unsure)</label>
            <input
              type="number"
              name="energyConsumption"
              value={survey.energyConsumption}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none"
            />
          </div>

          {/* House Type Dropdown (Only shows if energy is 0 or empty) */}
          {survey.energyConsumption === "0" || survey.energyConsumption.toString().trim() === "" ? (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                4a. If you don’t know, select your house type:
              </label>
              <select
                name="houseType"
                value={survey.houseType}
                onChange={handleHouseTypeChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none"
              >
                <option value="">Select house type</option>
                <option value="1-room">1 Room (Est. 150 kWh)</option>
                <option value="2-room">2 Room (Est. 250 kWh)</option>
                <option value="3-room">3 Room (Est. 350 kWh)</option>
                <option value="4-room">4 Room (Est. 450 kWh)</option>
                <option value="5-room">5 Room (Est. 550 kWh)</option>
              </select>
            </div>
          ) : null}

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md">
            Submit Survey
          </button>
        </form>
      ) : (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold">Survey Completed! 🎉</h2>
          <p className="mt-2">Trainer Name: <strong>{survey.name}</strong></p>
          <p>Spending per month: <strong>${survey.monthlySpending}</strong></p>
          <p>Ride-Hailing per week: <strong>{survey.rideHailingUsage} times</strong></p>
          <p>Energy Consumption: <strong>{survey.energyConsumption} kWh</strong></p>
          {survey.houseType && <p>House Type: <strong>{survey.houseType}</strong></p>}

          <button onClick={startGame} className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 rounded">
            {loading ? "Loading..." : "Start Game"}
          </button>
        </div>
      )}
    </div>
  );
}