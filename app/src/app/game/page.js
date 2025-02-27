"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

export default function GamePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const starter = searchParams.get("starter") || "charmander"; // default fallback
  const [surveyData, setSurveyData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("/backgrounds/day-bg.jpg");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [health, setHealth] = useState(100);
  const [showExplosion, setShowExplosion] = useState(false);
  const [showHealing, setShowHealing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [typingTimeouts, setTypingTimeouts] = useState([]);

  const spriteImage = `/sprites/${starter}.gif`;
  const explosionGif = "/sprites/explosion.gif";
  const healingGif = "/sprites/healing.webp";

  const dialogLines = [
    `Welcome ${surveyData?.name || "Trainer"}! Take good care of your ${starter}.`,
    "Your real-world choices influence your pet's health!",
    "Let's begin your personalized adventure!"
  ];

  const getHealthColor = () => {
    if (health > 50) return "green";
    if (health > 20) return "yellow";
    return "red";
  };

  const formatDateTime = () => currentTime.toLocaleString("en-US", {
    weekday: "long", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });

  const handleDamage = () => {
    setShowExplosion(true);
    setHealth((prev) => Math.max(0, prev - 20));
    setTimeout(() => setShowExplosion(false), 1000);
  };

  const handleHeal = () => {
    setShowHealing(true);
    setHealth((prev) => Math.min(100, prev + 20));
    setTimeout(() => setShowHealing(false), 1000);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("gameSurveyData");
    if (data) {
      setSurveyData(JSON.parse(data));
    } else {
      router.push("/begin"); // redirect if no survey data
    }
  }, [router]);

  useEffect(() => {
    if (dialogVisible && surveyData) {
      const currentText = dialogLines[currentDialogIndex]
        .replace("{name}", surveyData.name || "Trainer") // ✅ Insert survey name
        .replace("{starter}", starter.toUpperCase()); // ✅ Insert starter Pokémon name
  
      setDialogText(""); // ✅ Reset text before typing starts
      setIsTyping(true);
  
      let typedText = ""; // ✅ Store text progressively
      let timeouts = []; // ✅ Store timeouts properly
  
      for (let i = 0; i < currentText.length; i++) {
        const timeout = setTimeout(() => {
          typedText += currentText.charAt(i);
          setDialogText(typedText); // ✅ Updates only with correct text
          if (i === currentText.length - 1) setIsTyping(false);
        }, 50 * i);
        timeouts.push(timeout);
      }
  
      setTypingTimeouts(timeouts); // ✅ Now it is defined
  
      return () => timeouts.forEach(clearTimeout);
    }
  }, [dialogVisible, currentDialogIndex, surveyData]);

  const handleNextDialog = () => {
    if (isTyping) {
      // ✅ Instantly complete the text if it's still typing
      typingTimeouts.forEach(clearTimeout);
      setDialogText(dialogLines[currentDialogIndex] // ✅ Show full text immediately
        .replace("{name}", surveyData?.name || "Trainer")
        .replace("{starter}", starter.toUpperCase()));
      setIsTyping(false);
      return; // ✅ Stop here, don't reset animation
    }
  
    // ✅ Move to next dialog message or close the box
    if (currentDialogIndex < dialogLines.length - 1) {
      setCurrentDialogIndex(prev => prev + 1);
      setDialogText(""); // Reset for next dialog
      setDialogVisible(true);
    } else {
      setDialogVisible(false); // Close dialog
      setCurrentDialogIndex(0);
      setDialogText("");
    }
  };

  if (!surveyData) {
    return <p className="text-white text-center">Loading your game...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white relative">
      <div style={{ position: "relative", width: "800px", height: "600px" }}>
        <div id="datetime-container">{formatDateTime()}</div>
        <Image src={selectedImage} alt="Background" layout="fill" objectFit="cover" />

        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Image src={spriteImage} alt={starter} width={100} height={100} />
          {showExplosion && (
            <Image src={explosionGif} alt="Explosion" width={100} height={100} style={{ position: "absolute", top: 0, left: 0 }} />
          )}
          {showHealing && (
            <Image src={healingGif} alt="Healing" width={100} height={100} style={{ position: "absolute", top: 0, left: 0 }} />
          )}
        </div>

        <div className="health-container">
          <div className="health-bar" style={{ width: `${health}%`, backgroundColor: getHealthColor() }}></div>
        </div>

        {dialogVisible && (
          <div id="dialogbox" onClick={handleNextDialog}>
            {dialogText}
            {!isTyping && <div id="arrow"></div>}
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        <button onClick={() => setSelectedImage("/backgrounds/day-bg.jpg")} className="px-4 py-2 bg-gray-700 rounded">Day</button>
        <button onClick={() => setSelectedImage("/backgrounds/night-bg.jpg")} className="px-4 py-2 bg-gray-700 rounded">Night</button>
        <button onClick={() => setSelectedImage("/backgrounds/sunset-bg.jpg")} className="px-4 py-2 bg-gray-700 rounded">Sunset</button>
      </div>

      <button onClick={() => setDialogVisible(true)} className="mt-3 px-4 py-2 bg-blue-600 rounded">Show Dialog</button>
      <button onClick={handleDamage} className="mt-3 px-4 py-2 bg-red-600 rounded">Take Damage (-20)</button>
      <button onClick={handleHeal} className="mt-3 px-4 py-2 bg-green-600 rounded">Heal (+20)</button>

      {/* Survey Data Display */}
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 p-3 rounded text-sm">
        <h3 className="font-bold">Your Baseline:</h3>
        <p>Name: {surveyData.name}</p>
        <p>Monthly Spend: ${surveyData.monthlySpending}</p>
        <p>Ride-Hailing: {surveyData.rideHailingUsage}/week</p>
        <p>Energy Usage: {surveyData.energyConsumption} kWh</p>
        {surveyData.houseType && <p>House Type: {surveyData.houseType}</p>}
      </div>
    </div>
  );
}