import React, { useContext, useState } from "react";
import Banner from "../../components/Banner/Banner";
import dashboardBannerImage from "../../assets/dashboard_banner.png";
import UserRoles from "../../utils/roleConsts";
import { Context } from "../../index";
import {
  EVENTS_ROUTE,
  USERS_ROUTE,
  MY_ORGANISATIONS_ROUTE,
} from "../../utils/routerConsts";
import NewsBlock from "../../components/NewsBlock/NewsBlock";

const DashboardPage = () => {
  const { user } = useContext(Context);

  const userRoles = Array.isArray(user.roles)
    ? user.roles.map(Number)
    : [Number(user.role)];
  const highestRole = Math.max(...userRoles);
  const username = user._username;
  console.log(highestRole);

  let text, buttonText, buttonLink;

  switch (highestRole) {
    case UserRoles.REGULAR:
      text = `Welcome ${username}, browse all our events!`;
      buttonText = "Browse";
      buttonLink = { EVENTS_ROUTE };
      break;
    case UserRoles.MANAGER:
      text = `Welcome ${username}, browse your organisations!`;
      buttonText = "Browse";
      buttonLink = { MY_ORGANISATIONS_ROUTE };
      break;
    case UserRoles.ADMIN:
      text = `Welcome ${username}, check the users!`;
      buttonText = "Browse";
      buttonLink = { USERS_ROUTE };
      break;
    default:
      text = `Welcome ${username}, explore the platform!`;
      buttonText = "Browse";
      buttonLink = { EVENTS_ROUTE };
  }

  const [newsItems] = useState([
    {
      id: 1,
      title: "New Volunteering Opportunity",
      text: "Join us for a new project aimed at helping the local community.",
    },
    {
      id: 2,
      title: "Event Reminder",
      text: "Don't miss the upcoming event next weekend!",
    },
    {
      id: 3,
      title: "Volunteer of the Month",
      text: "We are proud to announce our volunteer of the month!",
    },
  ]);

  return (
    <>
      <Banner
        backgroundImage={dashboardBannerImage}
        text={text}
        buttonText={buttonText}
        buttonLink={buttonLink}
      />

      <NewsBlock newsItems={newsItems} />
    </>
  );
};

export default DashboardPage;
