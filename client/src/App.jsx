import React from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import Home from "./pages/Home"
import Loading from "./pages/Loading"
import ListingDetails from "./pages/ListingDetails"
import ManageListing from "./pages/ManageListing"
import MarketPlace from "./pages/MarketPlace"
import Messages from "./pages/Messages"
import MyListings from "./pages/MyListings"
import MyOrders from "./pages/MyOrders"

import Navbar from "./components/Navbar"
import ChatBox from "./components/ChatBox"

import Layout from "./pages/admin/Layout"
import Dashboard from "./pages/admin/Dashboard"
import AllListings from "./pages/admin/AllListings"
import CredentialChange from "./pages/admin/CredentialChange"
import CredentialVerify from "./pages/admin/CredentialVerify"
import Transaction from "./pages/admin/Transactions"
import Withdrawal from "./pages/admin/Withdrawal"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { getAllPublicListing, getAllUserListing } from "./app/features/listingSlice"

const App = () => {
  const { pathname } = useLocation();
  const {getToken} =  useAuth();
  const {user , isLoaded} = useUser();

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getAllPublicListing())
  },[])

  useEffect(()=>{
     if(isLoaded && user){
      dispatch(getAllUserListing({getToken}))
     }
  },[isLoaded , user])

  const isAdminRoute = pathname.startsWith("/admin")

  return (
    <div>
      <Toaster />

      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/listing/:listingId" element={<ListingDetails />} />
        <Route path="/create-listing" element={<ManageListing />} />
        <Route path="/edit-listing/:id" element={<ManageListing />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/loading" element={<Loading />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="verify-credentials" element={<CredentialVerify />} />
          <Route path="change-credentials" element={<CredentialChange />} />
          <Route path="list-listings" element={<AllListings />} />
          <Route path="transactions" element={<Transaction />} />
          <Route path="withdrawal" element={<Withdrawal />} />
        </Route>
      </Routes>

      {!isAdminRoute && <ChatBox />}
    </div>
  )
}

export default App
