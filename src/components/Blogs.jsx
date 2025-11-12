
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import SubscribeBar from "./SubscribeBar";

// Sample blog data
const blogPosts = [
  {
    title: "Exploring the Himalayas",
    image: "/images/himalayas.jpg",
    excerpt: "Discover the breathtaking landscapes of the Himalayas, trekking routes, and local culture.",
    link: "/blogs/himalayas",
  },
  {
    title: "A Weekend in Rishikesh",
    image: "/images/rishikesh.jpg",
    excerpt: "Experience adventure, yoga, and serene riverside stays in Rishikesh.",
    link: "/blogs/rishikesh",
  },
  {
    title: "Beach Getaways in Goa",
    image: "/images/goa.jpg",
    excerpt: "Relax on the golden sands, enjoy vibrant nightlife, and explore Goan cuisine.",
    link: "/blogs/goa",
  },
  {
    title: "Road Trip to Manali",
    image: "/images/manali.jpg",
    excerpt: "Plan your ultimate road trip with scenic drives, snow-capped peaks, and adventure sports.",
    link: "/blogs/manali",
  },
];

const TravelBlog = () => {
  const theme = useTheme();

  return (
    <>
    <Header />
    <Box sx={{ bgcolor: theme.palette.background.default, py: 10 }}>
      <Container maxWidth="lg">
        {/* Section Title */}
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            sx={{ fontWeight: 700, color: theme.palette.primary.main }}
          >
            Travel Blog
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "#555", mt: 2, maxWidth: 600, mx: "auto" }}
          >
            Explore our latest travel experiences, tips, and destination guides from across the world.
          </Typography>
        </Box>

        {/* Blog Cards */}
        <Grid container spacing={4}>
          {blogPosts.map((post, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                  },
                }}
              >
                {/* Blog Image */}
                <CardMedia
                  component="img"
                  height="180"
                  image={post.image}
                  alt={post.title}
                  sx={{
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />

                {/* Blog Content */}
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#555", mb: 2, minHeight: 60 }}
                  >
                    {post.excerpt}
                  </Typography>
                  <Button
                    href={post.link}
                    variant="contained"
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "#fff",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      "&:hover": { bgcolor: theme.palette.primary.dark },
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
    <SubscribeBar/>
    <Footer />
    </>
  );
};

export default TravelBlog;
