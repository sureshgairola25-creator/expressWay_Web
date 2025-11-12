import React from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import StarIcon from "@mui/icons-material/Star";

const steps = [
	{
		icon: <PhoneIcon sx={{ fontSize: 40, color: "#fff" }} />,
		number: "01",
		title: "Booking",
		desc: "Book Your Ride Through Our Easy-To-Use App Or Website, Providing Your Pickup And Drop-Off Details.",
	},
	// {
	// 	icon: <PersonIcon sx={{ fontSize: 40, color: '#fff' }} />,
	// 	number: '02',
	// 	title: 'Driver Assignment',
	// 	desc: 'A Nearby Driver Is Assigned To Your Ride, Ensuring Quick And Reliable Service At Your Location.',
	// },
	{
		icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#fff" }} />,
		number: "02",
		title: "Ride Confirmation",
		desc: "You Receive A Confirmation With Driver Details, So You Know Exactly Who Will Be Picking You Up.",
	},
	{
		icon: <LocationOnIcon sx={{ fontSize: 40, color: "#fff" }} />,
		number: "03",
		title: "Pickup",
		desc: "Your Driver Arrives At The Scheduled Time, Ready To Transport You To Your Destination Safely And Comfortably.",
	},
	{
		icon: <AltRouteIcon sx={{ fontSize: 40, color: "#fff" }} />,
		title: "Journey",
		number: "04",
		desc: "Enjoy a smooth ride with our professional driver, who ensures you reach your destination on time.",
	},
	{
		icon: <StarIcon sx={{ fontSize: 40, color: "#fff" }} />,
		number: "05",
		title: "Drop-Off & Feedback",
		desc: "After Arriving At Your Destination, You Can Rate Your Experience And Provide Feedback.",
	},
];

export default function BookingProcess() {
	return (
		<Box sx={{ py: 4, background: "#f5f5f7" }}>
			<Box sx={{ textAlign: "center", mb: 4 }}>
				{/* <Typography variant="h6" sx={{ color: "#7c3aed", fontWeight: 700 }}>
					<span role="img" aria-label="taxi">
						🚕
					</span>{" "}
					How We Work{" "}
					<span role="img" aria-label="taxi">
						🚕
					</span>
				</Typography> */}
				<Typography variant="h3" sx={{ fontWeight: 700, color: "#222", mt: 0 }}>
					<span style={{ fontSize: "80%" }}>Our</span> Booking Process
				</Typography>
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					gap: 3,
					overflowX: "auto",
					px: 2,
					pb: 1,
					scrollbarWidth: "none",
					"&::-webkit-scrollbar": { display: "none" },
				}}
			>
				{steps.map((step, idx) => (
					<Card
						key={step.number}
						sx={{
							minWidth: 320,
							maxWidth: 340,
							flex: "0 0 auto",
							borderRadius: 4,
							boxShadow: "0 6px 24px rgba(60, 30, 90, 0.12)",
							background: "linear-gradient(135deg, #fff 60%, #f3e8ff 100%)",
							color: "#222",
							minHeight: 290,
							display: "flex",
							flexDirection: "column",
							justifyContent: "flex-start",
							alignItems: "flex-start",
							position: "relative",
							overflow: "visible",
							mb: 1,
							mt: 2,
							border: "1px solid #e0e0e0",
							transition: "transform 0.2s, box-shadow 0.2s",
							"&:hover": {
								transform: "translateY(2px) scale(1.03)",
								boxShadow: "0 16px 40px rgba(124,58,237,0.18)",
								// borderColor: '#7c3aed',
							},
						}}
					>
						<CardContent sx={{ width: "100%", py: 3 }}>
							<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
								<Box
									sx={{
										bgcolor: "#7c3aed",
										borderRadius: 2,
										p: 1.5,
										mr: 2,
										boxShadow: "0 2px 8px rgba(124,58,237,0.10)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									{React.cloneElement(step.icon, {
										sx: { fontSize: 40, color: "#fff" },
									})}
								</Box>
								<Typography
									variant="h4"
									sx={{
										color: "#7c3aed",
										fontWeight: 700,
										textShadow: "0 2px 8px rgba(124,58,237,0.10)",
										letterSpacing: 1,
									}}
								>
									{step.number}
								</Typography>
							</Box>
							<Typography
								variant="h6"
								sx={{
									fontWeight: 700,
									mb: 1,
									color: "#222",
									letterSpacing: 0.5,
								}}
							>
								{step.title}
							</Typography>
							<Typography
								variant="body2"
								sx={{
									color: "#444",
									fontWeight: 400,
									lineHeight: 1.6,
									mr: 5,
								}}
							>
								{step.desc}
							</Typography>
						</CardContent>
						<Box
							sx={{
								position: "absolute",
								left: 0,
								bottom: 0,
								width: "100%",
								height: 7,
								bgcolor: "#7c3aed",
								opacity: 0.12,
								borderBottomLeftRadius: 20,
								borderBottomRightRadius: 20,
							}}
						/>
					</Card>
				))}
			</Box>
		</Box>
	);
}
