import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const NoRideModal = ({ open, handleClose, location, time }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      maxHight="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 2, position: 'relative' } }}
    >
      {/* Close Button */}
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, color: '#673ab7' }}>
        No Rides Available
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
          Sorry, there are no rides available for the following:
        </Typography>
        {/* <Typography variant="body2" sx={{ fontWeight: 500, color: '#333', textAlign: 'center' }}>
          Location: {location || 'N/A'} <br />
          Time: {time || 'N/A'}
        </Typography> */}
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: '#777' }}>
          Please try selecting a different Date or location.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          sx={{ px: 4, borderRadius: 2 }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoRideModal;
