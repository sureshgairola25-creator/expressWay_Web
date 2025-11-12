import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HeroSection from "./components/layout/HeroSection";
import Footer from "./components/layout/Footer";
import ContentSection from "./components/ContentSection";
import Header from "./components/layout/Header";
import Login from "./components/signup/Login";
import Register from "./components/signup/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AvailableCab from "./components/AvailableCab";
import AboutUs from "./components/AboutDetails";
import ConstactUs from "./components/ContactUs";
import Blogs from "./components/Blogs";
import Terms from "./components/Terms";

import CompleteProfile from "./components/signup/CompleteProfile";
import AdminLayout from "./components/layout/AdminLayout";
import UserList from "./components/layout/UserList";
import TripList from "./components/layout/TripList";
import RouteCreation from "./components/layout/RouteCreation";
import BookingList from "./components/layout/BookingList";
import Dashboard from "./components/layout/Dashboard";
import RouteManagement from "./components/layout/RouteManagement";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Cars from "./components/layout/Cars";
import PaymentPreview from "./components/PaymentPreview";
import BookingHistory from "./components/BookingHistroy";
import UserProfileCard from "./components/Profile";
import VerifyOtpPage from "./pages/verify-otp";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserInfo } from "./slices/users";
import AdminProtected from "./components/adminProtected";
import NotFoundPage from "./pages/NotFoundPage";
import PublicRoute from "./components/PublicRoute";
import Coupons from "./pages/admin/Coupons";

const BASE_URL = "http://localhost:3000/";

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		const getUserData = async () => {
			try {
				const token = localStorage.getItem("authToken");
				if (!token) {
					console.warn("No token found in localStorage");
					return;
				}

				const response = await axios.get(`${BASE_URL}user/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				// ✅ Correct action + payload
				console.log("User info loaded:", response.data.data);
				dispatch(setUserInfo(response.data.data));
				// console.log("User info loaded:", response.data);
			} catch (error) {
				console.error("Error in getUserData:", error);
				localStorage.removeItem("authToken");
				console.log("call failed api after token not found.");
			}
		};

		getUserData();
	}, [dispatch]);

	return (
		<Router>
			{/* <Header /> */}
			{
				<Routes>
					<Route
						path="/login"
						element={
							<PublicRoute>
								<Login />
							</PublicRoute>
						}
					/>
					<Route path="/signup" element={<Register />} />
					<Route path="/profile-completion" element={<CompleteProfile />} />
					<Route path="/verify-otp" element={<VerifyOtpPage />} />
					<Route
						path="/admin/dashboard"
						element={
							<AdminProtected>
								<AdminLayout>
									<Dashboard />
								</AdminLayout>
							</AdminProtected>
						}
					/>
					<Route
						path="/admin/bookings"
						element={
							<AdminProtected>
								<AdminLayout>
									<BookingList />
								</AdminLayout>
							</AdminProtected>
						}
					/>
					<Route
						path="/admin/trips"
						element={
							<AdminProtected>
								<AdminLayout>
									<TripList />
								</AdminLayout>
							</AdminProtected>
						}
					/>
					<Route
						path="/admin/users"
						element={
							<AdminProtected>
								<AdminLayout>
									<UserList />
								</AdminLayout>
							</AdminProtected>
						}
					/>
					<Route
						path="/admin/routes"
						element={
							<AdminProtected>
								<AdminLayout>
									<RouteManagement />
								</AdminLayout>
							</AdminProtected>
						}
					/>
					{/* <Route
						path="/admin/locations"
						element={
							<AdminLayout>
								<RouteCreation />
							</AdminLayout>
						}
					/> */}
					<Route
						path="/admin/cars"
						element={
							<AdminProtected>
								<AdminLayout>
									<Cars />
								</AdminLayout>
							</AdminProtected>
						}
					/>
					<Route
						path="/admin/coupons/*"
						element={
							<AdminProtected>
								<AdminLayout>
									<Coupons />
								</AdminLayout>
							</AdminProtected>
						}
					/>
					<Route
						path="/admin/routes/create"
						element={
							<AdminProtected>
								<AdminLayout>
									<RouteCreation />
								</AdminLayout>
							</AdminProtected>
						}
					/>
					<Route
						path="/"
						element={
							<>
								<HeroSection />
								<ContentSection />
								<Footer />
							</>
						}
					/>
					<Route
						path="/bookings/:id"
						element={
							<ProtectedRoute>
								<BookingHistory />
							</ProtectedRoute>
						}
					/>
					<Route path="/available-cabs" element={<AvailableCab />} />

					<Route path="/about" element={<AboutUs />} />
					<Route path="/contactus" element={<ConstactUs />} />
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<UserProfileCard />
							</ProtectedRoute>
						}
					/>

					<Route path="/blogs" element={<Blogs />} />

					<Route path="/terms" element={<Terms />} />
					<Route
						path="/payment/preview"
						element={
							<ProtectedRoute>
								<PaymentPreview />
							</ProtectedRoute>
						}
					/>

					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			}
		</Router>
	);
}

export default App;
