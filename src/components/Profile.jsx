import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // <-- NEW: Import useLocation
import {
	Box,
	Typography,
	Paper,
	Avatar,
	Divider,
	Button,
	Grid,
	ThemeProvider,
	createTheme,
	IconButton,
	TextField,
	FormControl,
	FormLabel,
	InputLabel,
	Select,
	MenuItem,
	RadioGroup,
	FormControlLabel,
	Radio,
} from "@mui/material";
import {
	Email,
	Phone,
	Person,
	Edit,
	Settings,
	Save,
	Male,
	Female,
	Home as HomeIcon,
	BookOnline as BookingsIcon,
	Logout as LogoutIcon,
} from "@mui/icons-material";

// NOTE: Assuming Header, SubscribeBar, Footer are available and functional
import Header from "./layout/Header";
import SubscribeBar from "./SubscribeBar";
import Footer from "./layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDataById } from "../apiServices/userInfo";
import { toast } from "react-toastify";
import { setUserInfo } from "../slices/users";
import { clearUser, setUser } from "../slices/userInfo";
const BASE_URL = "http://65.1.253.52/"
// --- PURPLE THEME DEFINITION ---
const profileTheme = createTheme({
	palette: {
		primary: {
			main: "#6200EE", // Deep, vibrant purple
			light: "#9e47ff",
			dark: "#30009c",
		},
		secondary: {
			main: "#888888",
		},
		success: {
			main: "#388E3C",
		},
		background: {
			default: "#f4f7f9",
		},
		customInput: {
			main: "#f0f4f7",
		},
	},
	typography: {
		h5: {
			fontWeight: 600,
		},
		subtitle1: {
			fontWeight: 500,
			color: "#343a40",
		},
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
				},
			},
		},
		MuiAvatar: {
			styleOverrides: {
				root: {
					border: "4px solid #fff",
					boxShadow: "0 0 10px rgba(0,0,0,0.1)",
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				variant: "filled",
				size: "small",
			},
			styleOverrides: {
				root: ({ theme }) => ({
					marginTop: 8,
					marginBottom: 8,
					backgroundColor: theme.palette.customInput.main,
					borderRadius: 8,

					"& .MuiFilledInput-root": {
						borderRadius: 8,
						backgroundColor: theme.palette.customInput.main,
						border: "1px solid transparent",
						"&:before, &:after": {
							display: "none",
						},
						"&.Mui-focused": {
							border: `1px solid ${theme.palette.primary.main}`,
						},
					},
				}),
			},
		},
	},
});

// --- Sidebar Component (MODIFIED to use useLocation) ---
const Sidebar = () => {
	// 1. Get the current URL path
	const location = useLocation();
	const currentPath = location.pathname;
	const navigate = useNavigate();
    const dispatch = useDispatch();
	// --- 1. Define Active State for Each Button ---
	const isActiveProfile = currentPath === "/profile";
	// Use a loose check for Home ('/') as it's often the root path
	const isActiveHome = currentPath === "/";
	// Use startsWith for 'My Bookings' to activate for paths like /bookings/123
	const isActiveBookings = currentPath.startsWith("/bookings");

	const logoutHandler = async () => {
		try {
            console.log("Logout handler call")
            dispatch(clearUser())
			const token = localStorage.getItem("authToken");
			// await fetch(`${BASE_URL}api/v1/users/logout`, {
			// 	method: "POST",
			// 	headers: {
			// 		Authorization: `Bearer ${token}`,
			// 		"Content-Type": "application/json",
			// 	},
			// });
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			// Clear local storage and redirect
			localStorage.removeItem("authToken");
			localStorage.removeItem("userInfo");
			navigate("/login");
		}
	};

	return (
		<Paper
			sx={{
				p: { xs: 2, md: 3 },
				mb: { xs: 3, md: 0 },
				height: { md: "100%" },
			}}
		>
			<Typography variant="h6" sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}>
				Navigation
			</Typography>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
				{/* 1. My Profile Button (using standard Button) */}
				<Button
					variant={isActiveProfile ? "contained" : "text"}
					color={isActiveProfile ? "primary" : "inherit"}
					startIcon={<Person />}
					fullWidth
					onClick={() => navigate("/profile")}
					sx={{
						justifyContent: "flex-start",
						py: 1.5,
						fontSize: "1rem",
						fontWeight: 600,
						"&:hover": {
							bgcolor: "rgba(98, 0, 238, 0.08)", // Purple hover effect
						},
					}}
				>
					My Profile
				</Button>

				{/* 2. Home Button (using standard Button) */}
				<Button
					variant={isActiveHome ? "contained" : "text"}
					color={isActiveHome ? "primary" : "inherit"}
					startIcon={<HomeIcon />}
					fullWidth
					onClick={() => navigate("/")}
					sx={{
						justifyContent: "flex-start",
						py: 1.5,
						fontSize: "1rem",
						fontWeight: 600,
						"&:hover": {
							bgcolor: "rgba(98, 0, 238, 0.08)",
						},
					}}
				>
					Home
				</Button>

				{/* 3. My Bookings Button (using standard Button) */}
				<Button
					variant={isActiveBookings ? "contained" : "text"}
					color={isActiveBookings ? "primary" : "inherit"}
					startIcon={<BookingsIcon />}
					fullWidth
					onClick={() => navigate("/bookings")}
					sx={{
						justifyContent: "flex-start",
						py: 1.5,
						fontSize: "1rem",
						fontWeight: 600,
						"&:hover": {
							bgcolor: "rgba(98, 0, 238, 0.08)",
						},
					}}
				>
					My Bookings
				</Button>

				{/* 4. Logout Button */}
				<Button
					variant="text"
					color="error"
					startIcon={<LogoutIcon />}
					fullWidth
					onClick={logoutHandler}
					sx={{
						justifyContent: "flex-start",
						py: 1.5,
						fontSize: "1rem",
						fontWeight: 600,
						mt: "auto",
						"&:hover": {
							bgcolor: "rgba(220, 53, 69, 0.08)",
						},
					}}
				>
					Logout
				</Button>
			</Box>
		</Paper>
	);
};

// --- Profile Card Component (Remains the same, uses the updated Sidebar) ---
const UserProfileCard = () => {
	const dispatch = useDispatch();
	const userProfileData = useSelector((state) => state.userInfo.userInfo);

	// Initialize profile state with default values and map user data
	const [profile, setProfile] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phoneNo: "",
		ageRange: "",
		gender: "",
		...userProfileData, // This will override the defaults with any data from Redux
	});

	const [preferences, setPreferences] = useState({
		preferredLanguage: userProfileData?.preferredLanguage || "English",
		defaultCurrency: userProfileData?.defaultCurrency || "INR - Indian Rupee",
	});

	const [isEditing, setIsEditing] = useState(false);

	// Update local state when Redux state changes
	React.useEffect(() => {
		if (userProfileData) {
			setProfile((prev) => ({
				...prev,
				...userProfileData,
			}));
		}
	}, [userProfileData]);

	const handleProfileChange = (e) => {
		const { name, value } = e.target;
		setProfile((prev) => ({ ...prev, [name]: value }));
	};

	const handlePreferenceChange = (e) => {
		setPreferences((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const callSaveDataApi = async () => {
		try {
			const response = await updateUserDataById(profile);
			if (response.success) {
				toast.success("Profile Updated Succefully.");
				dispatch(setUserInfo(response.data));
			}
		} catch (error) {
			console.log("error in call save api : ", error);
		}
	};

	const handleSaveAll = () => {
		setIsEditing(false);
		callSaveDataApi();
	};

	const ProfileDetail = ({ icon: Icon, label, value }) => (
		<Grid item xs={12} sm={6}>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Icon color="secondary" sx={{ mr: 1.5, fontSize: 20 }} />
				<Typography variant="subtitle1" component="div">
					{label}: **{value}**
				</Typography>
			</Box>
		</Grid>
	);

	return (
		<>
			<Header />
			<ThemeProvider theme={profileTheme}>
				<Box
					sx={{
						bgcolor: "background.default",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						p: { xs: 2, sm: 4, md: 4 },
					}}
				>
					{/* --- MAIN LAYOUT GRID --- */}
					<Grid container spacing={{ xs: 2, md: 4 }}>
						<Grid item xs={12} md={3}>
							<Sidebar />
						</Grid>

						<Grid item xs={12} md={9}>
							<Paper
								sx={{
									width: "100%",
									textAlign: "center",
									p: { xs: 3, sm: 4 },
									position: "relative",
								}}
							>
								{/* Floating Edit/Cancel Button (Uses primary.main/error.main) */}
								<IconButton
									onClick={() => setIsEditing(!isEditing)}
									sx={{
										position: "absolute",
										top: 16,
										right: 16,
										color: isEditing ? "error.main" : "primary.main",
									}}
									size="large"
								>
									{isEditing ? <Person /> : <Edit />}
								</IconButton>

								{/* Avatar Section (Uses primary.main) */}
								<Avatar
									alt={profile.firstName}
									src={profile.profilePicture}
									sx={{
										width: 120,
										height: 120,
										bgcolor: profileTheme.palette.primary.main,
										mx: "auto",
										mt: 2,
										mb: 2,
									}}
								>
									{profile.firstName ? profile.firstName.charAt(0) : ""}
								</Avatar>

								{/* Name uses primary.main (Purple) */}
								<Typography
									variant="h5"
									sx={{ color: profileTheme.palette.primary.main }}
								>
									{profile.firstName}
								</Typography>
								<Typography variant="body2" color="secondary" sx={{ mb: 3 }}>
									{isEditing ? "Edit All Details" : "User Profile Summary"}
								</Typography>

								<Divider sx={{ my: 2 }} />

								{/* --- SECTION 1: CONTACT AND PERSONAL DETAILS --- */}
								<Typography variant="h6" align="left" sx={{ mb: 2, mt: 1 }}>
									Contact Information
								</Typography>

								<Grid container spacing={3} sx={{ textAlign: "left" }}>
									{isEditing ? (
										<>
											<Grid item xs={12} sm={6}>
												<TextField
													label="First Name"
													name="firstName"
													fullWidth
													value={profile.firstName || ""}
													onChange={handleProfileChange}
												/>
											</Grid>
											<Grid item xs={12} sm={6}>
												<TextField
													label="Last Name"
													name="lastName"
													fullWidth
													value={profile.lastName || ""}
													onChange={handleProfileChange}
												/>
											</Grid>
											<Grid item xs={12} sm={6}>
												<TextField
													label="Phone Number"
													name="phoneNo"
													type="tel"
													fullWidth
													value={profile.phoneNo || ""}
													onChange={handleProfileChange}
												/>
											</Grid>

											<Grid item xs={12} sm={6}>
												<TextField
													label="Email ID"
													name="email"
													type="email"
													fullWidth
													value={profile.email || ""}
													onChange={handleProfileChange}
												/>
											</Grid>

											<Grid item xs={12} sm={6} sx={{ width: "20%" }}>
												<FormControl fullWidth>
													<InputLabel id="age-range-label">
														Age Range
													</InputLabel>
													<Select
														labelId="age-range-label"
														name="ageRange"
														value={profile?.ageRange || ""}
														onChange={handleProfileChange}
														label="Age Range"
													>
														<MenuItem value="">
															<em>Select Age Range</em>
														</MenuItem>
														<MenuItem value="18-25">18-25</MenuItem>
														<MenuItem value="25-30">25-30</MenuItem>
														<MenuItem value="30-35">30-35</MenuItem>
														<MenuItem value="35-40">35-40</MenuItem>
														<MenuItem value="40-50">40-50</MenuItem>
														<MenuItem value="50-60">50-60</MenuItem>
													</Select>
												</FormControl>
											</Grid>

											<Grid
												item
												xs={6}
												sm={3}
												sx={{
													display: "flex",
													flexDirection: "column",
													justifyContent: "center",
												}}
											>
												<FormControl component="fieldset" fullWidth>
													{/* FormLabel uses secondary color */}
													<FormLabel
														component="legend"
														sx={{
															color: profileTheme.palette.secondary
																.main,
														}}
													>
														Gender
													</FormLabel>
													<RadioGroup
														row
														name="gender"
														value={profile.gender || ""}
														onChange={handleProfileChange}
													>
														<FormControlLabel
															value="Male"
															control={<Radio size="small" />}
															label="Male"
														/>
														<FormControlLabel
															value="Female"
															control={<Radio size="small" />}
															label="Female"
														/>
													</RadioGroup>
												</FormControl>
											</Grid>
										</>
									) : (
										// DISPLAY MODE (Uses secondary color for icons)
										<>
											<ProfileDetail
												icon={Email}
												label="Email"
												value={profile.email}
											/>
											<ProfileDetail
												icon={Phone}
												label="Phone"
												value={profile.number}
											/>
											<ProfileDetail
												icon={Person}
												label="Age"
												value={profile.age}
											/>
											<ProfileDetail
												icon={profile.gender === "Male" ? Male : Female}
												label="Gender"
												value={profile.gender}
											/>
										</>
									)}
								</Grid>

								<Divider sx={{ my: 4 }} />

								{isEditing && (
									<Button
										variant="contained"
										color="success"
										fullWidth
										startIcon={<Save />}
										onClick={handleSaveAll}
										sx={{ py: 1.5, width: { xs: "100%", sm: "auto" } }}
									>
										Save All Changes
									</Button>
								)}
							</Paper>
						</Grid>
					</Grid>
					{/* --- END MAIN LAYOUT GRID --- */}
				</Box>
			</ThemeProvider>
			<SubscribeBar />
			<Footer />
		</>
	);
};

export default UserProfileCard;
