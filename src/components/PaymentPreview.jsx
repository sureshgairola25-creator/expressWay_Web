import React, { useEffect, useState } from "react";
import {
	Container,
	Typography,
	Box,
	TextField,
	Button,
	Grid,
	Divider,
	Paper,
	Link,
	ThemeProvider,
	createTheme,
	useTheme,
} from "@mui/material";
import { Place, Event, CheckCircle, CreditCard } from "@mui/icons-material";
import BgImage from "../assets/background.jpg";
import { initiateCheckout } from "../apiServices/payment";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getLocationsById } from "../apiServices/locations";
import { useNavigate } from "react-router-dom";

// --- Theme Definition (Consistent Purple Theme) ---
const purpleTheme = createTheme({
	palette: {
		primary: {
			main: "#673ab7", // Deep Purple
		},
		// Adding a lighter shade for text fields and background contrast
		background: {
			default: "#f8f8fa",
			paper: "#fff",
		},
		customInput: {
			// A clean, light-colored background for modern inputs
			main: "#f0f4f7",
		},
	},
	components: {
		// ... (Button and Paper overrides remain the same)
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
					borderRadius: 12,

					"& .MuiFilledInput-root": {
						borderRadius: 12,
						paddingTop: "0px", // more top padding for label space
						paddingBottom: "5px",
						backgroundColor: theme.palette.customInput.main,
						border: "1px solid transparent",
						transition: "all 0.2s ease-in-out",

						"&:hover": {
							backgroundColor: theme.palette.customInput.main,
						},
						"&.Mui-focused": {
							backgroundColor: theme.palette.customInput.main,
							border: `1px solid ${theme.palette.primary.main}`,
						},

						// Remove the default underline styles
						"&:before, &:after": {
							display: "none",
						},
					},

					// ✅ Proper label position fix
					"& .MuiInputLabel-root": {
						transform: "translate(14px, 18px) scale(1)",
						color: theme.palette.text.secondary,
						transition: "all 0.2s ease-in-out",

						"&.Mui-focused": {
							color: theme.palette.primary.main,
						},
						"&.MuiFormLabel-filled, &.MuiInputLabel-shrink": {
							transform: "translate(14px, -6px) scale(0.8)", // lifted properly above border
							backgroundColor: theme.palette.customInput.main, // keeps the label readable
							padding: "0 4px", // avoids overlapping the border
							borderRadius: 4,
						},
					},
				}),
			},
		},

		// Ensure Paper has some transparency to let the background image subtly show through
		MuiPaper: {
			styleOverrides: {
				root: {
					// Subtle shadow for lift
					boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
					backgroundColor: "rgba(255, 255, 255, 0.95)", // 95% opacity for a slightly modern, frosted look
				},
			},
		},
	},
});

// --- Default Data Structure for Props ---
const defaultTicketData = {
	productName: "Premium & A/C",
	quantity: 1,
	basePrice: 799.0,
	boarding: "Noida (October 21, 2025 | 5:30 am)",
	dropping: "Haridwar (Jwalapur, October 21, 2025 | 9:30 am)",
	pickupPoint: "JMT Noida Sector 62 Metro | Priority, Pickup Time 7:00 am",
	seatType: "Adult",
	seatNo: "B1",
	couponCode: "HAPPYFORMULA22",
	couponDiscount: 0,
	taxIncludedTotal: 677.0,
};

// --- Main Component ---
const PaymentPreview = ({ ticketData = defaultTicketData }) => {
	const navigate = useNavigate();
	const paymentInfo = useSelector((state) => state.paymentInfo.paymentInfo);
	console.log("paymentInfo =>", paymentInfo);
	
	const userProfileData = useSelector((state) => state.userInfo.userInfo);
	console.log("userProfileData =>", userProfileData);
	const [couponInput, setCouponInput] = useState("");
	const [discountAmount, setDiscountAmount] = useState(null);

	const [passengerDetails, setPassengerDetails] = useState({
		name: userProfileData?.firstName ? userProfileData?.firstName : "",
		age: userProfileData?.ageRange ? userProfileData?.ageRange : "",
		phone: userProfileData?.phoneNo ? userProfileData?.phoneNo : "",
		email: userProfileData?.email ? userProfileData?.email : "",
		additional: "",
	});
	const theme = useTheme();
	const [discountPrice, setDiscountPrice] = useState(0);

	// Calculations
	const fare = Number(paymentInfo?.total || 0);
	// const meal = Number(paymentInfo?.selectedMeal?.price || 0);
	const actualSubtotal = fare; // fare + meal
	
	// Discount state (you already have discountAmount state)
	const appliedDiscount = Number(discountAmount || 0);
	
	// Total after subtracting discount (but before any gateway/ tax adjustments)
	const totalAfterDiscount = actualSubtotal - appliedDiscount;
	
	// finalTotal comes from backend (discountPrice) when applied, otherwise use totalAfterDiscount
	const finalTotal = Number(discountPrice && discountPrice > 0 ? discountPrice : totalAfterDiscount);


	// Since there's only one payment method, we hardcode it and remove the state/handler
	const paymentMethod = "cashfree";
	const cashfreeLabel = "Cashfree Payments (Credit/Debit Card, UPI, Netbanking)";

	// const handleApplyCoupon = () => {
	// 	// In a real application, you'd send couponInput to an API for validation
	// 	console.log("Attempting to apply coupon:", couponInput);
	// 	// This is where you would update ticketData (e.g., setCouponDiscount) based on the API response.
	// 	const couponCodePrice = 399;
	// 	const afterDiscount = paymentInfo?.total - couponCodePrice;
	// 	console.log("afterDiscount => ", afterDiscount);
	// 	setDiscountPrice(afterDiscount);
	// };
	
	const handleApplyCoupon = async () => {
		if (!couponInput) return;
	  
		const res = await validateCoupon(
		  couponInput,
		  actualSubtotal, // <-- use actualSubtotal here
		  userProfileData?.id
		);
	  
		if (!res.success) {
		  toast.error("Invalid coupon!");
		  return;
		}
	  
		const discount = Number(res.data.discount || 0);
		const finalAmount = Number(res.data.finalAmount || 0);
	  
		setDiscountAmount(discount);
		setDiscountPrice(finalAmount);
	  
		toast.success(`Coupon Applied! You saved ₹${discount}`);
	  };
	  
	  

	const makePayment = async () => {
		console.log("passengerDetails =>", passengerDetails);

		const { name, age, phone, email } = passengerDetails;

		// ✅ Validation check
		if (!name || !age || !phone || !email) {
			toast.error("Please fill in all required passenger details!", {
				position: "top-right",
				autoClose: 3000,
				theme: "colored",
			});
			return; // Stop execution if validation fails
		}
		const res = await initiateCheckout(
			userProfileData?.id,
			paymentInfo?.tripId,
			age || userProfileData?.ageRange,
			paymentInfo.Seats,
			actualSubtotal,
			paymentInfo.fromCity.id,
			paymentInfo.toCity.id,
			email || userProfileData?.email,
			phone || userProfileData?.phoneNo,
			paymentInfo?.selectedMeal

		);
		// console.log("Checkout Response:", res);
		if (res && res.sessionId) {
			if (!window.Cashfree) {
				throw new Error("Cashfree SDK not loaded");
			}
			const cashfree = new window.Cashfree({
				mode: "sandbox", // or "production"
			});

			cashfree.checkout({
				paymentSessionId: res.sessionId,
			});
		}
		if (res.length === 0) {
			alert("Payment initiation failed. Please try again.");
		}
	};

	// 2. Universal Change Handler
	const handleChange = (e) => {
		const { name, value } = e.target;
		setPassengerDetails((prevDetails) => ({
			...prevDetails,
			[name]: value, // Dynamically updates the correct field (e.g., 'name', 'age')
		}));
	};

	const fomattingDate = (dateString) => {
		// 1. Create a Date object from the ISO string
		const date = new Date(dateString);

		// 2. Define the desired format options
		const options = {
			year: "numeric",
			month: "long", // Full month name (October)
			day: "numeric", // Day number (25)
			// Add timeZone: 'UTC' to correctly display the date specified in the Z string,
			// avoiding local timezone shifts that might change the day.
			// timeZone: 'UTC'
		};

		// 3. Format the date using the options
		const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
		return formattedDate;
	};

	const validateCoupon = async (code, amount, userId) => {
		const res = await fetch("http://localhost:3000/coupons/validate", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ code, amount, userId }),
		});
	  
		return res.json();
	  };
	  

	const TimeDisplayIST = (ISO_DATE_STRING) => {
		const date = new Date(ISO_DATE_STRING);

		// Define options for time formatting in 24-hour format (hh:mm)
		const timeOptions = {
			hour: "2-digit", // '21'
			minute: "2-digit", // '30'
			hour12: false, // Use 24-hour format (hh)
			timeZone: "Asia/Kolkata", // Crucial for IST (UTC+5:30)
		};

		// Format the date object
		const formattedTime = new Intl.DateTimeFormat("en-IN", timeOptions).format(date);
		return formattedTime;
	};

	// useEffect(()=>{
	// 	const paymentInfo = useSelector((state) => state.paymentInfo.paymentInfo);
	// 	if (Object.keys(paymentInfo).length == 0){
	// 	navigate('/available-cabs')
	// }
	// },[])

	useEffect(() => {
		// --- Navigation Logic ---

		// Check if the paymentInfo state is empty, null, or undefined.
		// The check (paymentInfo && Object.keys(paymentInfo).length === 0)
		// assumes paymentInfo is an object. If it's an array, use (paymentInfo && paymentInfo.length === 0).

		const isPaymentInfoEmpty = !paymentInfo || Object.keys(paymentInfo).length === 0;

		if (isPaymentInfoEmpty) {
			console.log("Payment info is empty. Redirecting to home.");

			// 3. Perform the redirection
			// The '/' path is the home page. Use replace: true to prevent
			// the user from navigating back to this component via the browser's back button.
			navigate("/", { replace: true });
		}

		// The effect runs whenever paymentInfo changes
	}, [paymentInfo, navigate]);

	return (
		<ThemeProvider theme={purpleTheme}>
			<Box
				sx={{
					minHeight: "100vh",
					py: 6,
					// --- BACKGROUND IMAGE STYLES START ---
					backgroundImage: `url(${BgImage})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundAttachment: "fixed",
					// --- BACKGROUND IMAGE STYLES END ---
				}}
			>
				{/* Max width set to XL to use maximum laptop screen real estate */}
				<Container maxWidth="100%" sx={{ display: "flex", justifyContent: "center" }}>
					<Grid container spacing={10}>
						{/* --- LEFT COLUMN: Passenger Info & Remarks (60% width) --- */}
						<Grid item xs={12} lg={7}>
							<Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 5 }}>
								<Typography variant="h5" sx={{ mb: 3 }}>
									Passenger & Booking Details
								</Typography>

								{/* Passenger Information */}
								<Typography
									variant="subtitle1"
									color="primary"
									sx={{
										mb: 1,
										mt: 2,
										color: purpleTheme.palette.primary.dark,
										fontWeight: 600,
									}}
								>
									Passenger Information
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6}>
										<TextField
											required
											label="Passenger Name"
											fullWidth
											name="name" // Crucial for handleChange
											value={passengerDetails.name} // Display the state value
											onChange={handleChange} // Update state on change
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											required
											label="Age"
											type="number"
											fullWidth
											name="age" // Crucial for handleChange
											value={passengerDetails.age}
											onChange={handleChange}
											inputProps={{ min: 1 }}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											required
											label="Phone"
											type="tel"
											fullWidth
											name="phone" // Crucial for handleChange
											value={passengerDetails.phone}
											onChange={handleChange}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											required
											label="Email ID"
											type="email"
											fullWidth
											name="email" // Crucial for handleChange
											value={passengerDetails.email}
											onChange={handleChange}
										/>
									</Grid>
								</Grid>

								<Divider sx={{ my: 4 }} />

								{/* Additional Remark */}
								<Typography
									variant="subtitle1"
									color="primary"
									sx={{
										mb: 1,
										color: purpleTheme.palette.primary.dark,
										fontWeight: 600,
									}}
								>
									Additional Remark
								</Typography>
								<TextField
									// label="Booking Notes (optional)"
									multiline
									rows={4}
									fullWidth
									placeholder="Notes about your ticket booking, e.g., special needs"
									name="additional" // Crucial for handleChange
									value={passengerDetails.additional}
									onChange={handleChange}
								/>

								<Divider sx={{ my: 4 }} />

								{/* Payment Selection (Streamlined for one option) */}
								<Typography variant="h5" sx={{ mb: 3 }}>
									Payment Method
								</Typography>
								<Paper
									variant="outlined"
									sx={{
										p: 2,
										display: "flex",
										alignItems: "center",
										bgcolor: purpleTheme.palette.primary.lightest || "#f3e5f5",
										border: `2px solid ${purpleTheme.palette.primary.main}`, // Highlight the selected method
									}}
								>
									<CreditCard
										sx={{
											mr: 2,
											fontSize: 30,
											color: purpleTheme.palette.primary.dark,
										}}
									/>
									<Box>
										<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
											Online Payment
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{cashfreeLabel}
										</Typography>
									</Box>
								</Paper>

								<Typography
									variant="caption"
									sx={{ mt: 3, display: "block", color: "text.secondary" }}
								>
									Your personal data will be used to process your order, support
									your experience, and for other purposes described in our{" "}
									<Link href="#" color="primary">
										privacy policy
									</Link>
									.
								</Typography>
							</Paper>
						</Grid>

						{/* --- RIGHT COLUMN: Ticket Summary (40% width) --- */}
						<Grid item xs={12} lg={5}>
							{/* Use a sticky position to keep the summary visible on scroll */}
							<Paper
								sx={{
									p: { xs: 2, md: 3 },
									position: "sticky",
									top: 20,
									borderRadius: 5,
								}}
							>
								<Typography variant="h6" sx={{ mb: 3 }}>
									Your Ticket Summary
								</Typography>

								{/* Ticket Details Box (Remains the same) */}
								<Paper variant="outlined" sx={{ mb: 3 }}>
									<Box
										sx={{
											p: 2,
											bgcolor:
												purpleTheme.palette.primary.lightest || "#f3e5f5",
										}}
									>
										<Typography
											variant="subtitle1"
											sx={{
												color: purpleTheme.palette.primary.dark,
												fontWeight: 600,
											}}
										>
											{ticketData.productName} &times; {ticketData.quantity}
										</Typography>
										<Typography variant="caption" color="text.secondary">
											Booking Details:
										</Typography>
									</Box>

									<Box sx={{ p: 2 }}>
										{/* Itinerary Details */}
										<Box
											sx={{
												display: "flex",
												alignItems: "flex-start",
												mb: 1,
											}}
										>
											<Place
												color="primary"
												sx={{ mr: 1, mt: 0.5, fontSize: 18 }}
											/>
											<Typography variant="body2" color="text.secondary">
												Boarding :{" "}
												{`${paymentInfo?.fromCity.name} (${
													paymentInfo?.pickup.name
												} | ${fomattingDate(paymentInfo?.cabStartTime)})`}
											</Typography>
										</Box>
										<Box
											sx={{
												display: "flex",
												alignItems: "flex-start",
												mb: 1,
											}}
										>
											<Place
												color="error"
												sx={{ mr: 1, mt: 0.5, fontSize: 18 }}
											/>
											<Typography variant="body2" color="text.secondary">
												Dropping :{" "}
												{`${paymentInfo?.toCity.name} (${paymentInfo?.drop.name} | ${fomattingDate(paymentInfo?.cabDropTime)})`}
											</Typography>
										</Box>
										<Box
											sx={{
												display: "flex",
												alignItems: "flex-start",
												mb: 2,
											}}
										>
											<Event
												color="action"
												sx={{ mr: 1, mt: 0.5, fontSize: 18 }}
											/>
											<Typography variant="body2" color="text.secondary">
												Pickup Point :{" "}
												{`${paymentInfo?.pickup.name} | Time : ${TimeDisplayIST(
													paymentInfo?.cabDropTime
												)}`}
											</Typography>
										</Box>

										<Divider sx={{ mb: 2 }} />

										{/* Ticket Info */}
										<Grid container spacing={1}>
											<Grid item xs={6}>
												<Typography variant="body2" fontWeight="bold">
													Ticket Information
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Seat Type : Adult
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Seat No: {paymentInfo.Seats.join(",")}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Quantity: {paymentInfo.Seats.length}
												</Typography>
											</Grid>
											<Grid item xs={6} sx={{ textAlign: "right" }}>
												<Typography variant="body2" color="text.secondary">
													Price: (&#x20B9;
													{actualSubtotal.toFixed(2)} excl.)
												</Typography>
												<Typography
													variant="body1"
													fontWeight="bold"
													color="primary"
												>
													Subtotal: ₹{actualSubtotal.toFixed(2)}
												</Typography>
											</Grid>
										</Grid>
									</Box>
								</Paper>

								{/* --- NEW COUPON INPUT FIELD --- */}
								<Box sx={{ mb: 3, display: "flex", gap: 1, alignItems: "center" }}>
									<TextField
										label="Coupon Code"
										placeholder="Enter coupon code"
										fullWidth
										value={couponInput}
										onChange={(e) => setCouponInput(e.target.value)}
										// The TextField styles already come from the purpleTheme MuiTextField override
										sx={{ m: 0 }} // Remove default margins from Grid item
									/>
									<Button
										variant="contained"
										color="primary"
										size="large"
										onClick={handleApplyCoupon}
										disabled={!couponInput}
										sx={{
											// Override the height to match the TextField's effective height
											height: 48,
											whiteSpace: "nowrap",
											minWidth: "auto", // Allow it to shrink
											px: 3,
										}}
									>
										Apply
									</Button>
								</Box>
								<Divider sx={{ my: 2 }} />
								{/* --- END NEW COUPON INPUT FIELD --- */}

								{/* --- Final Price Breakdown Table --- */}
								<Box sx={{ mb: 3 }}>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											py: 1,
											borderBottom: "1px solid #eee",
										}}
									>
										<Typography variant="body1">Subtotal</Typography>
										<Typography variant="body1" fontWeight="medium">
											&#x20B9;{actualSubtotal.toFixed(2)}
										</Typography>
									</Box>
									{/* Applied Coupon Display (Only shows if a coupon is applied) */}
									{discountAmount > 0 && (
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												py: 1,
												bgcolor: "#f1f8e9",
												borderRadius: 1,
												px: 1,
												my: 1,
											}}
										>
											<Typography
												variant="body1"
												color="success.main"
												sx={{ display: "flex", alignItems: "center" }}
											>
												<CheckCircle sx={{ fontSize: 16, mr: 0.5 }} />{" "}
												Coupon: **{couponInput}** (Applied)
											</Typography>
											<Typography
												variant="body1"
												color="success.main"
												fontWeight="medium"
											>
												- &#x20B9;{discountAmount.toFixed(2)}
											</Typography>
										</Box>
									)}
									{discountAmount > 0 && (
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												py: 1,
												borderBottom: "1px solid #eee",
											}}
										>
											<Typography variant="body1">
												Total After Discount
											</Typography>
											<Typography variant="body1" fontWeight="medium">
												&#x20B9;{totalAfterDiscount.toFixed(2)}
											</Typography>
										</Box>
									)}

									{/* (Tax/Final Total is implicit in the breakdown, but we keep this for the final total) */}
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											py: 1.5,
											bgcolor:
												purpleTheme.palette.primary.lightest || "#f3e5f5",
											borderRadius: 1,
											mt: 2,
											px: 1,
										}}
									>
										<Typography variant="h6">
											Final Total (Tax Incl.)
										</Typography>
										<Typography variant="h6" color="primary" fontWeight="bold">
											&#x20B9;
											{finalTotal.toFixed(2)}
										</Typography>
									</Box>
								</Box>

								{/* --- Confirmation Button --- */}
								<Button
									variant="contained"
									color="primary"
									fullWidth
									size="large"
									sx={{ py: 1.5, mb: 1 }}
									onClick={makePayment}
									disabled={!paymentMethod}
								>
									Confirm & Pay &#x20B9;
									{finalTotal ? finalTotal.toFixed(2) : (actualSubtotal || 0).toFixed(2)}

								</Button>
							</Paper>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</ThemeProvider>
	);
};

export default PaymentPreview;
