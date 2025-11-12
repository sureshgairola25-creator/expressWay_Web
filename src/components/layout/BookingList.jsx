import React from 'react';
import ListPage from './ListPage';
import PageContainer from './PageContainer';

const columns = ['Booking ID', 'User', 'Trip', 'Seats', 'Status', 'Amount'];

const rows = [
  { 'Booking ID': 'BK001', User: 'John Doe', Trip: 'Trip A', Seats: 2, Status: 'Confirmed', Amount: '$50' },
  { 'Booking ID': 'BK002', User: 'Jane Smith', Trip: 'Trip B', Seats: 1, Status: 'Pending', Amount: '$25' },
  { 'Booking ID': 'BK003', User: 'Bob Johnson', Trip: 'Trip A', Seats: 3, Status: 'Confirmed', Amount: '$75' },
  { 'Booking ID': 'BK004', User: 'Alice Brown', Trip: 'Trip C', Seats: 1, Status: 'Cancelled', Amount: '$20' },
  { 'Booking ID': 'BK005', User: 'Charlie Wilson', Trip: 'Trip B', Seats: 2, Status: 'Confirmed', Amount: '$50' },
  { 'Booking ID': 'BK006', User: 'Diana Prince', Trip: 'Trip C', Seats: 1, Status: 'Pending', Amount: '$20' },
  { 'Booking ID': 'BK007', User: 'Edward Norton', Trip: 'Trip A', Seats: 2, Status: 'Confirmed', Amount: '$50' },
  { 'Booking ID': 'BK008', User: 'Fiona Apple', Trip: 'Trip B', Seats: 1, Status: 'Confirmed', Amount: '$25' },
];

export default function BookingList() {
  return (
    <PageContainer>
      <ListPage title="Booking List" columns={columns} rows={rows} />
    </PageContainer>
  );
}
