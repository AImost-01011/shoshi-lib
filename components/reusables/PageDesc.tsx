import React from "react";
import st from "./pageDesc.module.scss";

const PageDesc: React.FC<{ desc: string }> = ({ desc }) => {
  return (
    <div className={st.pageDesc}>
      <span>{desc}</span>
    </div>
  );
};

export default PageDesc;
