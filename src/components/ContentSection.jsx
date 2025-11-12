import React from 'react'
import { Container, Divider } from '@mui/material'
import BookingProcess from './BookingProcess'
import UserReview from './UserReview'
import About from './About'
import SubscribeBar from './SubscribeBar'
import ImageCard from './OfferCards'

const ContentSection = () => {
  return (
    <>
    <Container maxWidth="xxl" sx={{ py: 4 }}>
      <BookingProcess />
      <About/>
      <UserReview />
    </Container>
      <Divider />
      <ImageCard />
      <SubscribeBar />
    </>
  )
}

export default ContentSection