import React from "react";
import { Drawer, Box, Button, Typography, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../apiServices/auth";
import { useDispatch } from "react-redux";
import { clearUser } from "../../slices/userInfo";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = localStorage.getItem("authToken");

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(clearUser());
      navigate('/login');
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
	return (
		<Drawer
			anchor="left"
			open={open}
			onClose={onClose}
			sx={{
				"& .MuiDrawer-paper": {
					width: 260,
					background: "#121212",
					color: "#fff",
					p: 2,
				},
			}}
		>
			<Box>
				<Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
					Expressway Cab
				</Typography>
				<Divider sx={{ bgcolor: "gray", mb: 2 }} />
				<Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
					<Button sx={{ color: "#fff", display: "block", mb: 1 }}>Home</Button>
				</Link>
				<Link to={"/about"} style={{ textDecoration: "none", color: "inherit" }}>
					<Button sx={{ color: "#fff", display: "block", mb: 1 }}>About</Button>
				</Link>
				<Link to={"/contactus"} style={{ textDecoration: "none", color: "inherit" }}>
					<Button sx={{ color: "#fff", display: "block", mb: 1 }}>Contact Us</Button>
				</Link>
				<Link to={"/blogs"} style={{ textDecoration: "none", color: "inherit" }}>
					<Button sx={{ color: "#fff", display: "block", mb: 1 }}>Blogs</Button>
				</Link>
				<Link to={"/terms"} style={{ textDecoration: "none", color: "inherit" }}>
					<Button sx={{ color: "#fff", display: "block", mb: 1 }}>Terms</Button>
				</Link>
				<Divider sx={{ bgcolor: "gray", mt: 2, mb: 2 }} />
        {isAuthenticated ? (
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              bgcolor: "#7c3aed",
              borderRadius: 20,
              px: 3,
              fontWeight: 600,
              width: '100%',
              mb: 1
            }}
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="contained"
            component={Link}
            to="/login"
            onClick={onClose}
            sx={{
              bgcolor: "#7c3aed",
              borderRadius: 20,
              px: 3,
              fontWeight: 600,
              width: '100%'
            }}
          >
            Login
          </Button>
        )}
			</Box>
		</Drawer>
	);
}
