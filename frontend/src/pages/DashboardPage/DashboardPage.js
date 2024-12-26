import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../../components/Sections/Banner/Banner";
import dashboardBannerImage from "../../assets/dashboard_banner.png";
import UserRoles from "../../utils/roleConsts";
import { Context } from "../../index";
import { getTopFiveNews } from "../../api/NewsAPI";
import {
  EVENTS_ROUTE,
  USERS_ROUTE,
  MY_ORGANISATIONS_ROUTE,
  NEWS_ROUTE,
} from "../../utils/routerConsts";
import NewsBlock from "../../components/Sections/NewsBlock/NewsBlock";
import CustomButton from "../../components/Common/CustomButton/CustomButton";

// A starting(dashboard) page for registered users. The content and links of banner depend on user highest role
const DashboardPage = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  // Extract user roles and determine the highest role
  const userRoles = Array.isArray(user.roles)
    ? user.roles.map(Number)
    : [Number(user.role)];
  const highestRole = Math.max(...userRoles);
  const username = user._username;

  let text, buttonText, buttonLink;

  // Determine the content based on highest user role (if multiple)
  switch (highestRole) {
    case UserRoles.REGULAR:
      text = `Welcome ${username}, browse all our events!`;
      buttonText = "Browse";
      buttonLink = EVENTS_ROUTE;
      break;
    case UserRoles.MANAGER:
      text = `Welcome ${username}, browse your organisations!`;
      buttonText = "Browse";
      buttonLink = MY_ORGANISATIONS_ROUTE;
      break;
    case UserRoles.ADMIN:
      text = `Welcome ${username}, check the users!`;
      buttonText = "Browse";
      buttonLink = USERS_ROUTE;
      break;
    default:
      text = `Welcome ${username}, explore the platform!`;
      buttonText = "Browse";
      buttonLink = EVENTS_ROUTE;
  }

  const [newsItems, setNewsItems] = useState([]);

  const handleMoreNews = () => {
    navigate(NEWS_ROUTE);
  };

  // useEffect hook to fetch the top five news items when the component is mounted
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await getTopFiveNews();
        const formattedNews = newsData.map((news) => ({
          id: news.id,
          title: news.title,
          text: news.content,
          author: news.User.username,
        }));
        setNewsItems(formattedNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, []); // Empty dependency array means this runs only once when the component mounts

  return (
    <>
      <Banner
        backgroundImage={dashboardBannerImage}
        text={text}
        buttonText={buttonText}
        buttonLink={buttonLink}
      />
      {/* Conditionally render the NewsBlock and "More News" button if the user is not an admin */}
      {!userRoles.includes(UserRoles.ADMIN) && (
        <>
          <NewsBlock newsItems={newsItems} />
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <CustomButton size="md" onClick={handleMoreNews}>
              More News
            </CustomButton>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardPage;
