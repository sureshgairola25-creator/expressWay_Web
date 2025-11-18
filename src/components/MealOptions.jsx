// import React, { useEffect } from "react";
// import { Grid, Card, Typography, Box } from "@mui/material";
// import RestaurantIcon from "@mui/icons-material/Restaurant";
// import LocalCafeIcon from "@mui/icons-material/LocalCafe";
// import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
// import { toast } from "react-toastify";

// const mealsIcon = [
// 	{ label: "Breakfast", icon: <LocalCafeIcon sx={{ fontSize: 36 }} /> },
// 	{ label: "Lunch", icon: <RestaurantIcon sx={{ fontSize: 36 }} /> },
// 	{ label: "Dinner", icon: <DinnerDiningIcon sx={{ fontSize: 36 }} /> },
// ];

// const MealOptions = ({ meals, selectedMeal, setSelectedMeal, selectedSeats, handleMealClick }) => {
// 	useEffect(() => {
// 		if (Array.isArray(selectedSeats) && selectedSeats.length === 0) {
// 			setSelectedMeal(null);
// 		}
// 	}, [selectedSeats]); // ✅ only depend on selectedSeats

// 	return (
// 		<Box sx={{ mt: 3 }}>
// 			<Typography variant="h6" sx={{ mb: 2, color: "#333", fontWeight: 600 }}>
// 				Available Meals
// 			</Typography>

// 			<Grid container spacing={2}>
// 				{meals?.length > 0 ? (
// 					meals.map((meal) => (
// 						<Grid item xs={12} sm={4} key={meal.type}>
// 							{/* <Card
//                 onClick={() => handleMealClick(meal)}
//                 sx={{
//                   textAlign: "center",
//                   p: 3,
//                   borderRadius: 3,
//                   boxShadow: selectedMeal?.type === meal.type ? 6 : 3,
//                   border:
//                     selectedMeal?.type === meal.type
//                       ? "2px solid #5D3FD3"
//                       : "2px solid transparent",
//                   backgroundColor:
//                     selectedMeal?.type === meal.type ? "#f3f0ff" : "#fff",
//                   cursor: "pointer",
//                   transition: "all 0.25s ease",
//                   "&:hover": {
//                     transform: "translateY(-4px)",
//                     boxShadow: 6,
//                   },
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     mb: 1,
//                     color:
//                       selectedMeal?.type === meal.type
//                         ? "#5D3FD3"
//                         : "#6b6b6b",
//                   }}
//                 >
//                   {mealsIcon.find((item) => item.label === meal.type)?.icon}
//                 </Box>
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     fontWeight: 500,
//                     color:
//                       selectedMeal?.type === meal.type ? "#5D3FD3" : "#222",
//                   }}
//                 >
//                   {meal.type}
//                 </Typography>
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     fontWeight: 500,
//                     color:
//                       selectedMeal?.type === meal.type ? "#5D3FD3" : "#222",
//                   }}
//                 >
//                   {meal.price}
//                 </Typography>
//               </Card> */}
// 							<Card
// 								onClick={() => handleMealClick(meal)}
// 								sx={{
// 									textAlign: "center",
// 									p: 3,
// 									borderRadius: 4,
// 									boxShadow: selectedMeal?.type === meal.type ? 6 : 2,
// 									border:
// 										selectedMeal?.type === meal.type
// 											? "2px solid #5D3FD3"
// 											: "1px solid #e0e0e0",
// 									background:
// 										selectedMeal?.type === meal.type
// 											? "linear-gradient(135deg, #ede7ff 0%, #f5f2ff 100%)"
// 											: "#fff",
// 									cursor: "pointer",
// 									transition: "all 0.25s ease",
// 									"&:hover": {
// 										transform: "translateY(-6px)",
// 										boxShadow: 6,
// 										borderColor: "#5D3FD3",
// 									},
// 								}}
// 							>
// 								<Box
// 									sx={{
// 										display: "flex",
// 										justifyContent: "center",
// 										alignItems: "center",
// 										mb: 2,
// 										color:
// 											selectedMeal?.type === meal.type
// 												? "#5D3FD3"
// 												: "#6b6b6b",
// 										backgroundColor:
// 											selectedMeal?.type === meal.type
// 												? "#e5dbff"
// 												: "#f8f8f8",
// 										width: 70,
// 										height: 70,
// 										borderRadius: "50%",
// 										mx: "auto",
// 										transition: "all 0.3s ease",
// 									}}
// 								>
// 									{mealsIcon.find((item) => item.label === meal.type)?.icon}
// 								</Box>

// 								<Typography
// 									variant="subtitle1"
// 									sx={{
// 										fontWeight: 600,
// 										color:
// 											selectedMeal?.type === meal.type ? "#5D3FD3" : "#222",
// 										mb: 0.5,
// 									}}
// 								>
// 									{meal.type}
// 								</Typography>

// 								<Typography
// 									variant="body1"
// 									sx={{
// 										fontWeight: 500,
// 										color:
// 											selectedMeal?.type === meal.type ? "#4B3CB0" : "#555",
// 										backgroundColor:
// 											selectedMeal?.type === meal.type
// 												? "#efeaff"
// 												: "#f5f5f5",
// 										borderRadius: 2,
// 										px: 1.5,
// 										py: 0.5,
// 										display: "inline-block",
// 										mt: 0.5,
// 									}}
// 								>
// 									₹{meal.price}
// 								</Typography>
// 							</Card>
// 						</Grid>
// 					))
// 				) : (
// 					<Typography variant="body2" color="text.secondary">
// 						No meal options available in this Ride.
// 					</Typography>
// 				)}
// 			</Grid>
// 		</Box>
// 	);
// };

// export default MealOptions;


import React, { useEffect } from "react";
import { Grid, Card, Typography, Box } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";

const mealsIcon = [
  { label: "Breakfast", icon: <LocalCafeIcon sx={{ fontSize: 32 }} /> },
  { label: "Lunch", icon: <RestaurantIcon sx={{ fontSize: 32 }} /> },
  { label: "Dinner", icon: <DinnerDiningIcon sx={{ fontSize: 32 }} /> },
];

const MealOptions = ({ meals, selectedMeal, setSelectedMeal, selectedSeats, handleMealClick }) => {
  
  useEffect(() => {
    if (Array.isArray(selectedSeats) && selectedSeats.length === 0) {
      setSelectedMeal(null);
    }
  }, [selectedSeats]);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Available Meals
      </Typography>

      <Grid container spacing={2}>
        {meals?.length > 0 ? (
          meals.map((meal) => (
            <Grid item xs={12} sm={4} key={meal.type}>
              
              {/* Compact Meal Card */}
              <Card
                onClick={() => handleMealClick(meal)}
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: 3,
                  boxShadow: selectedMeal?.type === meal.type ? 5 : 1,
                  border:
                    selectedMeal?.type === meal.type
                      ? "2px solid #5D3FD3"
                      : "1px solid #ddd",
                  background:
                    selectedMeal?.type === meal.type
                      ? "linear-gradient(135deg, #ede7ff 0%, #f5f2ff 100%)"
                      : "#fff",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 5,
                    borderColor: "#5D3FD3",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 1.3,
                    color:
                      selectedMeal?.type === meal.type ? "#5D3FD3" : "#6b6b6b",
                    backgroundColor:
                      selectedMeal?.type === meal.type ? "#e5dbff" : "#f4f4f4",
                    width: 55,
                    height: 55,
                    borderRadius: "50%",
                    mx: "auto",
                  }}
                >
                  {mealsIcon.find((m) => m.label === meal.type)?.icon}
                </Box>

                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color:
                      selectedMeal?.type === meal.type ? "#5D3FD3" : "#222",
                    mb: 0.3,
                  }}
                >
                  {meal.type}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color:
                      selectedMeal?.type === meal.type ? "#4B3CB0" : "#555",
                    backgroundColor:
                      selectedMeal?.type === meal.type ? "#efeaff" : "#f0f0f0",
                    borderRadius: 1.5,
                    px: 1.2,
                    py: 0.3,
                    display: "inline-block",
                    mt: 0.3,
                  }}
                >
                  ₹{meal.price}
                </Typography>
              </Card>

            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No meal options available in this Ride.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default MealOptions;

