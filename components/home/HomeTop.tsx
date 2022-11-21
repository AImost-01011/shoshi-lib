import React from "react";
import st from "./homeTop.module.scss";
import User from "../reusables/User";
import ReturnTile from "./homeTop/ReturnTile";
import RequestTile from "./homeTop/RequestTile";
import BottomSpace from "../reusables/BottomSpace";

const HomeTop: React.FC = () => {
  return (
    <main className={st.homeTop}>
      <User />

      <ReturnTile />
      <RequestTile />

      <BottomSpace />
    </main>
  );
};

export default HomeTop;
