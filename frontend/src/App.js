import React, { useEffect, useState, useContext } from "react";
import MyAppRouter from "./components/MyAppRouter";
import NavigationBar from "./components/Layout/Navbar/Navbar";
import Footer from "./components/Layout/Footer/Footer";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { ckeckStatus } from "./api/AuthAPI";
import { Spinner } from "react-bootstrap";
import { BrowserRouter } from "react-router-dom";

const App = observer(() => {
  const { user } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ckeckStatus()
      .then((data) => {
        user.setRoles(data.roles);
        user.setAuth(data.isAuthenticated);
        user.setUser(data.username);
        user.setId(data.id);
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  if (isLoading) {
    return (
      <div id="subsidiary-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <BrowserRouter>
        <NavigationBar />
        <main className="flex-grow-1">
          <MyAppRouter />
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
});

export default App;
