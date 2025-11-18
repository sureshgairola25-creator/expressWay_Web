import React from "react";
import { Box, Typography, Select, MenuItem, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import the icon
import CircularProgress from "@mui/material/CircularProgress";

const DropModal = ({
	dropLocationData,
	dropCity,
	setDropCity,
	openDropModal,
	setOpenDropModal,
	dropLoader,
}) => {
	const handleClose = () => setOpenDropModal(false);

	const dropLocationChange = (e) => {
		setDropCity(e.target.value);
		setOpenDropModal(false);
	};

	const modalStyle = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: { xs: "90%", sm: 400 }, // Responsive width
		bgcolor: "background.paper",
		boxShadow: 24,
		p: 4,
		borderRadius: 2,
	};

	return (
		<Box>
			<Modal
				// Use the Drop Modal state variable
				open={openDropModal}
				onClose={handleClose} // This handles clicking the backdrop (outside the modal)
				aria-labelledby="drop-modal-title"
				aria-describedby="drop-modal-description"
			>
				<Box sx={modalStyle}>
					{/* Close Icon Button */}
					<IconButton
						aria-label="close"
						onClick={handleClose}
						sx={{
							position: "absolute",
							right: 8,
							top: 8,
							color: (theme) => theme.palette.grey[500],
						}}
					>
						<CloseIcon />
					</IconButton>
					{dropLoader ? (
						<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
							<CircularProgress />
						</Box>
					) : (
						<Box
							sx={{
								flex: { xs: "1 1 100%", md: "1 1 0" },
								minWidth: { xs: "100%", sm: 220, md: 160 },
							}}
						>
							{/* Updated Title */}
							<Typography
								variant="h6"
								component="h2"
								color="#222"
								fontWeight={500}
								id="drop-modal-title"
								gutterBottom
							>
								Drop Location
							</Typography>

							{/* The Select Box */}
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
									// Updated value and onChange
									value={dropCity}
									onChange={dropLocationChange}
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
									// Set MenuProps (retained from PickUpModal)
									MenuProps={
										{
											// Default MenuProps
										}
									}
								>
									<MenuItem value="" disabled>
										Select Drop City
									</MenuItem>
									{dropLocationData.map((city) => (
										<MenuItem
											key={city.id}
											value={city.id}
											// Highlight the selected item (using dropCity)
											sx={{
												// Conditional styling for the selected item
												...(city.id === dropCity && {
													bgcolor: "primary.light", // Use MUI theme color or a specific hex
													fontWeight: "bold",
												}),
												// Ensures the item is still readable on hover/focus
												"&:hover": {
													bgcolor: "action.hover",
												},
											}}
										>
											{city.name}
										</MenuItem>
									))}
								</Select>
							</Box>
						</Box>
					)}
				</Box>
			</Modal>
		</Box>
	);
};

export default DropModal;
