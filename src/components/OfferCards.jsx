import * as React from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
const offers = [
	{
		image: "https://www.shutterstock.com/image-vector/special-offer-banner-vector-template-260nw-2474802375.jpg",
	},
	{
		image: "https://www.shutterstock.com/image-vector/special-offer-banner-vector-template-260nw-2474802375.jpg",
	},
	{
		image: "https://www.shutterstock.com/image-vector/special-offer-banner-vector-template-260nw-2474802375.jpg",
	},
	{
		image: "https://www.shutterstock.com/image-vector/special-offer-banner-vector-template-260nw-2474802375.jpg",
	},
	{
		image: "https://www.shutterstock.com/image-vector/special-offer-banner-vector-template-260nw-2474802375.jpg",
	},
	{
		image: "https://www.shutterstock.com/image-vector/special-offer-banner-vector-template-260nw-2474802375.jpg",
	},
	{
		image: "https://www.shutterstock.com/image-vector/special-offer-banner-vector-template-260nw-2474802375.jpg",
	},
	{
		image: "https://www.shutterstock.com/image-vector/special-offer-banner-vector-template-260nw-2474802375.jpg",
	},
];
export default function ImageCard() {
	return (
		<Box sx={{ py: 1, background: "#f5f5f7" }}>
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
				<Typography variant="h3" sx={{ fontWeight: 700, color: "#222", mt: 1 }}>
					<span style={{ fontSize: "80%" }}>Offers</span> For You
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
				{offers.map((step, idx) => (
					<Card
						key={idx}
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
							{/* <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
							</Typography> */}
							{/* Container to style the image area */}
							<Box
								component="img" // Use the Box component as an <img> tag
								src={step.image}
								alt="Card Image Content"
								sx={{
									width: "100%", // Make the image span the full width of the CardContent
									height: 200, // Fixed height for the image
									objectFit: "cover", // Ensures the image covers the area without distortion
									borderRadius: 2, // Optional: maintains a rounded corner look
									boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Optional: a light shadow
								}}
							/>
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
