import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CouponList, CouponForm } from '../../components/admin/coupons';
import AdminLayout from '../../components/layout/AdminLayout';

const Coupons = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<CouponList />} />
        <Route path="new" element={<CouponForm />} />
        <Route path="edit/:id" element={<CouponForm />} />
        <Route path="*" element={<Navigate to="/admin/coupons" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default Coupons;
