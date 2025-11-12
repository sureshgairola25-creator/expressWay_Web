export const COUPON_ENDPOINTS = {
  BASE: '/api/coupons',
  BY_ID: (id) => `/api/coupons/${id}`,
  APPLY: '/api/coupons/apply',
  VALIDATE: (code) => `/api/coupons/validate/${code}`
};