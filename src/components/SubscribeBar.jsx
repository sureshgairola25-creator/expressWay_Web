import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Divider,
} from "@mui/material";
import { Person, Email } from "@mui/icons-material";

const SubscribeBar = () => {
  return (
    <Box>
      <Divider sx={{ bgcolor: "#e0e0e0", mb: 0 }} />
      <Box
        sx={{
          backgroundColor: "#f8fbff",
          p: { xs: 3, md: 4 },
          px: { xs: 3, md: 30 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Left Side - Text Section */}
        <Box sx={{ flex: "1 1 250px", minWidth: 220 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#000",
              mb: 0.5,
            }}
          >
            Stay{" "}
            <Box component="span" sx={{ fontWeight: 800 }}>
              Up to Date
            </Box>
          </Typography>
          <Typography variant="body2" sx={{ color: "#555" }}>
            Subscribe now and receive the latest travel news.
          </Typography>
        </Box>

        {/* Right Side - Input Section */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            alignItems: "center",
            flex: "1 1 600px",
            justifyContent: "flex-end",
          }}
        >
          <TextField
            placeholder="Your Name"
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: "#fff",
              minWidth: { xs: "100%", sm: 180 },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Person sx={{ color: "#000" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            placeholder="Enter Your Email"
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: "#fff",
              minWidth: { xs: "100%", sm: 250 },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Email sx={{ color: "#000" }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#662D91",
              color: "#fff",
              textTransform: "uppercase",
              fontWeight: 600,
              px: 3,
              py: 1,
              "&:hover": {
                backgroundColor: "#5a2484",
              },
            }}
          >
            Subscribe
          </Button>
        </Box>
      </Box>
      <Divider sx={{ bgcolor: "#e0e0e0", mt: 0 }} />
    </Box>
  );
};

export default SubscribeBar;
