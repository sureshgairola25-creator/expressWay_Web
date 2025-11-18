import { useEffect, useState, useRef } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Grid,
	Button,
	Chip,
	Collapse,
	Fade,
	Slider,
	Divider,
	FormGroup,
	FormControlLabel,
	Checkbox,
	Drawer,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getAvailableCabByDate, getAvailableCabByFilters } from "../apiServices/availableCab";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "./layout/Footer";
import SubscribeBar from "./SubscribeBar";
import Header from "./layout/Header";
import NoRideModal from "./Modal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
	getDropLocations,
	getFromLocations,
	getLocationsById,
	getPickUpLocations,
	getToLocations,
} from "../apiServices/locations";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ModernLoader from "./Loader";
import ModifyRideModal from "./ModifyLocationModal";
import { useSelector, useDispatch } from "react-redux";
import { setPaymentInfo } from "../slices/paymentInfo";
import MealOptions from "./MealOptions";
import CarTopView from "./layout/SeatLayout";

const AvailableCab = () => {
	const [selectedSeats, setSelectedSeats] = useState([]);
	const [openCabId, setOpenCabId] = useState(null);
	const [cabData, setCabData] = useState([]);
	const [filters, setFilters] = useState({
		carType: [],
		priceRange: [500, 2000],
		minSeats: 1,
		timeRange: "",
		duration: "",
		sortBy: "",
	});

	const [openModal, setOpenModal] = useState(false);
	const [journeyDate, setJourneyDate] = useState("");
	const [pickupCity, setPickupCity] = useState("");
	const [fromCity, setFromCity] = useState("");
	const [selectedCity, setSelectedCity] = useState("");
	const [dropCity, setDropCity] = useState("");

	const [fromCityData, setFromCityData] = useState([]);
	const [pickupLocationData, setPickupLocationData] = useState([]);
	const [toCityData, setToCityData] = useState([]);
	const [dropLocationData, setDropLocationData] = useState([]);
	const [openModalModify, setOpenModalModify] = useState(false);
	const [loading, setLoading] = useState(false);

	const [showFromLocation, setShowFromLocation] = useState("");
	const [showDestLocation, setShowDestLocation] = useState("");
	const [showPickUpLocation, setShowPickUpLocation] = useState("");
	const [showDropLocation, setShowDropLocation] = useState("");
	const [filterOpen, setFilterOpen] = useState(false);
	const [selectedMeal, setSelectedMeal] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();

	// const handleOpen = () => setOpenModal(true);
	const handleClose = () => {
		setOpenModal(false);
		// navigate("/");
	};

	const handleCloseModify = async () => {
		// getFromCitys();
		setOpenModalModify(true);
	};

	const [searchParams] = useSearchParams();
	// 🔹 Function to fetch data from API
	const fetchCabs = async () => {
		try {
			console.log("call every time when the filters change.");

			const toCity = searchParams.get("to");
			const date = searchParams.get("date");
			const dropCity = searchParams.get("drop");
			const pickup = searchParams.get("pickup");

			// setLoading(true);
			const response = await getAvailableCabByFilters(
				fromCity ? fromCity : searchParams.get("from"),
				selectedCity ? selectedCity : toCity,
				journeyDate ? journeyDate : date,
				pickupCity ? pickupCity : pickup,
				dropCity ? dropCity : dropCity,
				filters
			);

			if (response?.data) setCabData(response.data);
			if (response?.data.length == 0) setOpenModal(true);
		} catch (error) {
			console.error("Error fetching cabs:", error);
		}
	};

	useEffect(() => {
		async function fetchCabData() {
			try {
				const formCity = searchParams.get("from");
				const toCity = searchParams.get("to");
				const date = searchParams.get("date");
				const dropCity = searchParams.get("drop");
				const pickup = searchParams.get("pickup");

				setLoading(true);

				const response = await getAvailableCabByDate(
					formCity,
					toCity,
					date,
					pickup,
					dropCity
				);

				if (response?.data) setCabData(response.data);
				if (response?.data.length == 0) setOpenModal(true);

				const showres = await getLocationsById(formCity, pickup, toCity, dropCity);
				setShowFromLocation(showres.data.startLocation.name);
				setShowDestLocation(showres.data.endLocation.name);
				setShowPickUpLocation(showres.data.pickupPoint.name);
				setShowDropLocation(showres.data.dropPoint.name);

				const fromCityapiData = await getFromLocations();
				setFromCityData(fromCityapiData.data);
				const pickupLocationApiData = await getPickUpLocations(formCity);
				setPickupLocationData(pickupLocationApiData.data);
				const toCityApiData = await getToLocations(formCity);
				setToCityData(toCityApiData.data);
				const dropLocationApiData = await getDropLocations(toCity);
				setDropLocationData(dropLocationApiData.data);

				setLoading(false);
			} catch (error) {
				console.error("Error fetching cab data:", error);
			}
		}

		fetchCabData();
	}, []);

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false; // skip first run
			return;
		}
		fetchCabs();
	}, [filters]);

	// ✅ Seat Selection
	const handleSeatClick = (cabId, seatNumber) => {
		setSelectedSeats((prev) => {
			const current = prev[cabId] || [];
			console.log(current, seatNumber,"seatNumber");
			
			const updated = current.includes(seatNumber)
				? current.filter((s) => s !== seatNumber)
				: [...current, seatNumber];
			return { ...prev, [cabId]: updated };
		});
	};

	// ✅ Total Fare Calculation
	const calculateTotalFare = (cab) => {
		const selected = selectedSeats[cab.id] || [];
		let total = 0;
		cab.seatsInfo.forEach((seat) => {
			if (selected.includes(seat.seat_number)) {
				total += seat.price;
			}
		});
		return total;
	};

	// 🔹 Handle meal selection
	const handleMealClick = (meal) => {
	if (Array.isArray(selectedSeats) && selectedSeats.length === 0) {
		toast.error("Please select at least one seat!");
		return;
	}

	// Toggle selection logic using meal object
	if (selectedMeal && selectedMeal.type === meal.type) {
		setSelectedMeal(null); // Unselect if same meal clicked
	} else {
		setSelectedMeal(meal); // Select full meal object
	}
	};

	// ✅ Checkout
	const handleCheckout = (cab) => {
		console.log("cab =======>", cab);
		const selected = selectedSeats[cab.id] || [];
		if (selected.length === 0) {
			toast.error("Please select at least one seat to proceed.")
			return;
		}
		const totalFare = calculateTotalFare(cab) + (selectedMeal?.price?selectedMeal?.price:0);

		const paymentInfo = {
			userId: 4,
			tripId: cab.id,
			Car: cab.carInfo.carName,
			Seats: selected,
			total: totalFare,
			fromCity: cab?.startLocation,
			toCity: cab?.endLocation,
			pickup: cab?.pickupPoint,
			drop: cab?.dropPoint,
			cabStartTime: cab?.startTime,
			cabDropTime: cab?.endTime,
			selectedMeal:selectedMeal
		};
		const token = localStorage.getItem("authToken");
		dispatch(setPaymentInfo(paymentInfo));
		if (token){
			navigate(`/payment/preview`);
		}else{
			toast.error("Please Login first then checkout.")
			navigate('/login')
		}
	};

	const setModifyData = async (fromCity, selectedCity, journeyDate, pickupCity, dropCity) => {
		try {
			setLoading(true);
			const response = await getAvailableCabByDate(
				fromCity,
				selectedCity,
				journeyDate,
				pickupCity,
				dropCity
			);

			if (response?.data) setCabData(response.data);
			if (response?.data.length == 0) setOpenModal(true);
			const showres = await getLocationsById(fromCity, pickupCity, selectedCity, dropCity);
			setShowFromLocation(showres.data.startLocation.name);
			setShowDestLocation(showres.data.endLocation.name);
			setShowPickUpLocation(showres.data.pickupPoint.name);
			setShowDropLocation(showres.data.dropPoint.name);
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSearch = () => {
		// You can add validation here if needed
		const toCity = searchParams.get("to");
		const date = searchParams.get("date");
		const dropCity = searchParams.get("drop");
		const pickup = searchParams.get("pickup");
		if (
			(fromCity || searchParams.get("from")) &&
			(selectedCity || toCity) &&
			(pickupCity || pickup) &&
			(dropCity || searchParams.get("drop")) &&
			(journeyDate || date)
		) {
			setModifyData(
				fromCity ? fromCity : searchParams.get("from"),
				selectedCity ? selectedCity : toCity,
				journeyDate ? journeyDate : date,
				pickupCity ? pickupCity : pickup,
				dropCity ? dropCity : searchParams.get("drop")
			);
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
		setOpenModalModify(false);
	};

	async function getFromCitys() {
		const fromCityapiData = await getFromLocations();
		setFromCityData(fromCityapiData.data);
	}

	const fromCityChange = async (e) => {
		setFromCity(e.target.value);
		const pickupLocationApiData = await getPickUpLocations(e.target.value);
		setPickupLocationData(pickupLocationApiData.data);
	};

	const pickupLocationChange = async (e) => {
		setPickupCity(e.target.value);
		const toCityApiData = await getToLocations(fromCity);
		setToCityData(toCityApiData.data);
	};

	const tolocationChange = async (e) => {
		setSelectedCity(e.target.value);
		const dropLocationApiData = await getDropLocations(e.target.value);
		setDropLocationData(dropLocationApiData.data);
	};

	const hadleCloseModify = () => setOpenModalModify(!openModalModify);

	const filterContent = (
		<Box sx={{ width: 300, p: 2 }}>
			<Card sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
					<Typography variant="subtitle1" fontWeight="bold">
						🔽 Filter Results
					</Typography>
					<Button
						size="small"
						color="primary"
						onClick={() =>
							setFilters({
								carType: [],
								priceRange: [500, 2000],
								minSeats: 1,
								timeRange: "",
								duration: "",
								sortBy: "",
							})
						}
					>
						Reset All
					</Button>
				</Box>

				<Divider sx={{ my: 2 }} />

				{/* Price Range */}
				<Typography variant="body2" fontWeight="bold">
					Price Range
				</Typography>
				<Slider
					value={filters.priceRange}
					onChange={(e, newValue) =>
						setFilters((prev) => ({ ...prev, priceRange: newValue }))
					}
					min={0}
					max={10000}
					step={100}
					valueLabelDisplay="auto"
					sx={{ mt: 1 }}
				/>
				<Box display="flex" justifyContent="space-between">
					<Typography variant="caption">₹{filters.priceRange[0]}</Typography>
					<Typography variant="caption">₹{filters.priceRange[1]}</Typography>
				</Box>

				<Divider sx={{ my: 2 }} />

				{/* Seat Availability */}
				<Typography variant="body2" fontWeight="bold">
					Seat Availability
				</Typography>
				<Slider
					value={filters.minSeats}
					onChange={(e, newValue) =>
						setFilters((prev) => ({ ...prev, minSeats: newValue }))
					}
					min={1}
					max={7}
					step={1}
					valueLabelDisplay="auto"
				/>
				<Typography variant="caption">Minimum Seats: {filters.minSeats}</Typography>

				<Divider sx={{ my: 2 }} />

				{/* Time Range */}
				<Typography variant="body2" fontWeight="bold">
					Departure Time
				</Typography>
				<Grid container spacing={1} mt={1}>
					{["Morning", "Afternoon", "Evening", "Night"].map((time) => (
						<Grid item xs={6} key={time}>
							<Button
								fullWidth
								variant={
									filters.timeRange === time.toLowerCase()
										? "contained"
										: "outlined"
								}
								size="small"
								sx={{ borderRadius: 2, textTransform: "none" }}
								onClick={() =>
									setFilters((prev) => ({
										...prev,
										timeRange:
											prev.timeRange === time.toLowerCase()
												? ""
												: time.toLowerCase(),
									}))
								}
							>
								{time}
							</Button>
						</Grid>
					))}
				</Grid>

				<Divider sx={{ my: 2 }} />

				{/* Sort Option */}
				<Typography variant="body2" fontWeight="bold">
					Sort Option
				</Typography>
				<FormGroup>
					{[
						{ label: "Price: Low to High", value: "priceLowHigh" },
						{ label: "Price: High to Low", value: "priceHighLow" },
					].map((sort) => (
						<FormControlLabel
							key={sort.value}
							control={
								<Checkbox
									checked={filters.sortBy === sort.value}
									onChange={(e) =>
										setFilters((prev) => ({
											...prev,
											sortBy: e.target.checked ? sort.value : "",
										}))
									}
								/>
							}
							label={sort.label}
						/>
					))}
				</FormGroup>
			</Card>
		</Box>
	);

	return (
		<>
			{loading ? <ModernLoader text="Fetching your rides..." /> : null}
			<Header />
			<Box
				sx={{
					p: { xs: 2, md: 4 },
					px: { md: 30 },
					bgcolor: "#f4f6f8",
					fontFamily: "Inter, sans-serif",
				}}
			>
				<Grid container spacing={3} sx={{display:"flex", justifyContent:{sm:"center",xs:"center"}}}>
					{/* ===== Left Sidebar Filters ===== */}
					<Grid item xs={12} md={3} width={"25%"}>
						<Card
							sx={{
								p: 2,
								borderRadius: 2,
								boxShadow: 2,
								display: { xs: "none", sm: "none", md: "block" },
							}}
						>
							<Box
								display="flex"
								justifyContent="space-between"
								alignItems="center"
								mb={1}
							>
								<Typography variant="subtitle1" fontWeight="bold">
									🔽 Filter Results
								</Typography>
								<Button
									size="small"
									color="primary"
									onClick={() =>
										setFilters({
											carType: [],
											priceRange: [500, 2000],
											minSeats: 1,
											timeRange: "",
											duration: "",
											sortBy: "",
										})
									}
								>
									Reset All
								</Button>
							</Box>

							{/* Car Type */}
							{/* <Typography variant="body2" fontWeight="bold" mt={1}>
								Car Type
							</Typography>
							<FormGroup>
								{["Sedan", "SUV", "Hatchback"].map((type) => (
									<FormControlLabel
										key={type}
										control={
											<Checkbox
												checked={filters.carType.includes(type)}
												onChange={(e) => {
													const checked = e.target.checked;
													setFilters((prev) => ({
														...prev,
														carType: checked
															? [...prev.carType, type]
															: prev.carType.filter(
																	(t) => t !== type
															  ),
													}));
												}}
											/>
										}
										label={type}
									/>
								))}
							</FormGroup> */}

							<Divider sx={{ my: 2 }} />

							{/* Price Range */}
							<Typography variant="body2" fontWeight="bold">
								Price Range
							</Typography>
							<Slider
								value={filters.priceRange}
								onChange={(e, newValue) =>
									setFilters((prev) => ({ ...prev, priceRange: newValue }))
								}
								min={0}
								max={10000}
								step={100}
								valueLabelDisplay="auto"
								sx={{ mt: 1 }}
							/>
							<Box display="flex" justifyContent="space-between">
								<Typography variant="caption">₹{filters.priceRange[0]}</Typography>
								<Typography variant="caption">₹{filters.priceRange[1]}</Typography>
							</Box>

							<Divider sx={{ my: 2 }} />

							{/* Seat Availability */}
							<Typography variant="body2" fontWeight="bold">
								Seat Availability
							</Typography>
							<Slider
								value={filters.minSeats}
								onChange={(e, newValue) =>
									setFilters((prev) => ({ ...prev, minSeats: newValue }))
								}
								min={1}
								max={7}
								step={1}
								valueLabelDisplay="auto"
							/>
							<Typography variant="caption">
								Minimum Seats: {filters.minSeats}
							</Typography>

							<Divider sx={{ my: 2 }} />

							{/* Departure Time */}
							<Typography variant="body2" fontWeight="bold">
								Departure Time
							</Typography>
							<Grid container spacing={1} mt={1}>
								{["Morning", "Afternoon", "Evening", "Night"].map((time) => (
									<Grid item xs={6} key={time}>
										<Button
											fullWidth
											variant={
												filters.timeRange === time.toLowerCase()
													? "contained"
													: "outlined"
											}
											size="small"
											sx={{
												borderRadius: 2,
												textTransform: "none",
												justifyContent: "center",
											}}
											onClick={() =>
												setFilters((prev) => ({
													...prev,
													timeRange:
														prev.timeRange === time.toLowerCase()
															? ""
															: time.toLowerCase(),
												}))
											}
										>
											{time}
										</Button>
									</Grid>
								))}
							</Grid>

							<Divider sx={{ my: 2 }} />

							{/* Trip Duration */}
							{/* <Typography variant="body2" fontWeight="bold">
								Trip Duration
							</Typography>
							<FormGroup>
								{["Short", "Medium", "Long"].map((duration) => (
									<FormControlLabel
										key={duration}
										control={
											<Checkbox
												checked={
													filters.duration === duration.toLowerCase()
												}
												onChange={(e) =>
													setFilters((prev) => ({
														...prev,
														duration: e.target.checked
															? duration.toLowerCase()
															: "",
													}))
												}
											/>
										}
										label={duration}
									/>
								))}
							</FormGroup> */}

							<Divider sx={{ my: 2 }} />

							{/* Sort Option */}
							<Typography variant="body2" fontWeight="bold">
								Sort Option
							</Typography>
							<FormGroup>
								{[
									{ label: "Price: Low to High", value: "priceLowHigh" },
									{ label: "Price: High to Low", value: "priceHighLow" },
								].map((sort) => (
									<FormControlLabel
										key={sort.value}
										control={
											<Checkbox
												checked={filters.sortBy === sort.value}
												onChange={(e) =>
													setFilters((prev) => ({
														...prev,
														sortBy: e.target.checked ? sort.value : "",
													}))
												}
											/>
										}
										label={sort.label}
									/>
								))}
							</FormGroup>
						</Card>
					</Grid>

					{/* ===== Right Side: Cab Cards ===== */}
					<Grid
						item
						xs={12}
						md={9}
						width={"72%"}
						sx={{
							maxHeight: "70vh",
							overflow: "auto",
							"&::-webkit-scrollbar": {
								display: "none",
							},
							msOverflowStyle: "none",
							scrollbarWidth: "none"
						}}
					>
						<Box
							display="flex"
							flexDirection={{ xs: "column", sm: "row" }}
							justifyContent="space-between"
							alignItems="center"
							mb={4}
							sx={{
								background: "#fff",
								p: 3,
								borderRadius: 3,
								boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
							}}
						>
							{/* Ride Details */}
							<Box
								display="flex"
								flexDirection={{ xs: "column", sm: "row" }}
								gap={{ xs: 1.5, sm: 4 }}
								alignItems={{ xs: "flex-start", sm: "center" }}
								flexWrap="wrap"
							>
								{/* From & To */}
								<Box display="flex" alignItems="center" gap={1}>
									<LocationOnIcon color="primary" />
									<Typography variant="body1" fontWeight={500}>
										{showFromLocation} <ArrowForwardIcon sx={{ mx: 0.5 }} />{" "}
										{showDestLocation}
									</Typography>
								</Box>

								{/* Pickup & Drop */}
								<Box display="flex" alignItems="center" gap={1}>
									<LocationOnIcon color="secondary" />
									<Typography variant="body1" fontWeight={500}>
										Pickup: {showPickUpLocation} | Drop: {showDropLocation}
									</Typography>
								</Box>

								{/* Journey Date */}
								<Box display="flex" alignItems="center" gap={1}>
									<CalendarTodayIcon color="action" />
									<Typography variant="body1" fontWeight={500}>
										{journeyDate ? journeyDate : searchParams.get("date")}
									</Typography>
								</Box>
							</Box>

							<Box sx={{ display: "flex" }}>
								{/* Modify Button */}
								<Box mt={{ xs: 2, sm: 0 }}>
									<Button
										variant="contained"
										onClick={handleCloseModify}
										sx={{
											backgroundColor: "#662D91",
											color: "#fff",
											fontWeight: 600,
											textTransform: "none",
											px: 4,
											py: 1.5,
											borderRadius: 2,
											"&:hover": { backgroundColor: "#5a2484" },
										}}
									>
										Modify
									</Button>
								</Box>
								{/* ===== Filter Button (Mobile) ===== */}
								<Box
									display={{ xs: "flex", md: "none" }}
									justifyContent="flex-end"
									// mb={2}
									mt={1.9}
									px={2}
								>
									<Button
										variant="contained"
										sx={{
											backgroundColor: "#662D91",
											color: "#fff",
											fontWeight: 600,
											textTransform: "none",
											px: 4.5,
											py: 1.5,
											borderRadius: 2,
											"&:hover": { backgroundColor: "#5a2484" },
										}}
										onClick={() => setFilterOpen(true)}
									>
										Filter
									</Button>
								</Box>
							</Box>
						</Box>

						{/* Existing Cab Data */}
						{cabData.length === 0 && (
							<NoRideModal
								open={openModal}
								handleClose={handleClose}
								location={searchParams.get("from")}
								time={searchParams.get("date")}
							/>
						)}
						{cabData.length !== 0 &&
							cabData.map((cab) => {
								const isOpen = openCabId === cab.id;
								const selected = selectedSeats[cab.id] || [];
								const totalFare = calculateTotalFare(cab) + (selectedMeal?.price?selectedMeal?.price:0)

								return (
									<Card
										key={cab.id}
										sx={{
											borderRadius: 3,
											boxShadow: 3,
											overflow: "hidden",
											mb: 4,
											transition: "transform 0.2s ease",
											"&:hover": { transform: "translateY(-4px)" },
										}}
									>
										<CardContent>
											<Grid
												container
												spacing={4}
												alignItems="center"
												justifyContent="space-between"
											>
												{/* Car Info */}
												<Grid item xs={12} md={8}>
													<Typography variant="h6" fontWeight="bold">
														{cab.carInfo?.name || 'N/A'} ({cab.carInfo?.type || 'N/A'})
													</Typography>
													<Typography
														variant="body2"
														color="text.secondary"
													>
														Reg No: {cab.carInfo?.carUniqueNumber || 'N/A'}
													</Typography>

													<Box mt={2}>
														<Typography
															variant="body2"
															sx={{ mb: 0.5 }}
														>
															<LocationOnIcon
																sx={{
																	verticalAlign: "middle",
																	mr: 1,
																}}
																color="success"
															/>
															{typeof cab.startLocation === 'object' ? cab.startLocation?.name : cab.startLocation || 'N/A'} → {typeof cab.endLocation === 'object' ? cab.endLocation?.name : cab.endLocation || 'N/A'}
														</Typography>
														<Typography
															variant="body2"
															sx={{ mb: 0.5 }}
														>
															Pickup: {typeof cab.pickupPoint === 'object' ? cab.pickupPoint?.name : cab.pickupPoint.name || 'N/A'} | Drop:{" "}
															{typeof cab.dropPoint === 'object' ? cab.dropPoint?.name : cab.dropPoint.name || 'N/A'}
														</Typography>
														<Typography
															variant="body2"
															sx={{
																fontWeight: "bold",
															}}
														>
															<AccessTimeIcon
																sx={{
																	verticalAlign: "middle",
																	mr: 1,
																}}
																color="action"
															/>
															{new Date(
																cab.startTime
															).toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															})}{" "}
															-{" "}
															{new Date(
																cab.endTime
															).toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															})}{" "}
															({cab.duration})
														</Typography>
													</Box>
												</Grid>

												{/* Seat Summary */}
												<Grid item xs={12} md={4} textAlign="center">
													<Chip
														label={cab.carInfo?.type || 'Standard'}
														color="warning"
														sx={{
															mb: 1,
															fontWeight: "bold",
															fontSize: 13,
														}}
													/>
													<Typography
														variant="subtitle1"
														color="success.main"
														fontWeight="bold"
													>
														{cab.availableSeats}/
														{cab.carInfo.totalSeats} Seats Left
													</Typography>
													<Box mt={2}>
														<Button
															variant="contained"
															color={isOpen ? "error" : "primary"}
															size="small"
															onClick={() =>
																setOpenCabId(isOpen ? null : cab.id)
															}
															sx={{
																borderRadius: 2,
																textTransform: "none",
																px: 3,
																py: 1,
																fontWeight: 600,
															}}
														>
															{isOpen ? "Close Seats" : "View Seats"}
														</Button>
													</Box>
												</Grid>
											</Grid>
										</CardContent>

										{/* Seat Layout */}
										<Collapse in={isOpen} timeout={400}>
											<Fade in={isOpen}>
												<Box
													sx={{
														bgcolor: "#fafafa",
														borderTop: "1px solid #eee",
														p: 3,
														transition: "0.3s ease",
													}}
												>
													<Grid
														container
														spacing={3}
														justifyContent="space-between"
													>
														{/* Seat Selection */}
														<Grid item xs={12} md={7}>
															<Box
																display="flex"
																flexDirection="column"
																alignItems="center"
															>
																<DirectionsCarIcon
																	sx={{
																		fontSize: 44,
																		mb: 2,
																		color: "#5f6368",
																	}}
																/>
																<Grid
																	container
																	spacing={2}
																	justifyContent="center"
																>
																	{cab.seatsInfo.map((seat) => {
																		const isSelected =
																			selected.includes(
																				seat.seat_number
																			);
																			return (
																				<Grid item key={seat.seat_number}>
																					<Button
																						variant={isSelected ? "contained" : "outlined"}
																						color={
																							seat.isBooked
																								? "error"
																								: seat.seat_type === "window"
																								? "success"
																								: "warning"
																						}
																						disabled={seat.isBooked}
																						onClick={() => handleSeatClick(cab.id, seat.seat_number)}
																						sx={{
																							width: 70,
																							height: 60,
																							borderRadius: 2,
																							fontWeight: "bold",
																							transition: "0.2s",
																							display: "flex",
																							flexDirection: "column",
																							justifyContent: "center",
																							alignItems: "center",
																							"&:hover": {
																								transform: "scale(1.05)",
																							},
																						}}
																					>
																						{/* Bigger Seat Number */}
																						<Typography
																							sx={{ fontSize: 20, fontWeight: "bold", lineHeight: 1 }}
																						>
																							{seat.seat_number}
																						</Typography>
																			
																						{/* Price BELOW seat number */}
																						<Typography
																							variant="caption"
																							display="block"
																							sx={{ fontSize: 13, marginTop: 0.3 }}
																						>
																							₹{seat.price}
																						</Typography>
																					</Button>
																				</Grid>
																			);
																			
																		// return (
																		// 	<Grid
																		// 		item
																		// 		key={
																		// 			seat.seat_number
																		// 		}
																		// 	>
																		// 		<Button
																		// 			variant={
																		// 				isSelected
																		// 					? "contained"
																		// 					: "outlined"
																		// 			}
																		// 			color={
																		// 				seat.isBooked
																		// 					? "error"
																		// 					: seat.seat_type ===
																		// 					  "window"
																		// 					? "success"
																		// 					: "warning"
																		// 			}
																		// 			disabled={
																		// 				seat.isBooked
																		// 			}
																		// 			onClick={() =>
																		// 				handleSeatClick(
																		// 					cab.id,
																		// 					seat.seat_number
																		// 				)
																		// 			}
																		// 			sx={{
																		// 				width: 70,
																		// 				height: 50,
																		// 				borderRadius: 2,
																		// 				fontWeight:
																		// 					"bold",
																		// 				fontSize: 17,
																		// 				transition:
																		// 					"0.2s",
																		// 				"&:hover": {
																		// 					transform:
																		// 						"scale(1.05)",
																		// 				},
																		// 			}}
																		// 		>
																		// 			{
																		// 				seat.seat_number
																		// 			}
																		// 			<Typography
																		// 				variant="caption"
																		// 				display="block"
																		// 				sx={{
																		// 					fontSize: 15,
																		// 				}}
																		// 			>
																		// 				₹
																		// 				{seat.price}
																		// 			</Typography>
																		// 		</Button>
																		// 	</Grid>
																		// );
																	})}
																</Grid>
															</Box>
														</Grid>
														{/* <CarTopView /> */}
														
														<MealOptions 
															meals={cab.meals}
															selectedMeal={selectedMeal}
															setSelectedMeal={setSelectedMeal}
															selectedSeats={selectedSeats}
															handleMealClick={handleMealClick}
														/>
														{/* Fare Summary + Checkout */}
														<Grid
															item
															xs={12}
															md={5}
															display="flex"
															flexDirection="column"
															justifyContent="center"
															alignItems="center"
														>
															<Typography
																variant="subtitle1"
																fontWeight="bold"
															>
																Seats Selected:{" "}
																<Typography
																	component="span"
																	color="primary"
																	fontWeight="bold"
																>
																	{selected.length || 0}
																</Typography>
															</Typography>

															<Typography
																variant="subtitle1"
																fontWeight="bold"
																mt={1}
															>
																Total Fare : {" "}
																<Typography
																	component="span"
																	color="primary"
																	fontWeight="bold"
																>
																	₹{totalFare.toFixed(2)}
																</Typography>
															</Typography>

															<Button
																variant="contained"
																color="success"
																disabled={selected.length === 0}
																onClick={() => handleCheckout(cab)}
																sx={{
																	mt: 2,
																	px: 4,
																	py: 1,
																	borderRadius: 2,
																	fontWeight: 600,
																}}
															>
																Checkout
															</Button>
														</Grid>
													</Grid>
												</Box>
											</Fade>
										</Collapse>
									</Card>
								);
							})}
					</Grid>
				</Grid>
				<Box>
					<Grid container spacing={3}>
						{/* Cab Cards */}
						<Grid item xs={12} md={9}>
							{/* Your cab cards grid goes here */}
						</Grid>
					</Grid>

					{/* Drawer for Mobile */}
					<Drawer
						anchor="right"
						open={filterOpen}
						onClose={() => setFilterOpen(false)}
						ModalProps={{ keepMounted: true }}
					>
						{filterContent}
					</Drawer>
				</Box>
				{openModalModify && (
					<ModifyRideModal
						open={openModalModify}
						onClose={hadleCloseModify}
						fromCity={fromCity ? fromCity : searchParams.get("from")}
						fromCityData={fromCityData}
						fromCityChange={fromCityChange}
						pickupCity={pickupCity ? pickupCity : searchParams.get("pickup")}
						pickupLocationData={pickupLocationData}
						pickupLocationChange={pickupLocationChange}
						selectedCity={selectedCity ? selectedCity : searchParams.get("to")}
						toCityData={toCityData}
						tolocationChange={tolocationChange}
						dropCity={dropCity ? dropCity : searchParams.get("drop")}
						setDropCity={setDropCity}
						dropLocationData={dropLocationData}
						journeyDate={journeyDate ? journeyDate : searchParams.get("date")}
						setJourneyDate={setJourneyDate}
						handleSearch={handleSearch}
					/>
				)}
			</Box>
			<SubscribeBar />
			<Footer />
		</>
	);
};

export default AvailableCab;
