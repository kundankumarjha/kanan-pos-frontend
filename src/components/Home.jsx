import React from 'react'
import Leftbar from './Leftbar'
import Navbar from './Navbar'

const Home = () => {
  return (
    <div>
      <Navbar login="true"/>
      <Leftbar />
    </div>
  )
}

export default Home
