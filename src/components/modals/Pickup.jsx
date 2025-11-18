import { Box, Typography, Select, MenuItem, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import the icon
import CircularProgress from "@mui/material/CircularProgress";

const PickUpModal = ({
	pickupLocationData,
	pickupCity,
	pickupLocationChange,
	openPickupModal,
	setOpenPickupModal,
	pickupLoader,
}) => {
	const handleClose = () => setOpenPickupModal(false);

	// Style for the modal content Box (to center it)
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
	const handlePickupChange = (event) => {		
		pickupLocationChange(event);
		setOpenPickupModal(false);
	  };
	  
	return (
		<Box>
			<Modal
				open={openPickupModal}
				onClose={handleClose} // This handles clicking the backdrop (outside the modal)
				aria-labelledby="pick-up-modal-title"
				aria-describedby="pick-up-modal-description"
			>
				<Box sx={modalStyle}>
					{/* Close Icon Button (Added) */}
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
					{pickupLoader ? (
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
							<Typography
								variant="h6"
								component="h2"
								color="#222"
								fontWeight={500}
								id="pick-up-modal-title"
								gutterBottom
							>
								Pick Up Location
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
									value={pickupCity}
									onChange={handlePickupChange}
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
									// Set MenuProps to stop the select menu from immediately closing the modal
									MenuProps={
										{
											// Make sure the Menu is contained within the modal or uses the modal's z-index
											// You can add styles here if needed, but often default is fine.
										}
									}
								>
									<MenuItem value="" disabled>
										Select Pick Up
									</MenuItem>
									{pickupLocationData.map((location) => (
										<MenuItem
											key={location.id}
											value={location.id}
											// Highlight the selected item (Added Styling)
											sx={{
												// Conditional styling for the selected item
												...(location.id === pickupCity && {
													bgcolor: "primary.light", // Use MUI theme color or a specific hex
													fontWeight: "bold",
												}),
												// Ensures the item is still readable on hover/focus
												"&:hover": {
													bgcolor: "action.hover",
												},
											}}
										>
											{location.name}
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

export default PickUpModal;
