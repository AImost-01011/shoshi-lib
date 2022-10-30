import React from "react";
import st from "./pageTitle.module.scss";

const PageTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className={st.pageTitle}>
      <span>{title}</span>
    </div>
  );
};

export default PageTitle;
