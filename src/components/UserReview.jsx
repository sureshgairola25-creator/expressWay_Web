import React from "react";
import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";

const reviews = [
	{
		id: 1,
		name: "Emma Harris",
		role: "Frequent Traveler",
		text: "TaxiPro consistently provides reliable and efficient service. I use them for all my airport transfers and local travel. Their attention to detail and customer care are top-notch.",
		avatar: "",
		rating: 5,
	},
	,
	{
		id: 2,
		name: "Lucas Johnson",
		role: "Tourist",
		text: "My experience with TaxiPro was fantastic. The drivers were friendly, knowledgeable about the area, and made sure I reached my destination on time. Great service overall!",
		avatar: "",
		rating: 5,
	},
	{
		id: 3,
		name: "Lucas Johnson",
		role: "Tourist",
		text: "My experience with TaxiPro was fantastic. The drivers were friendly, knowledgeable about the area, and made sure I reached my destination on time. Great service overall!",
		avatar: "",
		rating: 5,
	},
	{
		id: 4,
		name: "Lucas Johnson",
		role: "Tourist",
		text: "My experience with TaxiPro was fantastic. The drivers were friendly, knowledgeable about the area, and made sure I reached my destination on time. Great service overall!",
		avatar: "",
		rating: 5,
	},
	{
		id: 5,
		name: "Lucas Johnson",
		role: "Tourist",
		text: "My experience with TaxiPro was fantastic. The drivers were friendly, knowledgeable about the area, and made sure I reached my destination on time. Great service overall!",
		avatar: "",
		rating: 5,
	},
	{
		id: 6,
		name: "Lucas Johnson",
		role: "Tourist",
		text: "My experience with TaxiPro was fantastic. The drivers were friendly, knowledgeable about the area, and made sure I reached my destination on time. Great service overall!",
		avatar: "",
		rating: 5,
	},
	{
		id: 7,
		name: "Lucas Johnson",
		role: "Tourist",
		text: "My experience with TaxiPro was fantastic. The drivers were friendly, knowledgeable about the area, and made sure I reached my destination on time. Great service overall!",
		avatar: "",
		rating: 5,
	},
];

export default function UserReview() {
	return (
		<Box
			sx={{
				py: 6,
				minHeight: 500,
			}}
		>
			<Box sx={{ textAlign: "center", mb: 4 }}>
				{/* <Typography variant="h6" sx={{ color: '#7c3aed', fontWeight: 700, letterSpacing: 1 }}>
          <span role="img" aria-label="taxi">🚕</span> What Our Customers Say <span role="img" aria-label="taxi">🚕</span>
        </Typography> */}
				<Typography variant="h3" sx={{ fontWeight: 700, color: "#222", mt: 1 }}>
					Customer Testimonials
				</Typography>
				<Typography variant="h6" sx={{ fontSize: 16, color: "#222", mt: 1 }}>
					Hear from our satisfied customers in their own words
				</Typography>
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					gap: 4,
					overflowX: "auto",
					px: 2,
					pb: 2,
					scrollbarWidth: "none",
					"&::-webkit-scrollbar": { display: "none" },
				}}
			>
				{reviews.map((review, idx) => (
					<Card
						key={review.id}
						sx={{
							minWidth: 340,
							maxWidth: 360,
							flex: "0 0 auto",
							borderRadius: 6,
							boxShadow: "0 8px 32px rgba(124,58,237,0.12)",
							border: "1px solid #ede9fe",
							background: "linear-gradient(135deg, #fff 70%, #f3e8ff 100%)",
							color: "#222",
							position: "relative",
							overflow: "visible",
							transition: "transform 0.2s, box-shadow 0.2s",
							mb: 1,
							mt: 2,
							"&:hover": {
								transform: "translateY(2px) scale(1.02)",
								boxShadow: "0 16px 40px rgba(124,58,237,0.18)",
								// borderColor: '#7c3aed',
							},
						}}
					>
						<CardContent sx={{ pt: 4 }}>
							<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
								<Avatar
									src={review.avatar}
									alt={review.name}
									sx={{
										width: 64,
										height: 64,
										border: "3px solid #7c3aed",
										boxShadow: 2,
										bgcolor: "#ede9fe",
										mr: 2,
									}}
								/>
								<FormatQuoteIcon
									sx={{ color: "#7c3aed", fontSize: 32, ml: "auto" }}
								/>
							</Box>
							<Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
								{review.name}
							</Typography>
							<Typography
								variant="subtitle1"
								sx={{ color: "#7c3aed", fontWeight: 600, mb: 2 }}
							>
								{review.role}
							</Typography>
							<Typography
								variant="body1"
								sx={{ fontStyle: "italic", mb: 2, color: "#444" }}
							>
								"{review.text}"
							</Typography>
							<Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
								{[...Array(review.rating)].map((_, i) => (
									<StarIcon
										key={i}
										sx={{ color: "#7c3aed", fontSize: 26, mr: 0.5 }}
									/>
								))}
							</Box>
						</CardContent>
					</Card>
				))}
			</Box>
		</Box>
	);
}
