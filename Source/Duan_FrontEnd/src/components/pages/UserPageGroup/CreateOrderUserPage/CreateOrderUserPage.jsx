import React from 'react'
import styles from './CreateOrderUserPage.module.css'
import GuestNavbar from '../../../layout/GuestNavbar/GuestNavbar'
import GuestSidebar from '../../../layout/GuestSidebar/GuestSidebar'
import CreateOrder from '../../Home/CreateOrder/CreateOrder'

const CreateOrderUserPage = () => {
  return (
    <>
    <GuestNavbar></GuestNavbar>
    <GuestSidebar></GuestSidebar>
    <div className={styles.main}>
      {/* <ViewOrder></ViewOrder> */}
      <CreateOrder></CreateOrder>
    </div>
    </>
  )
}

export default CreateOrderUserPage