"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { La_Belle_Aurore } from "next/font/google";

export default function GamePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const starter = searchParams.get("starter") || "charmander";
  const [selectedImage, setSelectedImage] = useState("/backgrounds/day-bg.jpg");
  const [surveyData, setSurveyData] = useState(null);
  const [currentAction, setCurrentAction] = useState(null); // ✅ Track current action (user input)
  const [userValue, setUserValue] = useState(""); // ✅ User's input value
  const [progress, setProgress] = useState(0); // ✅ Progress starts at 0%
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [health, setHealth] = useState(100);
  const [showExplosion, setShowExplosion] = useState(false);
  const [showHealing, setShowHealing] = useState(false);
  const [typingTimeouts, setTypingTimeouts] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPanel, setShowPanel] = useState(false); // ✅ Track secret panel visibility
  const [clickCount, setClickCount] = useState(0); // ✅ Track clicks for secret button
  const [evolutionStage, setEvolutionStage] = useState(0); // ✅ Track evolution stage

  const spriteImage = `/sprites/${starter}.gif`;
  const explosionGif = "/sprites/explosion.gif";
  const healingGif = "/sprites/healing.webp";

  const dialogLines = [
    `Welcome ${surveyData?.name || "Trainer"}! Take good care of your ${starter}.`,
    "Your choices will affect your pet's happiness and health!",
    "Let's begin the adventure!"
  ];

  // ✅ Calculate XP and check evolution
  const handleSubmit = () => {
    const baseline = getBaselineValue(currentAction);
    const userInput = parseFloat(userValue);

    if (isNaN(userInput)) return;

    let gainedXP = 0;
    const temp = parseFloat(getBaselineValue(currentAction).toString().replace(/[^\d.]/g, "")) || 0;
    if (currentAction === "spending") {
      const savings = Math.max(0, temp - userInput);
      gainedXP = Math.floor(savings / 5); // $5 saved = 1 XP
    } else if (currentAction === "rides") {
      const ridesSaved = Math.max(0, temp - userInput);
      gainedXP = ridesSaved * 5; // 1 ride saved = 5 XP
    } else if (currentAction === "energy") {
      const energySaved = Math.max(0, temp - userInput);
      gainedXP = Math.floor(energySaved / 10); // 10 kWh saved = 1 XP
    }

    let newXP = progress + gainedXP;
    // console.log(gainedXP, newXP, baseline, userInput);
    // ✅ Check for evolution
    if (newXP >= 100) {
      newXP = 0; // Reset XP
      setEvolutionStage((prevStage) => Math.min(prevStage + 1, 2)); // Evolve but cap at stage 2
    }

    setProgress(newXP);
    setUserValue("");
    setCurrentAction(null);
  };



  const getHealthColor = () => (health > 50 ? "green" : health > 20 ? "yellow" : "red");

  const formatDateTime = () => currentTime.toLocaleString("en-US", {
    weekday: "long", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false
  });


  // ✅ Function to determine background based on time
  const updateBackgroundBasedOnTime = () => {
    const hour = new Date().getHours();

    if (hour >= 8 && hour < 18) {
      setSelectedImage("/backgrounds/day-bg.jpg"); // Daytime
    } else if ((hour >= 6 && hour < 8) || (hour >= 18 && hour < 19)) {
      setSelectedImage("/backgrounds/sunset-bg.jpg"); // Sunset
    } else {
      setSelectedImage("/backgrounds/night-bg.jpg"); // Night
    }
  };

  // ✅ Auto-update background every minute based on time
  useEffect(() => {
    updateBackgroundBasedOnTime(); // Set on load
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateBackgroundBasedOnTime();
    }, 60000); // Update every 60 seconds

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);
  
  const handleDamage = () => {
    setShowExplosion(true);
    setHealth(prev => Math.max(0, prev - 20));
    setTimeout(() => setShowExplosion(false), 1000);
  };

  const handleHeal = () => {
    setShowHealing(true);
    setHealth(prev => Math.min(100, prev + 20));
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
      router.push("/begin");
    }
  }, [router]);

  // ✅ Get baseline values from survey results
  const getBaselineValue = (category) => {
    if (!surveyData) return "N/A";
    switch (category) {
      case "spending":
        return `$${parseInt(surveyData.monthlySpending) || 0}`;
      case "rides":
        return `${parseInt(surveyData.rideHailingUsage) || 0} rides/week`;
      case "energy":
        return `${parseInt(surveyData.energyConsumption) || 0} kWh`;
      default:
        return "N/A";
    }
  };

  useEffect(() => {
    if (dialogVisible && surveyData) {
      const currentText = dialogLines[currentDialogIndex]
        .replace("{name}", surveyData.name || "Trainer")
        .replace("{starter}", starter.toUpperCase());

      setDialogText(""); 
      setIsTyping(true);

      let typedText = "";
      let timeouts = [];

      for (let i = 0; i < currentText.length; i++) {
        const timeout = setTimeout(() => {
          typedText += currentText.charAt(i);
          setDialogText(typedText);
          if (i === currentText.length - 1) setIsTyping(false);
        }, 50 * i);
        timeouts.push(timeout);
      }

      setTypingTimeouts(timeouts);
      return () => timeouts.forEach(clearTimeout);
    }
  }, [dialogVisible, currentDialogIndex, surveyData]);

  const handleNextDialog = () => {
    if (isTyping) {
      typingTimeouts.forEach(clearTimeout);
      setDialogText(dialogLines[currentDialogIndex]
        .replace("{name}", surveyData?.name || "Trainer")
        .replace("{starter}", starter.toUpperCase()));
      setIsTyping(false);
      return;
    }

    if (currentDialogIndex < dialogLines.length - 1) {
      setCurrentDialogIndex(prev => prev + 1);
      setDialogText("");
      setDialogVisible(true);
    } else {
      setDialogVisible(false);
      setCurrentDialogIndex(0);
      setDialogText("");
    }
  };

  // ✅ Secret Button Click Logic
  const handleSecretClick = () => {
    setClickCount(prev => prev + 1);

    if (clickCount === 0) {
      setTimeout(() => setClickCount(0), 2000); // Reset count after 2 seconds
    }

    if (clickCount + 1 >= 5) {
      setShowPanel(true);
      setClickCount(0);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100vw", height: "100vh", position: "relative" }}>
      <div style={{ position: "relative", width: "800px", height: "600px" }}>
        <div id="datetime-container">{formatDateTime()}</div>

        {/* ✅ Background Image */}
        <Image src={selectedImage} alt="Background" layout="fill" objectFit="cover" />

        {/* ✅ Pokémon Evolution (Image Changes) */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <Image
          src={`/sprites/${starter}${evolutionStage > 0 ? `_${evolutionStage}` : ""}.gif`}
          alt={starter}
          width={100 * Math.pow(1.5, evolutionStage)} // ✅ Scale up by 30% per evolution
          height={100 * Math.pow(1.5, evolutionStage)} // ✅ Maintain proportional size
        />
        </div>

        {/* ✅ Styled Progress Bar (Top-Right Corner) */}
        <div 
          className="progress-bar-container"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "180px",
            height: "25px",
            background: "#333",
            border: "2px solid black",
            borderRadius: "5px",
            padding: "5px",
            display: "flex",
            alignItems: "center"
          }}
        >
          <span style={{ fontSize: "12px", color: "white", marginRight: "8px" }}>XP:</span>
          <div 
            className="progress-bar"
            style={{
              width: "100%",
              height: "10px",
              backgroundColor: "#ddd",
              borderRadius: "3px",
              overflow: "hidden"
            }}
          >
            <div 
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "green",
                transition: "width 0.5s ease-in-out"
              }}
            ></div>
          </div>
        </div>


               {/* ✅ Main Menu */}
               {currentAction === null ? (
          <div style={{
            position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)",
            width: "85%", height: "180px", background: "#eee", border: "3px solid black", borderRadius: "8px",
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", padding: "5px",
            alignItems: "center"
          }}>
            <div style={{ color: "black", fontSize: "18px", fontWeight: "bold", textAlign: "center", gridColumn: "span 2", marginBottom: "5px" }}>
              What will {surveyData?.name || "Trainer"} do?
            </div>
            <button onClick={() => setCurrentAction("spending")} style={{ width: "100%", background: "salmon", color: "black", fontWeight: "bold", fontSize: "16px", border: "3px solid black", borderRadius: "8px", padding: "12px" }}>Record Spending</button>
            <button onClick={() => setCurrentAction("rides")} style={{ width: "100%", background: "#ffcc5c", color: "black", fontWeight: "bold", fontSize: "16px", border: "3px solid black", borderRadius: "8px", padding: "12px" }}>Record Rides</button>
            <button onClick={() => setCurrentAction("energy")} style={{ width: "100%", background: "#77dd77", color: "black", fontWeight: "bold", fontSize: "16px", border: "3px solid black", borderRadius: "8px", padding: "12px" }}>Record Energy</button>

            {/* ✅ UPDATED: Redirect to /resources */}
            <button onClick={() => router.push("/resources")} style={{ width: "100%", background: "#5c85ff", color: "black", fontWeight: "bold", fontSize: "16px", border: "3px solid black", borderRadius: "8px", padding: "12px" }}>
              Resources
            </button>
          </div>
        ) : (
          /* ✅ User Input Screen */
          <div style={{
            position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)",
            width: "85%", height: "160px", background: "#eee", border: "3px solid black", borderRadius: "8px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "15px"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px", color: "black" }}>
              {currentAction === "spending" ? "Enter Monthly Spending ($)" :
              currentAction === "rides" ? "Enter Ride-Hailing Trips per Week" :
              "Enter Energy Usage (kWh)"}
            </h3>
            {/* ✅ Display Baseline Value from Survey */}
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "gray", marginBottom: "5px" }}>
              Baseline: {getBaselineValue(currentAction)}
            </div>
            <input type="number" placeholder="Enter value here" value={userValue} onChange={(e) => setUserValue(e.target.value)} style={{ color: "black", padding: "5px", border: "3px solid black", borderRadius: "8px", width: "85%", textAlign: "center", fontSize: "16px" }} />
            <button onClick={handleSubmit} style={{ marginTop: "10px", padding: "8px 15px", background: "#ff6961", color: "white", fontWeight: "bold", border: "3px solid black", borderRadius: "8px" }}>
              Confirm
            </button>
          </div>
        )}



          {/* ✅ Hidden Click Button (Now Positioned at Bottom Left of the Background Image) */}
          <button 
            onClick={handleSecretClick} 
            style={{
            position: "absolute",
            bottom: "10px", // ✅ Adjusted to be inside the background image
            left: "10px",   // ✅ Aligned to the left of the background
            width: "30px",
            height: "30px",
            background: "transparent",
            border: "none",
            cursor: "pointer"
            }}
        ></button>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          {showExplosion && (
            <Image src={explosionGif} alt="Explosion Effect" width={100} height={100} style={{ position: "absolute", top: 0, left: 0, animation: "shake 0.3s ease-in-out infinite" }} />
          )}

          {showHealing && (
            <Image src={healingGif} alt="Healing Effect" width={100} height={100} style={{ position: "absolute", top: 0, left: 0, animation: "fade-in 0.5s ease-in-out" }} />
          )}
        </div>

        {/* <div className="health-container">
          <div className="health-bar" style={{ width: `${health}%`, backgroundColor: getHealthColor() }}></div>
        </div> */}

        {dialogVisible && (
          <div id="dialogbox" onClick={handleNextDialog}>
            {dialogText}
            {!isTyping && <div id="arrow"></div>}
          </div>
        )}
      </div>


      {/* ✅ Secret Panel (Appears After 5 Clicks) */}
      {showPanel && (
        <div className="control-panel" style={{ marginTop: "20px", background: "#333", padding: "10px", borderRadius: "8px" }}>

          {/* ✅ Close Button */}
          <button 
          onClick={() => setShowPanel(false)} 
          style={{ 
              padding: "5px 10px", 
              background: "grey", 
              color: "white", 
              borderRadius: "5px",
              display: "block",
              marginBottom: "10px"
          }}
          >
          Close Panel
          </button>
          <button onClick={() => setSelectedImage("/backgrounds/day-bg.jpg")} style={{ marginRight: "10px", padding: "10px 20px" }}>Day</button>
          <button onClick={() => setSelectedImage("/backgrounds/night-bg.jpg")} style={{ marginRight: "10px", padding: "10px 20px" }}>Night</button>
          <button onClick={() => setSelectedImage("/backgrounds/sunset-bg.jpg")} style={{ padding: "10px 20px" }}>Sunset</button>

          <button onClick={() => setDialogVisible(true)} style={{ marginTop: "10px", padding: "10px 20px", background: "blue", color: "white", borderRadius: "5px" }}>
            Show Dialog
          </button>

          <button onClick={handleDamage} style={{ marginTop: "10px", padding: "10px 20px", background: "red", color: "white", borderRadius: "5px" }}>
            Take Damage (-20)
          </button>

          <button onClick={handleHeal} style={{ marginTop: "10px", padding: "10px 20px", background: "green", color: "white", borderRadius: "5px" }}>
            Heal (+20)
          </button>


    {/* ✅ XP Controls */}
    <button 
      onClick={() => setProgress(prev => Math.max(0, prev - 10))} 
      style={{ marginTop: "10px", padding: "10px 20px", background: "red", color: "white", borderRadius: "5px" }}
    >
      Decrease XP (-10%)
    </button>

    <button 
      onClick={() => setProgress(prev => Math.min(100, prev + 10))} 
      style={{ marginTop: "10px", padding: "10px 20px", background: "green", color: "white", borderRadius: "5px" }}
    >
      Increase XP (+10%)
    </button>

    {/* ✅ NEW BUTTON: Add XP (+100) */}
    <button 
      onClick={() => setProgress(prev => Math.min(1000, prev + 100))} // ✅ Max limit at 1000
      style={{ marginTop: "10px", padding: "10px 20px", background: "blue", color: "white", borderRadius: "5px" }}
    >
      Add XP (+100)
    </button>
          
        </div>
      )}
    </div>
  );
}