
import React from "react";
import Link from "next/link";
import PageCover from "../components/PageCover";
import AboutUs from "../components/AboutUs";
import HealthCare from "../components/HealthCare";
import OurDoctor from "../components/OurDoctor";
import RawatInap from "../components/RawatInap";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";



const HomePage = () => {
  return (
    <>
      <PageCover />
      <AboutUs />
  <HealthCare />
  <RawatInap />
      <OurDoctor />
      <Testimonial />
      <Footer />
    </>
  );
};



export default HomePage;
