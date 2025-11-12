import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import SubscribeBar from "./SubscribeBar";

const policiesData = [
  {
    number: 1,
    title: "Cancellation and Refund Policy",
    items: [
      "RV EXPRESSWAY CAB LLP believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:",
      "Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.",
      "RV EXPRESSWAY CAB LLP does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.",
      "In case of receipt of damaged or defective items please report the same to our Customer Service team within 2 days of receipt. The request will be entertained once the merchant checks and confirms the issue.",
      "Complaints regarding products with manufacturer warranty should be referred to them directly.",
      "Refunds approved by RV EXPRESSWAY CAB LLP will be processed within 3-5 days.",
    ],
  },
  {
    number: 2,
    title: "Terms and Conditions",
    items: [
      "These Terms and Conditions, along with privacy policy or other terms (“Terms”) constitute a binding agreement by and between RV EXPRESSWAY CAB LLP (“Website Owner” or “we” or “us” or “our”) and you (“you” or “your”) and relate to your use of our website, goods, or services.",
      "By using our website and availing the Services, you agree that you have read and accepted these Terms (including the Privacy Policy). We reserve the right to modify these Terms at any time and without assigning any reason. It is your responsibility to periodically review these Terms to stay informed of updates.",
      "Provide true and complete information during registration and usage.",
      "Neither we nor any third parties provide warranty or guarantee as to accuracy, timeliness, or suitability of information.",
      "Your use of our Services is solely at your own risk.",
      "Contents of the Website are proprietary; unauthorized use may lead to legal action.",
      "Payment charges must be made for Services availed.",
      "Do not use the website or Services for unlawful purposes.",
      "Links to third-party websites are governed by their own terms.",
      "Refunds, if applicable, will follow the service-specific timeline.",
      "Force majeure events may prevent performance without liability.",
      "Governing law: India; jurisdiction: EAST DELHI, DELHI.",
    ],
  },
  {
    number: 3,
    title: "Privacy Policy",
    items: [
      "This Privacy Policy describes how RV EXPRESSWAY CAB LLP (“we,” “us,” or “our”) collects, uses, and discloses your information when you use our website and services (the “Services”). By using our Services, you agree to the collection and use of information in accordance with this policy.",
      "Information We Collect: Account info, driver info, payment info, communications, location data, usage data, and transaction information.",
      "How We Use Your Information: To provide and maintain services, improve services, communicate updates, ensure security, and comply with legal obligations.",
      "How We Share Your Information: Service providers, drivers/passengers, legal authorities, or business transfers.",
      "Data Security: Technical and organizational measures implemented to protect your personal data, but no method is 100% secure.",
      "Your Rights: Access, correction, deletion, and withdraw consent for your personal data.",
      "Changes to Policy: Policy may be updated; review periodically.",
      "Contact Us: expresswaycabhelp@gmail.com",
    ],
  },
];

const Policies = () => {
  const theme = useTheme();

  return (
    <>
    <Header />
    <Box sx={{ bgcolor: "#f5f6fa", py: 10 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            textAlign: "center",
            mb: 8,
          }}
        >
          Our Policies
        </Typography>

        {policiesData.map((policy) => (
          <Paper
            key={policy.number}
            sx={{
              p: 5,
              mb: 6,
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              borderLeft: `8px solid ${theme.palette.primary.main}`,
              transition: "transform 0.3s",
              "&:hover": { transform: "translateY(-5px)" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  bgcolor: theme.palette.primary.main,
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 700,
                  mr: 2,
                  fontSize: "1.2rem",
                }}
              >
                {policy.number}
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.primary.dark }}
              >
                {policy.title}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3, borderColor: "#ddd" }} />

            <Box component="ul" sx={{ pl: 3, color: "#444", lineHeight: 1.8 }}>
              {policy.items.map((item, idx) => (
                <li key={idx}>
                  <Typography variant="body1">{item}</Typography>
                </li>
              ))}
            </Box>
          </Paper>
        ))}
      </Container>
    </Box>
    <SubscribeBar />
    <Footer />
    </>
  );
};

export default Policies;
