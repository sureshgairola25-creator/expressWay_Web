import React from "react";
import { Box, Grid, Typography, IconButton } from "@mui/material";
import { Phone, Email, Language, LocationOn } from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import {Link} from "react-router-dom"

const Footer = () => {
	return (
		<Box
			sx={{
				backgroundColor: "#0e1b1b",
				color: "#fff",
				pt: 6,
				pb: 3,
				px: { xs: 8, md: 30 },
			}}
		>
			{/* Logo and socials */}
			<Box
				sx={{
					display: "flex",
					flexDirection: {md:"row",xs:"column",sm:"column"},
					flexWrap:{xs:"wrap",sm:"wrap", md:"nowrap"},
					alignItems: {md:"flex-end",xs:"flex-start",sm:"flex-start"},
					mb: 4,
				}}
			>
				<Box
					component="img"
					src={
						"https://expresswaycab.com/wp-content/uploads/2025/09/expressway_logo_new-modified.png"
					}
					alt="Stavvya Estates"
					sx={{ height: 80, mb: 2 }}
				/>
				<Box sx={{ flexGrow: 1 }} />
				<Typography variant="h6" sx={{ fontWeight: 500 }}>
					Follow Our Socials : 
				</Typography>
				<Box sx={{ mt: 1 }}>
					<IconButton
						color="inherit"
						component="a"
						href="https://www.instagram.com/expresswaycab/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<InstagramIcon />
					</IconButton>
					<IconButton
						color="inherit"
						component="a"
						href="https://www.facebook.com/people/Expressway-CAB/61581240262368/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FacebookIcon />
					</IconButton>
					<IconButton color="inherit"
					component="a"
						href="https://www.youtube.com/@Expresswaycab"
						target="_blank"
						rel="noopener noreferrer">
						<YouTubeIcon />
					</IconButton>
					{/* <IconButton
						color="inherit"
						component="a"
						href="https://www.instagram.com/expresswaycab/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<TwitterIcon />
					</IconButton> */}
					
				</Box>
			</Box>

			{/* Divider */}
			<Box sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)", mb: 4 }} />

			{/* Main content */}
			<Box
				sx={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "space-between",
					gap: 1,
					color: "#fff",
				}}
			>
				{/* Information */}
				<Box sx={{ flex: "1 1 250px", minWidth: 250 }}>
					<Typography variant="h6" gutterBottom>
						Information
					</Typography>
					<Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
						When you think expresswaycab, you are choose the best.
					</Typography>
					<Typography variant="body2" sx={{ color: "#ccc" }}>
						We are passionate about real estate and we absolutely care about your bottom
						line. We will do everything in our power to live our core values and help
						you turn your portfolio management goals into reality.
					</Typography>
				</Box>

				{/* Links */}
				<Box sx={{ flex: "1 1 150px", minWidth: 150 }}>
					<Typography variant="h6" gutterBottom>
						Links
					</Typography>
					{[{path:"/",name:"Home"}, {path:"/about",name:"About Us"}, {path:"/blogs",name:"Blogs"}, {path:"/contactus",name:"Contact Us"}].map((text) => (
						<Typography key={text.name} variant="body2" sx={{ mb: 0.5 }}>
							<Link to={text.path} color="inherit" underline="hover" style={{ textDecoration: "none", color: "inherit" }}>
								{text.name}
							</Link>
						</Typography>
					))}
				</Box>

				{/* Contact Us */}
				<Box sx={{ flex: "1 1 250px", minWidth: 250 }}>
					<Typography variant="h6" gutterBottom>
						Contact Us
					</Typography>

					{["9211-81-0680", "+91 7060150012", "+91 7060150013"].map((phone, i) => (
						<Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
							<Phone fontSize="small" sx={{ mr: 1 }} />
							<Typography variant="body2">{phone}</Typography>
						</Box>
					))}

					<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
						<Email fontSize="small" sx={{ mr: 1 }} />
						<Typography variant="body2">expresswaycabhelp@gmail.com</Typography>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Language fontSize="small" sx={{ mr: 1 }} />
						<Link
							href="https://expresswaycab.com/"
							color="inherit"
							underline="hover"
							variant="body2"
							style={{ textDecoration: "none", color: "inherit" }}
						>
							https://expresswaycab.com/
						</Link>
					</Box>
				</Box>

				{/* Reach Us */}
				<Box sx={{ flex: "1 1 300px", minWidth: 280 }}>
					<Typography variant="h6" gutterBottom>
						Reach Us
					</Typography>

					<Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
						<LocationOn fontSize="small" sx={{ mr: 1, mt: 0.3 }} />
						<Typography variant="body2">
							<strong>Office Address : Corp. Office-</strong>
							<br />
							13-A Partap Nagar Mayur Vihar Phase 1 Near Jeevan Anmol Hospital
							Delhi-110091
						</Typography>
					</Box>

					<Box sx={{ display: "flex", alignItems: "flex-start" }}>
						<LocationOn fontSize="small" sx={{ mr: 1, mt: 0.3 }} />
						<Typography variant="body2">
							<strong>Regd. Off -</strong>
							<br />
							13-A Partap Nagar Mayur Vihar Phase 1 Near Jeevan Anmol Hospital
							Delhi-110091
						</Typography>
					</Box>
				</Box>
			</Box>
			{/* Bottom line */}
			<Box
				sx={{
					textAlign: "center",
					mt: 5,
					pt: 3,
					borderTop: "1px solid rgba(255,255,255,0.1)",
					fontSize: "0.9rem",
					color: "#aaa",
				}}
			>
				Copyright © 2025 expresswaycab. All Rights Reserved. Powered by{" "}
				<Link href="#" underline="hover" color="#7ea6e0" sx={{ fontWeight: 500 }} style={{ textDecoration: "none", color: "inherit" }}>
					expresswaycab
				</Link>
			</Box>
		</Box>
	);
};

export default Footer;
