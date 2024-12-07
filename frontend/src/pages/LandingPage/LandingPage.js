import React from "react";
import Banner from "../../components/Sections/Banner/Banner";
import homeBannerImage from "../../assets/home_banner.png";
import Statistics from "../../components/Sections/Statistics/Statistics";
import { REGISTER_ROUTE } from "../../utils/routerConsts";

const LandingPage = () => {
  return (
    <>
      <Banner
        backgroundImage={homeBannerImage}
        text="Discover the best volunteering events near you!"
        buttonText="Join Us"
        buttonLink={REGISTER_ROUTE}
      />
      <Statistics
        caption="Statistics"
        text1="Text 1"
        text2="Text 2"
        text3="Text 3"
        num1={100}
        num2={200}
        num3={300}
      />
    </>
  );
};

export default LandingPage;
