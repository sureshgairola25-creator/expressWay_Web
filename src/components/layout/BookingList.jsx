import React, { useEffect, useState } from 'react';
import ListPage from './ListPage';
import PageContainer from './PageContainer';
import { getAllBookings } from "../../apiServices/booking";

const columns = ['id', 'User', 'Trip', 'Seats', 'Status', 'Amount'];

export default function BookingList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      const data = await getAllBookings();
      const bookings = Array.isArray(data?.data) ? data.data : data;

      const mapped = bookings.map(b => ({
        id: b.id,
        User: `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.trim() || 'N/A',
        Trip: `${b.trip?.startLocation?.name} → ${b.trip?.endLocation?.name}`,
        Seats: b.seats?.join(', ') || '-',
        Status: b.bookingStatus,
        Amount: `₹${b.totalAmount}`
      }));

      setRows(mapped);
      setLoading(false);
    }

    loadBookings();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <PageContainer>
      <ListPage title="Booking List" columns={columns} rows={rows} />
    </PageContainer>
  );
}
