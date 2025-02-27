"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ResourcesPage() {
  const router = useRouter();

  const resources = [
    {
      title: "🌱 How-To Guide: Individual Climate Action",
      url: "https://ipur.nus.edu.sg/wp-content/uploads/2024/05/How-To-Guide_Individual-Action-1.pdf",
      description: "A practical guide on how individuals can reduce their carbon footprint and live sustainably."
    },
    {
      title: "📊 SP Digital: Carbon Footprint Tracker",
      url: "https://www.spdigital.sg/spapp/carbon-footprint",
      description: "Track and monitor your carbon footprint with SP Digital's carbon footprint tracking tool."
    },
    {
      title: "🌍 My Carbon Footprint Calculator",
      url: "https://mycarbonfootprint.spgroup.com.sg/",
      description: "Calculate your personal carbon footprint and get insights on how to reduce it."
    },
    {
      title: "♻️ Where to Recycle E-Waste",
      url: "https://www.nea.gov.sg/our-services/waste-management/3r-programmes-and-resources/e-waste-management/where-to-recycle-e-waste",
      description: "Find the nearest e-waste recycling points in Singapore and contribute to a greener planet."
    },
    {
      title: "🌏 Singapore Green Plan: What You Can Do",
      url: "https://www.greenplan.gov.sg/take-action/what-you-can-do/",
      description: "Learn about actionable steps you can take to contribute to Singapore’s Green Plan 2030."
    }
  ];

  return (
    <div style={{
      maxWidth: "800px",
      margin: "auto",
      padding: "20px",
      textAlign: "center",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* ✅ Back Button */}
      <button 
        onClick={() => router.push("/game")}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          background: "#3498db",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          border: "2px solid #2980b9",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background 0.3s ease-in-out"
        }}
        onMouseOver={(e) => e.currentTarget.style.background = "#2980b9"}
        onMouseOut={(e) => e.currentTarget.style.background = "#3498db"}
      >
        ⬅ Back to Game
      </button>

      <h1 style={{ fontSize: "28px", marginBottom: "20px", color: "#2C3E50" }}>🌍 Sustainability & Resource Hub</h1>
      <p style={{ fontSize: "16px", color: "#555" }}>
        Here are some valuable resources to help you live a more sustainable and eco-friendly life.
      </p>

      <div style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
      }}>
        {resources.map((resource, index) => (
          <a 
            key={index} 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: "12px",
              borderRadius: "8px",
              textDecoration: "none",
              background: "#27ae60",
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
              border: "2px solid #1e8449",
              transition: "background 0.3s ease-in-out"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#1e8449"}
            onMouseOut={(e) => e.currentTarget.style.background = "#27ae60"}
          >
            {resource.title}
          </a>
        ))}
      </div>
    </div>
  );
}