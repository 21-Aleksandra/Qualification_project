import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { publicRoutes, registeredRoutes } from "../allAppRoutes";
import { LANDING_ROUTE, DASHBOARD_ROUTE } from "../utils/routerConsts";
import UserRoles from "../utils/roleConsts";
import { Context } from "../index";

const MyAppRouter = observer(() => {
  const { user } = useContext(Context);
  console.log(user);

  const isAuth = user.isAuth;
  const userRole = Number(user.role);

  const hasPermission = (routeRoles) => {
    return routeRoles.includes(userRole);
  };

  const isBlocked = userRole === UserRoles.BLOCKED;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={isAuth && !isBlocked ? DASHBOARD_ROUTE : LANDING_ROUTE}
          />
        }
      />

      {publicRoutes.map(({ path, Component }, index) => (
        <Route key={index} path={path} element={<Component />} />
      ))}

      {isAuth &&
        !isBlocked &&
        registeredRoutes.map(({ path, Component, roles }, index) => (
          <Route
            key={index}
            path={path}
            element={
              hasPermission(roles) ? (
                <Component />
              ) : (
                <Navigate to={DASHBOARD_ROUTE} />
              )
            }
          />
        ))}

      {isBlocked && (
        <Route path="*" element={<Navigate to={LANDING_ROUTE} />} />
      )}

      <Route
        path="*"
        element={<Navigate to={isAuth ? DASHBOARD_ROUTE : LANDING_ROUTE} />}
      />
    </Routes>
  );
});

export default MyAppRouter;
