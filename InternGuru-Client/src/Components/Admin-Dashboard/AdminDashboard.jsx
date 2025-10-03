import React from 'react'
import { useSelector } from 'react-redux'

const AdminDashboard = () => {

  const {user} = useSelector((state)=>state.auth)

  return (
    <>
    <h1>Admin Dashboard</h1>
    </>
  )
}

export default AdminDashboard
