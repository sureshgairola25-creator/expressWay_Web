import React from "react";
import { Box } from "@mui/material";

const CarTopView = () => {
  return (
    <Box
      sx={{
        width: 160,
        height: 300,
        position: "relative",
        background: "linear-gradient(180deg, #3b3b3b 0%, #1f1f1f 100%)",
        borderRadius: "80px / 40px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.4), inset 0 0 10px rgba(255,255,255,0.1)",
        overflow: "hidden",
        border: "3px solid #555",
      }}
    >
      {/* Roof window / windshield */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "80%",
          height: "60%",
          background: "linear-gradient(180deg, #2a2a2a 0%, #0d0d0d 100%)",
          borderRadius: "20px",
          boxShadow: "inset 0 0 20px rgba(255,255,255,0.15)",
        }}
      />

      {/* Front windshield */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "10%",
          width: "80%",
          height: "15%",
          background: "linear-gradient(to bottom, #888, #333)",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          boxShadow: "inset 0 -4px 8px rgba(0,0,0,0.4)",
        }}
      />

      {/* Rear windshield */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: "10%",
          width: "80%",
          height: "15%",
          background: "linear-gradient(to top, #888, #333)",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          boxShadow: "inset 0 4px 8px rgba(0,0,0,0.4)",
        }}
      />

      {/* Side mirrors */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: -12,
          width: 16,
          height: 30,
          background: "linear-gradient(90deg, #444, #222)",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: -12,
          width: 16,
          height: 30,
          background: "linear-gradient(90deg, #222, #444)",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      />

      {/* Wheels */}
      {[{ top: "10%" }, { bottom: "10%" }].map((pos, i) => (
        <React.Fragment key={i}>
          {/* Left wheels */}
          <Box
            sx={{
              position: "absolute",
              left: -14,
              ...pos,
              width: 24,
              height: 50,
              backgroundColor: "#111",
              borderRadius: "8px",
              boxShadow: "inset 0 0 5px rgba(255,255,255,0.1)",
            }}
          />
          {/* Right wheels */}
          <Box
            sx={{
              position: "absolute",
              right: -14,
              ...pos,
              width: 24,
              height: 50,
              backgroundColor: "#111",
              borderRadius: "8px",
              boxShadow: "inset 0 0 5px rgba(255,255,255,0.1)",
            }}
          />
        </React.Fragment>
      ))}

      {/* Seats */}
      {[0, 1, 2, 3].map((seat, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: `${25 + index * 15}%`,
            left: "25%",
            width: "50%",
            height: "10%",
            background: "linear-gradient(180deg, #555 0%, #2a2a2a 100%)",
            borderRadius: "8px",
            boxShadow: "inset 0 0 6px rgba(255,255,255,0.15)",
          }}
        />
      ))}

      {/* Divider line */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "49.5%",
          width: "1%",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      />
    </Box>
  );
};

export default CarTopView;
