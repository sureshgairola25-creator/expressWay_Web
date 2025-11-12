import React, { useState, useEffect } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	Card,
	CardContent,
	MenuItem,
	Select,
	IconButton,
} from "@mui/material";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import headerImg1 from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
	getDropLocations,
	getFromLocations,
	getPickUpLocations,
	getToLocations,
} from "../../apiServices/locations";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./SidebarMoblie";
import { LocationCity } from "@mui/icons-material";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PickUpModal from "../modals/Pickup";
import DropModal from "../modals/Drop";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useSelector } from "react-redux";
import cabLogoImage from "../../assets/CAB.png";
import cabBanner from "../../assets/cabbanner.png";	
import cabDriver from "../../assets/cabdriver.png";	

const navLinks = ["About", "ContactUs", "Blogs", "Terms"];
// const images = [
// 	// "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80",
// 	// "https://images.unsplash.com/photo-1470341223622-1019832be824?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2288&q=80",
// 	// "https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2094&q=80",
// 	// "https://images.unsplash.com/photo-1534161308652-fdfcf10f62c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2174&q=80",
// 	// "../../../assets/cabdriver.png",
// 	"/assets/cabbanner.png",
// 	// "../../public/cabdriver.png",
// 	// "../../public/cabbanner.png",
// 	// "../../../assets/cabdriver.png",
// 	// "../../assets/cabbanner.png",
// 	// "../../../../assets/cabbanner.png",

// ];
const images = [
	cabBanner,
	cabDriver,
];

export default function HeroSection() {
	const userProfileData = useSelector((state) => state.userInfo.userInfo);
	const navigate = useNavigate();
	const [bgIndex, setBgIndex] = useState(0);
	const [journeyDate, setJourneyDate] = useState(null);
	const [pickupCity, setPickupCity] = useState("");
	const [fromCity, setFromCity] = useState("");
	const [selectedCity, setSelectedCity] = useState("");
	const [dropCity, setDropCity] = useState("");

	const [fromCityData, setFromCityData] = useState([]);
	const [pickupLocationData, setPickupLocationData] = useState([]);
	const [toCityData, setToCityData] = useState([]);
	const [dropLocationData, setDropLocationData] = useState([]);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const [openPickupModal, setOpenPickupModal] = useState(false);
	const [openDropModal, setOpenDropModal] = useState(false);
	const [pickupLoader, setPickupLoader] = useState(false);
	const [dropLoader, setDropLoader] = useState(false);

	// Auto slide
	useEffect(() => {
		const interval = setInterval(() => {
			setBgIndex((prev) => (prev + 1) % images.length);
		}, 4000);

		async function getFromCitys() {
			const fromCityapiData = await getFromLocations();
			setFromCityData(fromCityapiData.data);
		}
		getFromCitys();
		return () => clearInterval(interval);
	}, []);

	const handleDot = (idx) => setBgIndex(idx);

	const handleSearch = () => {
		// You can add validation here if needed
		if (fromCity && selectedCity && pickupCity && dropCity && journeyDate) {
			// Navigate to available cabs page with query parameters
			const queryParams = new URLSearchParams({
				from: fromCity,
				to: selectedCity,
				pickup: pickupCity,
				drop: dropCity,
				date: journeyDate.format("YYYY-MM-DD"),
			}).toString();
			navigate(`/available-cabs?${queryParams}`);
		} else {
			if (!fromCity) {
				toast.error("Please select a from city.");
			} else if (!pickupCity) {
				toast.error("Please select a pickup location.");
			} else if (!selectedCity) {
				toast.error("Please select a to city.");
			} else if (!dropCity) {
				toast.error("Please select a drop location.");
			} else if (!journeyDate) {
				toast.error("Please select a journey date.");
			} else if (dayjs(journeyDate).isBefore(dayjs(), "day")) {
				toast.error("Journey date cannot be in the past.");
			} else if (fromCity === selectedCity) {
				toast.error("From and To cities cannot be the same.");
			} else if (pickupCity === dropCity) {
				toast.error("Pickup and Drop locations cannot be the same.");
			} else {
				// All validations passed
				// Proceed with form submission or next step
			}
		}
	};

	const fromCityChange = async (e) => {
		setOpenPickupModal(true);
		setFromCity(e.target.value);
		setPickupLoader(true);
		const pickupLocationApiData = await getPickUpLocations(e.target.value);
		setPickupLocationData(pickupLocationApiData.data);
		setPickupLoader(false);
	};

	const pickupLocationChange = async (e) => {
		setPickupCity(e.target.value);
		const toCityApiData = await getToLocations(fromCity);
		setToCityData(toCityApiData.data);
	};

	const tolocationChange = async (e) => {
		setOpenDropModal(true);
		setSelectedCity(e.target.value);
		setDropLoader(true);
		const dropLocationApiData = await getDropLocations(e.target.value);
		setDropLocationData(dropLocationApiData.data);
		setDropLoader(false);
	};

	const handleProfile = () => {
		if (userProfileData.role == "admin") {
			navigate("/admin/dashboard");
		} else {
			navigate("/profile");
		}
	};

	return (
		<Box
			sx={{
				minHeight: { xs: 800, sm: 800, md: 600 },
				backgroundImage: `url(${images[bgIndex]})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				position: "relative",
				color: "#fff",
				transition: "background-image 1s ease",
			}}
		>
			{/* AppBar */}
			<AppBar position="static" sx={{ background: "transparent", boxShadow: "none", pt: 2 }}>
				<Toolbar sx={{ justifyContent: "space-between", zIndex: 2 }}>
					<Box sx={{ display: { md: "none", sm: "block" } }}>
						<IconButton
							color="inherit"
							//   onClick={handleDrawerToggle}
							onClick={() => setSidebarOpen(true)}
							sx={{ display: { md: "none", sm: "block" }, color: "#fff" }}
						>
							<MenuIcon fontSize="large" />
						</IconButton>
					</Box>
					<Box sx={{ display: { md: "none", sm: "block" } }}>
						<img
							src={cabLogoImage}
							alt="Logo"
							style={{ height: 70, borderRadius: 8, background: "#fff" }}
						/>
					</Box>
					<Box sx={{ pl: 21, display: { xs: "none", md: "block" } }}>
						<img
							src={cabLogoImage || "https://expresswaycab.com/wp-content/uploads/2025/09/expressway_logo_new-modified.png"}
							alt="Logo"
							style={{ height: 70, borderRadius: 8, background: "#fff" }}
						/>
					</Box>
					<Box sx={{ display: { md: "flex", sm: "none", xs: "none" }, gap: 3 }}>
						{navLinks.map((link) => (
							<Link
								to={`/${link.toLowerCase()}`}
								style={{ textDecoration: "none", color: "inherit" }}
								key={link.toLowerCase()}
							>
								<Button
									key={link}
									sx={{
										color: "#fff",
										fontWeight: 600,
										fontSize: 16,
										textTransform: "none",
										transition: "background 0.2s, color 0.2s",
										"&:hover": {
											color: "#7c3aed",
										},
									}}
								>
									{link}
								</Button>
							</Link>
						))}
					</Box>
					<Box sx={{ pr: 20,display:{ md: "block", sm: "none",xs: "none" } }}>
						{localStorage.getItem("authToken") ? (
							<IconButton
								aria-label="login/profile"
								color="primary"
								onClick={handleProfile}
								sx={{
									p: 1,
									color: "white",
								}}
							>
								<AccountCircleOutlinedIcon fontSize="large" />
							</IconButton>
						) : (
							<Button
								variant="contained"
								sx={{
									bgcolor: "#7c3aed",
									borderRadius: 20,
									px: 3,
									fontWeight: 600,
									display: { md: "block", sm: "none", xs: "none" },
								}}
								onClick={() => navigate("/login")}
							>
								Login
							</Button>
						)}
					</Box>
				</Toolbar>
			</AppBar>
			{/* Sidebar */}
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

			{/* Centered Search Card */}
			{/* <Container sx={{width:1200,maxWidth:1500,position: 'relative', zIndex: 2, pt: 6 }}> */}
			<Box
				sx={{
					position: "relative",
					zIndex: 2,
					mt: { xs: 12, sm: 12, md: 30 },
					px: { xs: 2, md: 8 },
					mx: { xs: 0, md: 15 },
				}}
			>
				<Card sx={{ borderRadius: 4, boxShadow: 4 }}>
					{/* Cab Icon Badge */}
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							position: "absolute",
							top: -50,
							left: "50%",
							transform: "translateX(-50%)",
							zIndex: 3,
							p: 1,
						}}
					>
						<Box
							sx={{
								bgcolor: "#7c3aed",
								borderRadius: "20%",
								width: 64,
								height: 64,
								display: "flex",
								flexDirection: "column",
								p: 5,
								justifyContent: "center",
								alignItems: "center",
								transition:
									"box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out",
								transform: "translateY(0)",
								boxShadow: "0 2px 8px rgba(124,58,237,0.15)",
								"&:hover": {
									boxShadow: "0 8px 25px rgba(124,58,237,0.5)",
									transform: "translateY(-4px)",
									cursor: "pointer",
								},
							}}
						>
							<LocalTaxiIcon sx={{ color: "#fff", fontSize: 38 }} />
							<Typography
								variant="subtitle2"
								sx={{
									color: "#faf8fcff",
									fontWeight: 700,
									fontSize: 16,
									mt: 1,
									textAlign: "center",
									letterSpacing: 1,
								}}
							>
								Cab
							</Typography>
						</Box>
					</Box>
					<CardContent
						sx={{
							bgcolor: "#fff",
							borderRadius: 4,
							px: 4,
							py: { xs: 8, sm: 8, md: 2 },
						}}
					>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							<Typography
								variant="h5"
								fontWeight={600}
								color="#222"
								sx={{ mb: 1, textAlign: "left" }}
							>
								Plan Class Services
							</Typography>
							<Box
								sx={{
									display: "flex",
									gap: 2,
									justifyContent: "space-evenly",
									flexDirection: "row", // Default stacked for phones
									flexWrap: "wrap",
								}}
							>
								{/* From */}
								<Box
									sx={{
										flex: { xs: "1 1 100%", md: "1 1 0" },
										minWidth: { xs: "100%", sm: 220, md: 160 },
									}}
								>
									<Typography variant="subtitle1" color="#222" fontWeight={500}>
										From
									</Typography>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											bgcolor: "#f5f5f5",
											borderRadius: 2,
											px: 2,
											py: 1,
											mt: 1,
										}}
									>
										{/* <Select
											variant="standard"
											value={fromCity}
											onChange={fromCityChange}
											displayEmpty
											disableUnderline
											sx={{
												flex: 1,
												bgcolor: "transparent",
												color: "#222",
												".MuiSelect-icon": { color: "#222" },
												overflow: "hidden",
											}}
											inputProps={{ style: { color: "#222" } }}
										>
											<MenuItem value="" disabled>
												Select From City
											</MenuItem>
											{fromCityData.map((city) => (
												<MenuItem key={city.id} value={city.id}>
													{city.name}
												</MenuItem>
											))}
										</Select> */}
										<Select
											variant="standard"
											value={fromCity}
											onChange={fromCityChange}
											displayEmpty
											disableUnderline
											sx={{
												flex: 1,
												bgcolor: "transparent",
												color: "#222",
												// We'll customize the icon directly or replace it
												// ".MuiSelect-icon": { color: "#222" }, // This would style the default arrow
												overflow: "hidden",
												// Adding some right padding to make space if the icon is larger
												pr: 1, // Add padding to the right if your custom icon is big
											}}
											inputProps={{ style: { color: "#5D3FD3" } }}
											// --- KEY CHANGE: Use IconComponent prop ---
											IconComponent={() => (
												<LocationCity
													sx={{
														color: "#5D3FD3",
														mr: 1, // Margin to separate from text
														pointerEvents: "none", // Prevent icon from interfering with click
														position: "absolute", // Position it absolutely
														right: 8, // Adjust as needed
														top: "50%", // Vertically center
														transform: "translateY(-50%)", // Fine-tune vertical centering
													}}
												/>
											)}
										>
											<MenuItem value="" disabled>
												Select From City
											</MenuItem>
											{fromCityData?.map((city) => (
												<MenuItem key={city.id} value={city.id}>
													{city.name}
												</MenuItem>
											))}
										</Select>
									</Box>
									{pickupCity && (
										<Typography
											variant="subtitle1"
											color="#222"
											fontWeight={500}
											mt={1}
											sx={{ cursor: "pointer" }}
											onClick={() => setOpenPickupModal(true)}
										>
											Pick Up :{" "}
											{
												pickupLocationData.filter(
													(item) => item.id == pickupCity
												)[0].name
											}
										</Typography>
									)}
								</Box>

								{/* Pick Up */}
								{/* <Box
									sx={{
										flex: { xs: "1 1 100%", md: "1 1 0" },
										minWidth: { xs: "100%", sm: 220, md: 160 },
									}}
								>
									<Typography variant="subtitle1" color="#222" fontWeight={500}>
										Pick Up
									</Typography>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											bgcolor: "#f5f5f5",
											borderRadius: 2,
											px: 2,
											py: 1,
											mt: 1,
										}}
									>
										<Select
											variant="standard"
											value={pickupCity}
											onChange={pickupLocationChange}
											displayEmpty
											disableUnderline
											sx={{
												flex: 1,
												bgcolor: "transparent",
												color: "#222",
												".MuiSelect-icon": { color: "#222" },
												overflow: "hidden",
											}}
											inputProps={{ style: { color: "#222" } }}
										>
											<MenuItem value="" disabled>
												Select Pick Up
											</MenuItem>
											{pickupLocationData.map((location) => (
												<MenuItem key={location.id} value={location.id}>
													{location.name}
												</MenuItem>
											))}
										</Select>
									</Box>
								</Box> */}
								<PickUpModal
									pickupLocationData={pickupLocationData}
									pickupCity={pickupCity}
									pickupLocationChange={pickupLocationChange}
									openPickupModal={openPickupModal}
									setOpenPickupModal={setOpenPickupModal}
									pickupLoader={pickupLoader}
								/>
								{/* To */}
								{/* <Box
									sx={{
										flex: { xs: "1 1 100%", md: "1 1 0" },
										minWidth: { xs: "100%", sm: 220, md: 160 },
									}}
								>
									<Typography variant="subtitle1" color="#222" fontWeight={500}>
										To
									</Typography>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											bgcolor: "#f5f5f5",
											borderRadius: 2,
											px: 2,
											py: 1,
											mt: 1,
										}}
									>
										<Select
											variant="standard"
											value={selectedCity}
											onChange={tolocationChange}
											displayEmpty
											disableUnderline
											sx={{
												flex: 1,
												bgcolor: "transparent",
												color: "#222",
												".MuiSelect-icon": { color: "#222" },
												overflow: "hidden",
											}}
											inputProps={{ style: { color: "#222" } }}
										>
											<MenuItem value="" disabled>
												Select To City
											</MenuItem>
											{toCityData.map((city) => (
												<MenuItem key={city.id} value={city.id}>
													{city.name}
												</MenuItem>
											))}
										</Select>
									</Box>
								</Box> */}
								<Box
									sx={{
										flex: { xs: "1 1 100%", md: "1 1 0" },
										minWidth: { xs: "100%", sm: 220, md: 160 },
									}}
								>
									<Typography variant="subtitle1" color="#222" fontWeight={500}>
										To
									</Typography>
									<Box
										sx={{
											display: "flex",
											alignItems: "center", // Ensures icon and select are vertically aligned
											bgcolor: "#f5f5f5",
											borderRadius: 2,
											px: 2,
											py: 1,
											mt: 1,
										}}
									>
										<Select
											variant="standard"
											value={selectedCity}
											onChange={tolocationChange}
											displayEmpty
											disableUnderline
											sx={{
												flex: 1,
												bgcolor: "transparent",
												color: "#222",
												// NOTE: We comment out or remove the default icon styling
												// because we are replacing the icon entirely.
												// ".MuiSelect-icon": { color: "#5D3FD3" },
												overflow: "hidden",
												// Padding ensures the text doesn't overlap the custom icon
												pr: "30px", // Increased right padding to ensure space for the icon
											}}
											inputProps={{ style: { color: "#5D3FD3" } }}
											// --- KEY CHANGE: Use IconComponent prop to insert the custom icon ---
											IconComponent={() => (
												<LocationCityIcon // Using the imported icon
													sx={{
														color: "#5D3FD3", // Purple color
														pointerEvents: "none", // Ensures clicks pass through to the Select's handlers
														position: "absolute",
														right: 8, // Adjust position relative to the Select's wrapping input
														top: "50%",
														transform: "translateY(-50%)", // Perfect vertical centering
														// Remove the default Select icon styling if it was inherited
														zIndex: 1,
													}}
												/>
											)}
										>
											<MenuItem value="" disabled>
												Select To City
											</MenuItem>
											{toCityData.map((city) => (
												<MenuItem key={city.id} value={city.id}>
													{city.name}
												</MenuItem>
											))}
										</Select>
									</Box>
									{dropCity && (
										<Typography
											variant="subtitle1"
											color="#222"
											fontWeight={500}
											mt={1}
											sx={{ cursor: "pointer" }}
											onClick={() => setOpenDropModal(true)}
										>
											Drop :{" "}
											{
												dropLocationData.filter(
													(item) => item.id == dropCity
												)[0]?.name
											}
										</Typography>
									)}
								</Box>

								{/* Drop */}
								{/* <Box
									sx={{
										flex: { xs: "1 1 100%", md: "1 1 0" },
										minWidth: { xs: "100%", sm: 220, md: 160 },
									}}
								>
									<Typography variant="subtitle1" color="#222" fontWeight={500}>
										Drop
									</Typography>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											bgcolor: "#f5f5f5",
											borderRadius: 2,
											px: 2,
											py: 1,
											mt: 1,
										}}
									>
										<Select
											variant="standard"
											value={dropCity}
											onChange={(e) => setDropCity(e.target.value)}
											displayEmpty
											disableUnderline
											sx={{
												flex: 1,
												bgcolor: "transparent",
												color: "#222",
												".MuiSelect-icon": { color: "#222" },
												overflow: "hidden",
											}}
											inputProps={{ style: { color: "#222" } }}
										>
											<MenuItem value="" disabled>
												Select Drop City
											</MenuItem>
											{dropLocationData.map((city) => (
												<MenuItem key={city.id} value={city.id}>
													{city.name}
												</MenuItem>
											))}
										</Select>
									</Box>
								</Box> */}
								<DropModal
									dropLocationData={dropLocationData}
									dropCity={dropCity}
									setDropCity={setDropCity}
									openDropModal={openDropModal}
									setOpenDropModal={setOpenDropModal}
									dropLoader={dropLoader}
								/>

								{/* Journey Date */}
								<Box
									sx={{
										flex: { xs: "1 1 100%", md: "1 1 0" },
										minWidth: { xs: "100%", sm: 220, md: 160 },
									}}
								>
									<Typography variant="subtitle1" color="#222" fontWeight={500}>
										Journey Date
									</Typography>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											bgcolor: "#f5f5f5",
											borderRadius: 2,
											px: 2,
											py: 1,
											mt: 1,
										}}
									>
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DatePicker
												value={journeyDate}
												onChange={(newValue) => setJourneyDate(newValue)}
												format="YYYY-MM-DD"
												minDate={dayjs()}
												slotProps={{
													textField: {
														variant: "standard",
														placeholder: "Select Journey Date",
														InputProps: {
															disableUnderline: true,
															style: { color: "#222" },
														},
														sx: {
															flex: 1,
															bgcolor: "transparent",
															input: { color: "#222" },
														},
													},
													openPickerIcon: {
														sx: { color: "#5D3FD3" }, // your desired color
													},
												}}
											/>
										</LocalizationProvider>
									</Box>
								</Box>

								{/* Search Button */}
								<Box
									sx={{
										flex: { xs: "1 1 100%", md: "0 0 auto" },
										minWidth: { xs: "100%", sm: 200, md: "auto" },
										display: "flex",
										justifyContent: "center",
										mt: { xs: 2, md: 0 },
									}}
								>
									<Button
										variant="contained"
										sx={{
											backgroundColor: "#662D91",
											color: "#fff",
											fontWeight: 600,
											textTransform: "none",
											px: 4,
											py: 3,
											borderRadius: "10px",
											fontSize: "16px",
											width: { xs: "100%", md: "auto" },
											boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
											"&:hover": { backgroundColor: "#5a2484" },
											"&:active": { transform: "scale(0.98)" },
										}}
										onClick={handleSearch}
									>
										Search
									</Button>
								</Box>
							</Box>
						</Box>
					</CardContent>
				</Card>
			</Box>

			{/* </Container> */}
			{/* Overlay for dark effect */}
			{/* <Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					background: "rgba(0,0,0,0.45)",
					zIndex: 1,
				}}
			/> */}
			{/* Dots at bottom of container */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: 1,
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 10,
					zIndex: 3,
				}}
			>
				{images.map((_, idx) => (
					<Box
						key={idx}
						onClick={() => handleDot(idx)}
						sx={{
							width: 12,
							height: 12,
							borderRadius: "50%",
							background: idx === bgIndex ? "#7c3aed" : "#fff",
							opacity: idx === bgIndex ? 1 : 0.5,
							border: "2px solid #7c3aed",
							transition: "background 0.3s",
							cursor: "pointer",
						}}
					/>
				))}
			</Box>
		</Box>
	);
}
