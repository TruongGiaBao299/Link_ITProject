import React from 'react'
import Header from '../../layout/Header/Header'
import Footer from '../../layout/Footer/Footer'
import Service from '../../../containers/Service/Service'
import HeaderDriver from '../../layout/HeaderDriver/HeaderDriver'

const ServiceDriverPage = () => {
  return (
    <>
        <HeaderDriver></HeaderDriver>
        <Service></Service>
        <Footer></Footer>
    </>
  )
}

export default ServiceDriverPage