import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

// --- Framer Motion Animation Definitions ---

// Animation for the pulsing dots at the bottom (unchanged)
const dotContainerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.2, // Time gap between each dot's animation start
    },
  },
};

const dotChildVariants = {
  animate: {
    y: [0, -10, 0], // The vertical hop animation
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Animation for the central cab icon (simplified rotation for a cab)
const cabVariants = {
  animate: {
    // Simple side-to-side rotation to indicate driving/searching
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// --- Main Component ---

const CabLoader = ({
  title = "Please Wait...",
  subtitle = "We are finding the fastest available ride for you", // Updated text
}) => {
  return (
    // Fixed overlay with backdrop blur
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(240, 242, 245, 0.8)", 
        zIndex: 1300,
      }}
    >
      {/* The White Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          width: "300px",
          textAlign: "center",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* --- 1. Cab Animation Container --- */}
        <Box
          sx={{
            position: "relative",
            width: "80px",
            height: "80px",
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Circular Dotted Path (Simulated - now representing the search radius) */}
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              // Changing the dotted color to a brighter yellow/orange to match cab theme
              border: "3px dotted #FFB300", 
              opacity: 0.7,
            }}
          />

          {/* Animated Cab Icon */}
          <motion.div
            variants={cabVariants}
            animate="animate"
            style={{ position: 'absolute' }}
          >
            <Box
                component="span"
                sx={{
                    display: 'block',
                    fontSize: '40px', 
                    // Use cab emoji
                }}
            >
                <span role="img" aria-label="taxi cab">🚕</span>
            </Box>
          </motion.div>
        </Box>

        {/* --- 2. Text Content --- */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#333",
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#666",
            mb: 3,
          }}
        >
          {subtitle}
        </Typography>

        {/* --- 3. Animated Pulsing Dots --- */}
        <motion.div
          variants={dotContainerVariants}
          animate="animate"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Dot array with colors matching the PNG's theme */}
          {["#64B5F6", "#BDBDBD", "#EF9A9A", "#BDBDBD"].map((color, i) => (
            <motion.span
              key={i}
              variants={dotChildVariants}
              transition={{ delay: i * 0.15 }}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: color,
                display: "inline-block",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default CabLoader;