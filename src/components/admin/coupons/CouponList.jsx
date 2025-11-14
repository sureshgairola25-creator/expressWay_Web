import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Padding } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getCoupons, deleteCoupon, formatCouponForDisplay } from "../../../../src/apiServices/couponService";
import PageHeader from '../../common/PageHeader';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import { toast } from 'react-toastify';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await getCoupons();
      // The API returns data in response.data array
      if (response && response.data) {
        setCoupons(response.data.map(coupon => formatCouponForDisplay(coupon)));
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    navigate(`/admin/coupons/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedCouponId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCouponId) return;
    
    try {
      await deleteCoupon(selectedCouponId);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCouponId(null);
    }
  };

  const handleAddNew = () => {
    navigate('/admin/coupons/new');
  };

  if (loading && coupons.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="xl" style={{ padding: '20px' }}>
      <PageHeader
        title="Coupon Management"
        subtitle="Manage your promotional coupons and discounts"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
          >
            Add New Coupon
          </Button>
        }
      />

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Validity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((coupon) => (
                    <TableRow key={coupon._id} hover>
                      <TableCell>
                        {coupon.image ? (
                          <Box
                            component="img"
                            src={coupon.image}
                            alt={coupon.code}
                            sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              bgcolor: 'grey.200',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="caption" color="textSecondary">
                              No Image
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {coupon.code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {coupon.description || 'No description'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={coupon.discount_value}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{coupon.end_date}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={coupon.status}
                          color={coupon.status === true ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {/* <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(coupon.id)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip> */}
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDeleteClick(coupon.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={coupons.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Coupon"
        content="Are you sure you want to delete this coupon? This action cannot be undone."
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </Container>
  );
};

export default CouponList;
