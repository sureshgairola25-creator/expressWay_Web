import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from "@mui/material";
import { AccountCircle, ArrowDropDown } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./SidebarMoblie";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useSelector } from "react-redux";

const Header = () => {
	const userProfileData = useSelector((state)=> state.userInfo.userInfo)
	const navigate = useNavigate();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const logoClickHandler = () => {
		navigate("/");
	};

	const handleClickPerLogo = ()=>{
		if (userProfileData.role == "admin"){
			navigate("/admin/dashboard")
		}else{
			navigate("/profile")
		}
	}
	return (
		<AppBar
			position="static"
			sx={{
				backgroundColor: "white",
				boxShadow: "none",
				borderBottom: "1px solid #eee",
				px: { md: 28, sx: 2 },
				py: 1,
			}}
		>
			{/* Sidebar */}
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<Box sx={{
  display: { xs: "block", sm: "block", md: "none" }
}}
>
					<IconButton
						color="inherit"
						//   onClick={handleDrawerToggle}
						onClick={() => setSidebarOpen(true)}
						sx={{ display: { md: "none", sm: "block",xs: "block" }, color: "#312e2eff" }}
					>
						<MenuIcon fontSize="large" />
					</IconButton>
				</Box>
				{/* Left - Logo */}
				<Box
					sx={{ display: {sm:"none",md:"flex",xs: "none"}, alignItems: "center", cursor: "pointer" }}
					onClick={logoClickHandler}
				>
					<img
						src={
							"https://expresswaycab.com/wp-content/uploads/2025/09/expressway_logo_new-modified.png"
						}
						alt="Logo"
						style={{ height: 70, borderRadius: 8, background: "#fff" }}
					/>
				</Box>

				{/* Center - Nav Links */}
				<Box sx={{ display: {xs: "none",sm:"none",md:"flex"}, gap: 4 }}>
					{["About", "ContactUs", "Blogs", "Terms"].map((item) => (
						<Link
							to={`/${item.toLowerCase()}`}
							style={{ textDecoration: "none", color: "inherit" }}
							key={item}
						>
							<Typography
								key={item}
								variant="body1"
								sx={{
									color: "black",
									fontWeight: 500,
									cursor: "pointer",
									"&:hover": { color: "#7B1FA2" },
								}}
							>
								{item}
							</Typography>
						</Link>
					))}
				</Box>

				{/* Right - Login Button */}
				{
					localStorage.getItem("authToken") ? (
							<IconButton
								aria-label="login/profile"
								color="primary" 
								onClick={handleClickPerLogo}
								sx={{
									p: 1, 
									color: "#7B1FA2",
								}}
							>
								<AccountCircleOutlinedIcon fontSize="large" />
							</IconButton>):(
								<Button
					variant="contained"
					sx={{
						backgroundColor: "#7B1FA2",
						borderRadius: "50px",
						textTransform: "none",
						px: 2,
						mr: 1,
						"&:hover": { backgroundColor: "#6A1B9A" },
						display: { xs: "none", md: "flex" },
					}}
					startIcon={<AccountCircle />}
					endIcon={<ArrowDropDown />}
					onClick={() => navigate("/login")}
				>
					Login
				</Button>
							)
				}
				
			</Toolbar>
		</AppBar>
	);
};

export default Header;
