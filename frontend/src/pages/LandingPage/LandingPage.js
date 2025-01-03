import React, { useState, useEffect } from "react";
import Banner from "../../components/Sections/Banner/Banner";
import homeBannerImage from "../../assets/home_banner.png";
import Statistics from "../../components/Sections/Statistics/Statistics";
import { REGISTER_ROUTE } from "../../utils/routerConsts";
import { getAchievementSummary } from "../../api/StatisticsAPI";

// A starting page for unregistered users with some statistics data. Allows to go to login/register page from banner link
const LandingPage = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getAchievementSummary();
        setStatistics(data);
      } catch (err) {
        setError(
          err?.message ||
            "Failed to load statistics. Please try again later.Error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <>
      {/* Banner component with background image and call-to-action */}
      <Banner
        backgroundImage={homeBannerImage}
        text="Discover the best volunteering events near you!"
        buttonText="Join Us"
        buttonLink={REGISTER_ROUTE}
      />

      {/* Conditional rendering based on loading state or error */}
      {loading ? (
        <p className="text-center my-4">Loading statistics...</p>
      ) : error ? (
        <p className="text-center my-4 text-danger">{error}</p>
      ) : (
        <Statistics
          caption="We already have"
          text1={statistics.subsidiaries.title}
          text2={statistics.events.title}
          text3={statistics.users.title}
          num1={statistics.subsidiaries.count}
          num2={statistics.events.count}
          num3={statistics.users.count}
        />
      )}
    </>
  );
};

export default LandingPage;
