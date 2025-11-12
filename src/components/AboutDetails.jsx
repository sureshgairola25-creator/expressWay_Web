import React from "react";
import {
	Container,
	Typography,
	Grid,
	Box,
	Card,
	CardContent,
	Avatar,
	Paper,
	Divider,
	ThemeProvider,
	createTheme,
	useTheme,
	Button,
} from "@mui/material";
import { SafetyDivider, ShoppingCart, AttachMoney, FormatQuote } from "@mui/icons-material";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import SubscribeBar from "./SubscribeBar";

// --- Custom Theme ---
const purpleTheme = createTheme({
	palette: {
		primary: { main: "#673ab7" },
		secondary: { main: "#e57373" },
		background: { default: "#f7f6fb" },
	},
	typography: {
		h2: { fontWeight: 700, color: "#222" },
		h4: { fontWeight: 600, color: "#673ab7" },
		subtitle1: { color: "#555" },
	},
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					boxShadow: "0 6px 18px rgba(0, 0, 0, 0.05)",
					transition: "transform 0.3s ease, box-shadow 0.3s ease",
					"&:hover": {
						transform: "translateY(-5px)",
						boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
					},
				},
			},
		},
	},
});

// --- Helper Components ---
const MissionVisionSection = ({ title, content, color }) => (
	<Box sx={{ p: 3, borderLeft: `6px solid ${color}`, my: 3, bgcolor: "#fff", borderRadius: 2 }}>
		<Typography variant="h5" sx={{ fontWeight: 700, color, mb: 1 }}>
			{title}
		</Typography>
		<Typography variant="body1" sx={{ color: "#555", lineHeight: 1.7 }}>
			{content}
		</Typography>
	</Box>
);

const FeatureCard = ({ icon, title, description }) => {
	const theme = useTheme();
	return (
		<Card sx={{ height: "100%", textAlign: "center", p: 3,width:480 }}>
			<CardContent>
				<Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
					{React.cloneElement(icon, { sx: { fontSize: 60 } })}
				</Box>
				<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
					{title}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{description}
				</Typography>
			</CardContent>
		</Card>
	);
};

const TestimonialCard = ({ name, role, quote }) => {
	const theme = useTheme();
	return (
		<Card
			sx={{
				minWidth: 340,
				flex: "0 0 auto",
				mx: 2,
				p: 4,
				borderRadius: 5,
				position: "relative",
				overflow: "hidden",
				// background: `linear-gradient(145deg, #ede7f6 0%, #d1c4e9 100%)`, // soft light purple gradient
				color: theme.palette.text.primary,
				boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
				transition: "transform 0.3s ease, box-shadow 0.3s ease",
				"&:hover": {
					transform: "translateY(-6px)",
					boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
				},
			}}
		>
			{/* Decorative Quote Icon */}
			<FormatQuote
				sx={{
					position: "absolute",
					top: 12,
					right: 20,
					fontSize: 110,
					color: "rgba(103, 58, 183, 0.08)", // light purple transparent
					transform: "rotate(10deg)",
				}}
			/>

			{/* Avatar & Name Section */}
			<Box display="flex" alignItems="center" mb={2}>
				<Avatar
					alt={name}
					src={`/static/images/avatar/${name}.jpg`}
					sx={{
						width: 64,
						height: 64,
						mr: 2.5,
						border: `2px solid ${theme.palette.primary.main}`,
						boxShadow: "0 2px 6px rgba(103,58,183,0.3)",
					}}
				/>
				<Box>
					<Typography
						variant="h6"
						sx={{ fontWeight: 700, color: theme.palette.text.primary }}
					>
						{name}
					</Typography>
					<Typography
						variant="subtitle2"
						sx={{
							color: theme.palette.text.secondary,
							fontStyle: "italic",
							fontSize: "0.9rem",
						}}
					>
						{role}
					</Typography>
				</Box>
			</Box>

			{/* Quote Text */}
			<Typography
				variant="body1"
				sx={{
					fontStyle: "italic",
					lineHeight: 1.7,
					color: theme.palette.text.primary,
					fontSize: "1rem",
				}}
			>
				“{quote}”
			</Typography>
		</Card>
	);
};

const PartnerLogo = ({ name }) => (
	<Grid item xs={6} sm={4} md={2}>
		<Box
			sx={{
				height: 80,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				opacity: 0.6,
				"&:hover": { opacity: 1 },
				transition: "opacity 0.3s",
				p: 2,
			}}
		>
			<Typography variant="h6" sx={{ fontWeight: 700, color: "#333" }}>
				{name}
			</Typography>
		</Box>
	</Grid>
);

// --- Main Component ---
const AboutUs = () => {
	const companyDescription = `RV EXPRESSWAY CAB LLP is a reputable transportation company dedicated to providing high-quality and professional services for individuals, families, and businesses.`;

	const missionContent = `Our mission is to redefine transportation by delivering seamless, safe, and comfortable travel experiences through innovation and professional excellence.`;

	const visionContent = `We envision becoming a leading name in the transportation industry, known for our reliability, sustainability, and customer-first approach.`;

	const features = [
		{
			icon: <SafetyDivider />,
			title: "Safety First",
			description:
				"Every journey is monitored and prioritized for safety, ensuring passenger security and driver responsibility.",
		},
		{
			icon: <ShoppingCart />,
			title: "Ad-on Services",
			description:
				"Beyond transport — enjoy personalized and additional services that enhance your overall experience.",
		},
		{
			icon: <AttachMoney />,
			title: "Cost Effective Fare",
			description:
				"Affordable rates without compromising quality, offering transparent and value-for-money travel.",
		},
	];

	const testimonials = [
		{
			name: "Pritam Thakur",
			role: "Business Owner",
			quote: "Expressway Cab is my go-to for business travel — always punctual and comfortable!",
		},
		{
			name: "Mamta Bedi",
			role: "Corporate Employee",
			quote: "Impressed by the professionalism and fair pricing. Highly recommended!",
		},
		{
			name: "Rahul Verma",
			role: "Frequent Traveler",
			quote: "Smooth rides and courteous drivers. A great experience every time.",
		},
	];

	const partners = [
		"CHIPPY'S",
		"BULLSEYE",
		"MIGHTY FURNITURES",
		"avant garde",
		"FASTLANE SPORTSWEAR",
		"RJ RON JONES",
	];

	return (
		<>
			<Header />
			<ThemeProvider theme={purpleTheme}>
				<Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
					<Container maxWidth="xl">
						{/* --- Company Overview --- */}
						<Box sx={{ mb: 8 }}>
							<Typography variant="h2" align="center" gutterBottom>
								About The Company
							</Typography>
							<Typography
								variant="subtitle1"
								align="center"
								sx={{ mb: 4, maxWidth: 900, mx: "auto" }}
							>
								<b>RV EXPRESSWAY CAB LLP</b>
							</Typography>

							<Grid container spacing={4} >
								<Grid item xs={12} md={7}>
									<Paper elevation={3} sx={{ p: 4, height: "100%" }}>
										<Typography variant="h4" sx={{ mb: 2 }}>
											History & Background
										</Typography>
										<Typography variant="body1" sx={{ color: "#555" }}>
											{companyDescription}
											<br />
											<br />
											Over time, we have expanded our fleet and services,
											building trust through dedication, innovation, and
											customer satisfaction.
										</Typography>
										{/* <Button variant="contained" color="primary" sx={{ mt: 3 }}>
											View Full Service Offerings
										</Button> */}
									</Paper>
								</Grid>

								<Grid item xs={12} md={5}>
									<Paper elevation={3} sx={{ p: 3, height: "100%" }}>
										<MissionVisionSection
											title="Our Mission"
											content={missionContent}
											color={purpleTheme.palette.primary.main}
										/>
										<Divider sx={{ my: 2 }} />
										<MissionVisionSection
											title="Our Vision"
											content={visionContent}
											color={purpleTheme.palette.secondary.main}
										/>
									</Paper>
								</Grid>
							</Grid>
						</Box>

						<Divider sx={{ my: 6 }} />


						{/* --- Why Choose Us (Horizontal Scroll) --- */}
						<Box sx={{ mb: 8 }}>
							<Typography variant="h4" align="center" sx={{ mb: 4 }}>
								<span style={{ color: purpleTheme.palette.primary.main }}>
									OUR FEATURE:
								</span>{" "}
								Why Choose Us
							</Typography>

							<Box
								sx={{
									display: "flex",
									overflowX: "auto",
									px: 2,
									py: 1,
									gap: 2,
									"&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
									scrollbarWidth: "none", // Firefox
								}}
							>
								{features.map((feature, index) => (
									<Box key={index} sx={{ minWidth: 100, flexShrink: 0 }}>
										<FeatureCard {...feature} />
									</Box>
								))}
							</Box>
						</Box>

						<Divider sx={{ my: 6 }} />

						{/* --- Testimonials (Horizontal Scroll) --- */}
						<Box sx={{ mb: 8 }}>
							<Typography variant="h4" align="center" sx={{ mb: 4 }}>
								<span style={{ color: purpleTheme.palette.primary.main }}>
									TESTIMONIAL:
								</span>{" "}
								What Our Passengers Say
							</Typography>

							<Box
								sx={{
									display: "flex",
									overflowX: "auto",
									px: 2,
									py: 1,
									gap: 2,
									// Hide scrollbar
									"&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
									scrollbarWidth: "none", // Firefox
								}}
							>
								{testimonials.map((testimonial, index) => (
									<TestimonialCard key={index} {...testimonial} />
								))}
							</Box>
						</Box>

						<Divider sx={{ my: 6 }} />

						{/* --- Partners --- */}
						<Box sx={{ mb: 8 }}>
							<Typography variant="h4" align="center" sx={{ mb: 4 }}>
								“Together, We Build Success.”
							</Typography>
							<Typography
								variant="body1"
								align="center"
								color="text.secondary"
								sx={{ mb: 4, maxWidth: 700, mx: "auto" }}
							>
								Our partners are at the heart of our success. With trust and shared
								values, we drive growth and set new industry benchmarks.
							</Typography>
							<Paper elevation={1} sx={{ p: 4 }}>
								<Grid
									container
									spacing={4}
									justifyContent="center"
									alignItems="center"
								>
									{partners.map((partner, index) => (
										<PartnerLogo name={partner} key={index} />
									))}
								</Grid>
							</Paper>
						</Box>
					</Container>
				</Box>
			</ThemeProvider>
			<SubscribeBar />
			<Footer />
		</>
	);
};

export default AboutUs;
