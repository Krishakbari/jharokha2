import React from 'react'
import Hero from '../components/Hero'
import Editors from '../components/Editors'
import Material from '../components/Material'
import Newarrival from '../components/Newarrival'
import Saree from '../components/Saree'
import Dress from '../components/Dress'
import Instagram from '../components/Instagram'
import Category from '../components/Category'

const Home = () => {
  return (
    <>
      {/* <Navbar/> */}
      <Hero/>
      {/* <Category/> */}
      <Newarrival/>
      <Editors/>
      {/* <Material/> */}
      <Saree/>
      <Instagram/>
      {/* <Footer/> */}
    </>
  )
}

export default Home
