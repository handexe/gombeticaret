import React from 'react'
import SliderComp from '../components/home/SliderComp'
import CategoryPage from '../components/home/Categories'
import "../index.css"
function Home() {
  return (
    <div className="home-container">
      <SliderComp/>
      <CategoryPage/>
    </div>
  )
}

export default Home
