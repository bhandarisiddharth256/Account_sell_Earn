import React from 'react'
import Hero from '../components/Hero';
import LatestListings from '../components/LatestListings';
import Plan from '../components/Plans';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
const Home = () => {
  return (
    <div>
        <Hero />
        <LatestListings />
        <Plan/>
        <CTA/>
        <Footer/>
    </div>
  )
}

export default Home;