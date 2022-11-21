import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import st from "./bottomSpace.module.scss";

const BottomSpace: React.FC = () => {
  const supporter = useSelector((state: RootState) => state.supporter);

  return (
    <div
      className={
        supporter.isNavOpen
          ? `${st.bottomSpace} ${st.bottomSpaceOpen}`
          : st.bottomSpace
      }
    />
  );
};

export default BottomSpace;
