import React from "react";
import Link from "next/link";
import st from "./homeTop.module.scss";
import User from "../reusables/User";
import ReturnTile from "./homeTop/ReturnTile";
import NewsTile from "./homeTop/NewsTile";
import RequestTile from "./homeTop/RequestTile";
import BottomSpace from "../reusables/BottomSpace";

const HomeTop: React.FC = () => {
  return (
    <main className={st.homeTop}>
      <User />

      <ReturnTile />
      {/* <NewsTile /> */}
      <RequestTile />

      <BottomSpace />
    </main>
  );
};

export default HomeTop;
