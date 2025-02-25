"use client"; // Required for hooks in Next.js App Router

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function GamePage() {
  const [selectedImage, setSelectedImage] = useState("/backgrounds/day-bg.jpg"); // Default background
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [health, setHealth] = useState(100); // ✅ Default full health (100%)
  const [showExplosion, setShowExplosion] = useState(false); // ✅ Track explosion visibility
  const [showHealing, setShowHealing] = useState(false); // ✅ Track healing visibility
  const [typingTimeouts, setTypingTimeouts] = useState([]); // Track timeouts
  const [currentTime, setCurrentTime] = useState(new Date()); // ✅ Track current time

  // Pokémon Sprite
  const spriteImage = "/sprites/charmander.gif";
  const explosionGif = "/sprites/explosion.gif"; // ✅ Explosion effect
  const healingGif = "/sprites/healing.webp"; // ✅ Healing effect

  // Dialog Messages (Separated by "|")
  const dialogLines = [
    "Welcome to the Pokémon world! Take care of your digital pet.",
    "Your choices will determine your pet's happiness!",
    "Let's begin the adventure!"
  ];

  // Health Bar Color Logic
  const getHealthColor = () => {
    if (health > 50) return "green"; // ✅ Healthy
    if (health > 20) return "yellow"; // ⚠️ Warning
    return "red"; // ❌ Critical
  };

  // Format date and time
  const formatDateTime = () => {
    return currentTime.toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // ✅ 24-hour format
    });
  };


  // Handle damage and explosion effect
  const handleDamage = () => {
    setShowExplosion(true); // ✅ Show explosion effect
    setHealth((prev) => Math.max(0, prev - 20)); // ✅ Reduce health

    setTimeout(() => {
      setShowExplosion(false); // ✅ Hide explosion after 1 second
    }, 1000);
  };

  // Handle healing and healing effect
  const handleHeal = () => {
    setShowHealing(true); // ✅ Show healing effect
    setHealth((prev) => Math.min(100, prev + 20)); // ✅ Increase health

    setTimeout(() => {
      setShowHealing(false); // ✅ Hide healing effect after 1 second
    }, 1000);
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // ✅ Cleanup on unmount
  }, []);

  // Typing Effect
  useEffect(() => {
    if (dialogVisible) {
      let index = 0;
      const currentText = dialogLines[currentDialogIndex] || "";
      setDialogText(""); // ✅ Reset text before typing starts
      setIsTyping(true);

      let timeouts = [];

      for (let i = 0; i < currentText.length; i++) {
        const timeout = setTimeout(() => {
          setDialogText((prev) => prev + currentText.charAt(i));
          if (i === currentText.length - 1) {
            setIsTyping(false); // ✅ Typing complete
          }
        }, 50 * i);
        timeouts.push(timeout);
      }

      setTypingTimeouts(timeouts);

      return () => {
        timeouts.forEach(clearTimeout); // ✅ Clear previous timeouts on unmount
      };
    }
  }, [dialogVisible, currentDialogIndex]);

  const handleNextDialog = () => {
    if (isTyping) {
      // ✅ If typing, instantly complete the text
      setTypingTimeouts((timeouts) => {
        timeouts.forEach(clearTimeout);
        return [];
      });
      setDialogText(dialogLines[currentDialogIndex]);
      setIsTyping(false);
      return;
    }

    if (currentDialogIndex < dialogLines.length - 1) {
      setCurrentDialogIndex((prev) => prev + 1);
      setDialogText(""); // Reset for next dialog
      setDialogVisible(true);
    } else {
      setDialogVisible(false); // Close dialog
      setCurrentDialogIndex(0);
      setDialogText("");
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100vw",
      height: "100vh",
      position: "relative"
    }}>
      {/* ✅ Date & Time Display (Top-Left Corner of Background) */}

      {/* Background Image */}
      <div style={{ position: "relative", width: "800px", height: "600px" }}>
        <div id="datetime-container">{formatDateTime()}</div>
        <Image src={selectedImage} alt="Background" layout="fill" objectFit="cover" />

        {/* Centered Pokémon Sprite */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <Image src={spriteImage} alt="Sprite" width={100} height={100} />
          
          {/* Explosion Effect (Appears When Taking Damage) */}
          {showExplosion && (
            <Image
              src={explosionGif}
              alt="Explosion Effect"
              width={100}
              height={100}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                animation: "shake 0.3s ease-in-out infinite"
              }}
            />
          )}

          {/* Healing Effect (Appears When Healing) */}
          {showHealing && (
            <Image
              src={healingGif}
              alt="Healing Effect"
              width={100}
              height={100}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                animation: "fade-in 0.5s ease-in-out"
              }}
            />
          )}
        </div>

        {/* ✅ Health Bar (Below the Sprite) */}
        <div className="health-container">
          <div className="health-bar" style={{ width: `${health}%`, backgroundColor: getHealthColor() }}></div>
        </div>

        {/* Pokémon-Style Dialog Box */}
        {dialogVisible && (
          <div id="dialogbox" onClick={handleNextDialog}>
            {dialogText}
            <div id ="arrow"></div>
          </div>
        )}
      </div>

      {/* Background Change Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setSelectedImage("/backgrounds/day-bg.jpg")} style={{ marginRight: "10px", padding: "10px 20px" }}>Day</button>
        <button onClick={() => setSelectedImage("/backgrounds/night-bg.jpg")} style={{ marginRight: "10px", padding: "10px 20px" }}>Night</button>
        <button onClick={() => setSelectedImage("/backgrounds/sunset-bg.jpg")} style={{ padding: "10px 20px" }}>Sunset</button>
      </div>

      {/* Show Dialog Button */}
      <button onClick={() => setDialogVisible(true)}
        style={{ marginTop: "20px", padding: "10px 20px", background: "blue", color: "white", borderRadius: "5px" }}>
        Show Dialog
      </button>

      {/* Damage Button (For Testing Health Reduction) */}
      <button onClick={handleDamage} 
        style={{ marginTop: "20px", padding: "10px 20px", background: "red", color: "white", borderRadius: "5px" }}>
        Take Damage (-20)
      </button>

      {/* Heal Button (For Testing Health Increase) */}
      <button onClick={handleHeal} 
        style={{ marginTop: "20px", padding: "10px 20px", background: "green", color: "white", borderRadius: "5px" }}>
        Heal (+20)
      </button>
    </div>
  );
}