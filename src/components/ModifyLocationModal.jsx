import { Box, Paper, Typography, Button, Modal, Select, MenuItem } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const ModifyRideModal = ({
	open,
	onClose,
	fromCity,
	fromCityData,
	fromCityChange,
	pickupCity,
	pickupLocationData,
	pickupLocationChange,
	selectedCity,
	toCityData,
	tolocationChange,
	dropCity,
	setDropCity,
	dropLocationData,
	journeyDate,
	setJourneyDate,
	handleSearch,
}) => {

	return (
		<Modal open={open} onClose={onClose} closeAfterTransition>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: { xs: "90%", sm: 600, md: 950 },
					maxHeight: "90vh",
					overflowY: "auto",
					outline: "none",
				}}
			>
				<Paper
					sx={{
						p: 4,
						borderRadius: 3,
						boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: { xs: "column", md: "row" },
							gap: 2,
							flexWrap: "wrap",
						}}
					>
						{/* From */}
						<Box sx={{ flex: 1, minWidth: 140 }}>
							<Typography variant="subtitle1" fontWeight={500}>
								From
							</Typography>
							<Box
								sx={{
									bgcolor: "#f5f5f5",
									borderRadius: 2,
									px: 2,
									py: 1,
									mt: 1,
								}}
							>
								<Select
									variant="standard"
									value={fromCity || ""}
									onChange={fromCityChange}
									displayEmpty
									disableUnderline
									sx={{ flex: 1, bgcolor: "transparent", color: "#222" }}
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
								</Select>
							</Box>
						</Box>

						{/* Pick Up */}
						<Box sx={{ flex: 1, minWidth: 140 }}>
							<Typography variant="subtitle1" fontWeight={500}>
								Pick Up
							</Typography>
							<Box
								sx={{
									bgcolor: "#f5f5f5",
									borderRadius: 2,
									px: 2,
									py: 1,
									mt: 1,
								}}
							>
								<Select
									variant="standard"
									value={pickupCity || ""}
									onChange={pickupLocationChange}
									displayEmpty
									disableUnderline
									sx={{ flex: 1, bgcolor: "transparent", color: "#222" }}
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
						</Box>

						{/* To */}
						<Box sx={{ flex: 1, minWidth: 140 }}>
							<Typography variant="subtitle1" fontWeight={500}>
								To
							</Typography>
							<Box
								sx={{
									bgcolor: "#f5f5f5",
									borderRadius: 2,
									px: 2,
									py: 1,
									mt: 1,
								}}
							>
								<Select
									variant="standard"
									value={selectedCity || ""}
									onChange={tolocationChange}
									displayEmpty
									disableUnderline
									sx={{ flex: 1, bgcolor: "transparent", color: "#222" }}
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
						</Box>

						{/* Drop */}
						<Box sx={{ flex: 1, minWidth: 140 }}>
							<Typography variant="subtitle1" fontWeight={500}>
								Drop
							</Typography>
							<Box
								sx={{
									bgcolor: "#f5f5f5",
									borderRadius: 2,
									px: 2,
									py: 1,
									mt: 1,
								}}
							>
								<Select
									variant="standard"
									value={dropCity || ""}
									onChange={(e) => setDropCity(e.target.value)}
									displayEmpty
									disableUnderline
									sx={{ flex: 1, bgcolor: "transparent", color: "#222" }}
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
						</Box>

						{/* Journey Date */}
						<Box sx={{ flex: 1, minWidth: 170 }}>
							<Typography variant="subtitle1" fontWeight={500}>
								Journey Date
							</Typography>
							<Box
								sx={{
									bgcolor: "#f5f5f5",
									borderRadius: 2,
									px: 1,
									py: 1,
									mt: 1,
								}}
							>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										value={journeyDate ? dayjs(journeyDate) : null}
										onChange={(newValue) =>
											setJourneyDate(
												newValue ? newValue.format("YYYY-MM-DD") : ""
											)
										}
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
										}}
									/>
								</LocalizationProvider>
							</Box>
						</Box>
					</Box>

					{/* Search Button */}
					<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
						<Button
							variant="contained"
							onClick={handleSearch}
							sx={{
								backgroundColor: "#662D91",
								color: "#fff",
								fontWeight: 600,
								textTransform: "none",
								px: 6,
								py: 2,
								borderRadius: 2,
								fontSize: "16px",
								"&:hover": { backgroundColor: "#5a2484" },
								"&:active": { transform: "scale(0.98)" },
							}}
						>
							Search
						</Button>
					</Box>
				</Paper>
			</Box>
		</Modal>
	);
};

export default ModifyRideModal;
