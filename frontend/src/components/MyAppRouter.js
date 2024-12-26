import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { publicRoutes, registeredRoutes } from "../allAppRoutes";
import { LANDING_ROUTE, DASHBOARD_ROUTE } from "../utils/routerConsts";
import UserRoles from "../utils/roleConsts";
import { Context } from "../index";

const MyAppRouter = observer(() => {
  const { user } = useContext(Context);
  //console.log(user);

  const isAuth = user.isAuth;
  const userRoles = user.roles;

  // Helper function to check if the user has one of the required roles to access a route
  const hasPermission = (routeRoles) => {
    return routeRoles.some((role) => userRoles.includes(role));
  };

  const isBlocked = userRoles.includes(UserRoles.BLOCKED);

  return (
    <Routes>
      {/* Default route: redirects to either dashboard or landing page based on authentication and block status */}
      {/* If the user is authenticated and not blocked, they go to the dashboard. Otherwise, they are redirected to the landing page */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuth && !isBlocked ? DASHBOARD_ROUTE : LANDING_ROUTE}
          />
        }
      />

      {/* Mapping through public routes (accessible by all users including unauthenticated ones) */}
      {publicRoutes.map(({ path, Component }, index) => (
        <Route key={index} path={path} element={<Component />} />
      ))}

      {/* Rendering registered routes (only accessible to authenticated users who are not blocked) */}
      {isAuth &&
        !isBlocked &&
        registeredRoutes.map(({ path, Component, roles }, index) => (
          <Route
            key={index}
            path={path}
            element={
              hasPermission(roles) ? ( // Check if the user has permission to access the route based on their roles
                <Component />
              ) : (
                <Navigate to={DASHBOARD_ROUTE} />
              )
            }
          />
        ))}

      {/* If the user is blocked, they are redirected to the landing page for any route */}
      {isBlocked && (
        <Route path="*" element={<Navigate to={LANDING_ROUTE} />} />
      )}
      {/* Catch-all(fallback) route: redirects the user to either the dashboard (if authenticated) or the landing page (if unauthenticated) */}
      <Route
        path="*"
        element={<Navigate to={isAuth ? DASHBOARD_ROUTE : LANDING_ROUTE} />}
      />
    </Routes>
  );
});

export default MyAppRouter;
