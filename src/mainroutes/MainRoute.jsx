import React from "react";
import Header from "../components/Header";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import AboutUs from "../pages/about/AboutUs";

import Contact from "../pages/contact/Contact";
import BookNurse from "../pages/book-nurse/BookNurse";
import Blogs from "../pages/blog/Blogs";
import Footer from "../components/Footer";
import BlogDetail from "../pages/blog/BlogDetail";
import ScrollToTop from "../components/ScrollToTop";
import Equipment from "../pages/equipments/Equipment";
import EquipmentDetail from "../pages/equipments/EquipmentDetail";
import NurseDetail from "../pages/book-nurse/NurseDetail";
import CartPage from "../pages/cart/CartPage";
import CheckOut from "../pages/checkout/CheckOut";
import Payment from "../pages/payment/Payment";
import Thankyou from "../pages/thankyoupage/Thankyou";
import MyAccount from "../pages/user/myaccount/MyAccount";
import Profile from "../pages/user/myaccount/Profile";
import MyAddress from "../pages/user/myaccount/MyAddress";
import MyOrders from "../pages/user/myaccount/MyOrders";
import ChangePassword from "../pages/user/myaccount/ChangePassword";

const MainRoute = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/equipments" element={<Equipment />} />
        <Route path="/equipment/:equipmentId" element={<EquipmentDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-nurse" element={<BookNurse />} />
        <Route path="/nurse-detail/:nurseId" element={<NurseDetail />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog-detail" element={<BlogDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/thankyou" element={<Thankyou />} />
        <Route path="/myaccount" element={<MyAccount />} />
      </Routes>
      <Footer />
    </>
  );
};

export default MainRoute;
