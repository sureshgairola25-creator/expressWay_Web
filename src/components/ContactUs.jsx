import {
	Box,
	Container,
	Typography,
	TextField,
	Button,
	Grid,
	Paper,
	useTheme,
} from "@mui/material";
import Footer from "./layout/Footer";
import SubscribeBar from "./SubscribeBar";
import Header from "./layout/Header";

const ContactUs = () => {
	const theme = useTheme();

	return (
		<>
			<Header />
			<Box sx={{ bgcolor: theme.palette.background.default, py: 10 }}>
				<Container maxWidth="lg">
					{/* Section Title */}
					<Box textAlign="center" mb={6}>
						<Typography
							variant="h2"
							sx={{ fontWeight: 700, color: theme.palette.primary.main }}
						>
							Contact Us
						</Typography>
						<Typography variant="subtitle1" sx={{ color: "#555", mt: 1 }}>
							We’d love to hear from you! Fill out the form or reach us directly.
						</Typography>
					</Box>

					{/* Form + Contact Info */}
					<Grid container spacing={6}>
						{/* Contact Form */}
						<Grid item xs={12} md={7}>
							<Paper
								elevation={4}
								sx={{
									p: 5,
									borderRadius: 3,
									background: "#fff",
									boxShadow: "0 8px 20px rgba(103,58,183,0.1)",
								}}
							>
								<Grid container spacing={3}>
									<Grid item xs={12} sx={{width:{sm:"100%",md:"30%"}}}>
										<TextField
											fullWidth
											label="Your Name"
											variant="outlined"
											sx={{
												mb: 2,
												"& .MuiOutlinedInput-root": {
													borderRadius: 3,
													boxShadow: "0 2px 6px rgba(103,58,183,0.1)",
													"&:hover fieldset": {
														borderColor: theme.palette.primary.main,
													},
													"&.Mui-focused fieldset": {
														borderColor: theme.palette.primary.main,
														boxShadow: "0 0 5px rgba(103,58,183,0.3)",
													},
												},
											}}
										/>
									</Grid>

									<Grid item xs={12} sx={{width:{sm:"100%",md:"30%"}}}>
										<TextField
											fullWidth
											label="Email Address"
											variant="outlined"
											sx={{
												mb: 2,
												"& .MuiOutlinedInput-root": {
													borderRadius: 3,
													boxShadow: "0 2px 6px rgba(103,58,183,0.1)",
													"&:hover fieldset": {
														borderColor: theme.palette.primary.main,
													},
													"&.Mui-focused fieldset": {
														borderColor: theme.palette.primary.main,
														boxShadow: "0 0 5px rgba(103,58,183,0.3)",
													},
												},
											}}
										/>
									</Grid>

									<Grid item xs={12} sx={{width:{sm:"100%",md:"30%"}}}>
										<TextField
											fullWidth
											label="Subject"
											variant="outlined"
											sx={{
												mb: 2,
												"& .MuiOutlinedInput-root": {
													borderRadius: 3,
													boxShadow: "0 2px 6px rgba(103,58,183,0.1)",
													"&:hover fieldset": {
														borderColor: theme.palette.primary.main,
													},
													"&.Mui-focused fieldset": {
														borderColor: theme.palette.primary.main,
														boxShadow: "0 0 5px rgba(103,58,183,0.3)",
													},
												},
											}}
										/>
									</Grid>

									<Grid item xs={12} width={"95%"}>
										<TextField
											fullWidth
											label="Message"
											variant="outlined"
											multiline
											rows={5}
											sx={{
												mb: 2,
												"& .MuiOutlinedInput-root": {
													borderRadius: 3,
													boxShadow: "0 2px 6px rgba(103,58,183,0.1)",
													"&:hover fieldset": {
														borderColor: theme.palette.primary.main,
													},
													"&.Mui-focused fieldset": {
														borderColor: theme.palette.primary.main,
														boxShadow: "0 0 5px rgba(103,58,183,0.3)",
													},
												},
											}}
										/>
									</Grid>

									<Grid item xs={12}>
										<Button
											variant="contained"
											sx={{
												bgcolor: theme.palette.primary.main,
												background: `linear-gradient(90deg, ${theme.palette.primary.main}, #512da8)`,
												color: "#fff",
												fontWeight: 600,
												px: 6,
												py: 1.8,
												borderRadius: 3,
												textTransform: "none",
												boxShadow: "0 4px 12px rgba(103,58,183,0.2)",
												transition: "all 0.3s ease",
												"&:hover": {
													bgcolor: theme.palette.primary.dark,
													boxShadow: "0 6px 18px rgba(103,58,183,0.3)",
												},
											}}
										>
											Send Message
										</Button>
									</Grid>
								</Grid>
							</Paper>
						</Grid>

						{/* Contact Info */}
						{/* <Grid item xs={12} md={5}>
							<Box
								sx={{
									p: 4,
									borderRadius: 3,
									background: "linear-gradient(135deg, #ede7f6 0%, #d1c4e9 100%)",
									boxShadow: "0 8px 20px rgba(103,58,183,0.1)",
									height: "100%",
								}}
							>
								<Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
									Get in Touch
								</Typography>

								<Typography variant="body1" sx={{ mb: 2 }}>
									<strong>Address:</strong> 123 Expressway Street, City, Country
								</Typography>
								<Typography variant="body1" sx={{ mb: 2 }}>
									<strong>Phone:</strong> +91 98765 43210
								</Typography>
								<Typography variant="body1" sx={{ mb: 2 }}>
									<strong>Email:</strong> support@rvexpressway.com
								</Typography>
								<Typography variant="body1" sx={{ mt: 4 }}>
									We’re always happy to answer your queries. Reach out to us
									anytime!
								</Typography>
							</Box>
						</Grid> */}
					</Grid>
				</Container>
			</Box>
			<SubscribeBar />
			<Footer />
		</>
	);
};

export default ContactUs;
