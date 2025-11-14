export const COUPON_ENDPOINTS = {
  BASE: '/coupons',
  BY_ID: (id) => `/coupons/${id}`,
  APPLY: '/coupons/apply',
  VALIDATE: (code) => `/coupons/validate/${code}`
};