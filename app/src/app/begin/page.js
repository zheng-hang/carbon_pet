"use client"; // Required for hooks in App Router

import React from "react";
import { useRouter } from "next/navigation"; // ✅ FIXED: Use next/navigation

export default function BeginPage() {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <iframe
        src="https://mycarbonfootprint.spgroup.com.sg/"
        style={{ width: "50%", height: "50%", border: "none" }}
        title="Carbon Footprint"
      />
      <div style={{ marginTop: "20px" }}>
        <button style={{ marginRight: "10px", padding: "10px 20px" }}>
          Button 1
        </button>
        <button
          onClick={() => router.push("/home")} // ✅ FIXED: Router works now
          className="bg-blue-500 text-white p-2"
          style={{ padding: "10px 20px", marginRight: "10px" }}
        >
          Testing
        </button>
        <button style={{ padding: "10px 20px" }}>Button 2</button>
      </div>
    </div>
  );
}