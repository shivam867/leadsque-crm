// components/DesktopOnly.jsx
"use client";

import { useEffect, useState } from "react";

export default function DesktopOnly({ children, minWidth = 1024 }) {
  const [isLarge, setIsLarge] = useState(false);

  useEffect(() => {
    const check = () => setIsLarge(window.innerWidth >= minWidth);

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, [minWidth]);

  if (!isLarge) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8FAFC",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 420,
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 20,
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div style={{ fontSize: 52, marginBottom: 16 }}>💻</div>

          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#0F172A",
              marginBottom: 12,
            }}
          >
            Desktop Access Required
          </h1>

          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "#475569",
              margin: 0,
            }}
          >
            This module is optimized for larger screens and is currently not
            available on mobile or tablet devices.
            <br />
            <br />
            Please open the application on a desktop or laptop for the best
            experience.
          </p>
        </div>
      </div>
    );
  }

  return children;
}