import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthStore from "./store/AuthStore";
import SubsidiaryStore from "./store/SubsidiaryStore";
import AddressStore from "./store/AddressStore";
import MainOrganisationStore from "./store/MainOrganisationStore";
import MissionStore from "./store/MissionStore";
import EventStore from "./store/EventStore";
import EventTypeStore from "./store/EventTypeStore";
import NewsStore from "./store/NewsStore";
import CommentStore from "./store/CommentStore";

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Context.Provider
    value={{
      user: new AuthStore(),
      subsidiary: new SubsidiaryStore(),
      address: new AddressStore(),
      mission: new MissionStore(),
      mainOrganization: new MainOrganisationStore(),
      event: new EventStore(),
      eventType: new EventTypeStore(),
      news: new NewsStore(),
      comment: new CommentStore(),
    }}
  >
    <App />
  </Context.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
