import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function About() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: { xs: "column", md: "row" },
				alignItems: "center",
				justifyContent: "center",
				px: { xs: 2, md: 8 },
				py: { xs: 4, md: 8 },
				minHeight: 600,
				background: "#fff",
				gap: { xs: 4, md: 20 },
			}}
		>
			{/* Images Section */}
			<Box
				sx={{
					position: "relative",
					width: { xs: "100%", md: 520 },
					height: { xs: 320, md: 520 },
					flexShrink: 0,
				}}
			>
				<Box
					component="img"
					src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80"
					alt="Vrindavan"
					sx={{
						width: { xs: 220, md: 400 },
						height: { xs: 220, md: 350 },
						objectFit: "cover",
						borderRadius: 4,
						boxShadow: 3,
						position: "absolute",
						top: 0,
						left: { xs: "50%", md: 0 },
						transform: { xs: "translateX(-50%)", md: "none" },
						zIndex: 2,
					}}
				/>
				<Box
					component="img"
					src="https://images.unsplash.com/photo-1470341223622-1019832be824?auto=format&fit=crop&w=600&q=80"
					alt="Temple"
					sx={{
						width: { xs: 180, md: 400 },
						height: { xs: 180, md: 350 },
						objectFit: "cover",
						borderRadius: 4,
						boxShadow: 2,
						position: "absolute",
						top: { xs: 140, md: 220 },
						left: { xs: "50%", md: 100 },
						transform: { xs: "translateX(-50%)", md: "none" },
						zIndex: 1,
					}}
				/>
			</Box>
			{/* Content Section */}
			<Box sx={{ flex: 1, maxWidth: 850, lineHeight: 1 }}>
				<Typography variant="subtitle2" sx={{ color: "#888", mb: 1 }}>
					&mdash; Expressway Cab
				</Typography>

				<Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
					About <span style={{ color: "#7c3aed" }}>Us</span>
				</Typography>

				<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2,textAlign: "justify" }}>
					Expressway Cab is an ambitious and forward-thinking intercity mobility network
					designed to connect India’s major urban centres with clarity, precision, and
					reliability. We recognize that modern travel is not merely about reaching a
					destination; it is about trust, predictability, and comfort. Our flagship
					corridor — <b>Delhi to Dehradun</b> — reflects this vision. By linking two of
					North India’s most significant urban regions through a well-planned expressway
					route, we make long-distance travel smooth, structured, and dependable.
				</Typography>

				<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2,textAlign: "justify" }}>
					At the heart of our service lies a transparent <b>₹5/km pricing model</b>, with
					no tolls or hidden charges, and <b>100+ thoughtfully chosen pickup points</b>.
					This simple structure removes unnecessary complexity and places the traveler at
					the centre of the experience.
				</Typography>

				<Typography variant="h6" sx={{ fontWeight: 700, color: "#7c3aed", mb: 2 }}>
					Every Expressway Cab journey is strengthened by:
				</Typography>

				<Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
					<Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
						<CheckCircleIcon sx={{ color: "#7c3aed", mt: "3px" }} />
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							🚖 Verified commercial vehicles and trained professional drivers
						</Typography>
					</Box>

					<Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
						<CheckCircleIcon sx={{ color: "#7c3aed", mt: "3px" }} />
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							🛣️ Guaranteed seat with assured departure
						</Typography>
					</Box>

					<Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
						<CheckCircleIcon sx={{ color: "#7c3aed", mt: "3px" }} />
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							🌿 Clean halts and organized expressway lounges
						</Typography>
					</Box>

					<Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
						<CheckCircleIcon sx={{ color: "#7c3aed", mt: "3px" }} />
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							🛰️ Real-time GPS tracking for safety and precision
						</Typography>
					</Box>

					<Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
						<CheckCircleIcon sx={{ color: "#7c3aed", mt: "3px" }} />
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							📱 A seamless digital booking and confirmation process
						</Typography>
					</Box>
				</Box>

				<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2,textAlign: "justify" }}>
					Our broader mission is to create a connected urban ecosystem, where travel
					between cities is no longer a burden but a calm, efficient, and reliable
					movement. We are building the backbone of a modern expressway mobility network,
					one route at a time.
				</Typography>

				<Typography variant="h6" sx={{ fontWeight: 700, mt: 2 }}>
					This is not just travel.
				</Typography>

				<Typography variant="h6" sx={{ fontWeight: 700, color: "#7c3aed" }}>
					This is Expressway Cab — Connecting Urban India with Clarity and Confidence.
				</Typography>
			</Box>
		</Box>
	);
}
