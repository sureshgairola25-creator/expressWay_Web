import React from 'react';
import { Container, Box, useMediaQuery, useTheme } from '@mui/material';

export default function PageContainer({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          padding: theme.spacing(isMobile ? 2 : 3),
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Container>
  );
}


