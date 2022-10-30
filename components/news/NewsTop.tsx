import React from "react";
import { useState } from "react";

import st from "./newsTop.module.scss";
import User from "../reusables/User";
import PageTitle from "../reusables/PageTitle";
import PageDesc from "../reusables/PageDesc";
import Divider from "../reusables/Divider";

const NewsTop = () => {
  const [isOpen, setIsOpen] = useState([false]);

  const toggleDelete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const target = parseInt(e.currentTarget.value);

    setIsOpen((prevState) => {
      const newState = [...prevState];
      newState[target] = newState[target] ? false : true;
      return newState;
    });
  };

  return (
    <main className={st.newsTop}>
      <User />
      <PageTitle title="おしらせ" />
      <PageDesc desc="貸し出ししている本の返却の催促や貸出準備完了の連絡がここに集まるよ" />
      <Divider />

      <div className={st.division}></div>

      <div className={st.newsContainer}>
        <div className={st.newsCard}>
          <div className={st.newsMain}>
            <div className={st.newsTitle}>
              ~2022/11/06 返却期限が近づいてきています。
            </div>
            <div className={st.newsTime}>2022/11/06</div>
            <div className={st.newsContent}>
              クエスチョン・バンク 消化器内科
              ボリューム1の返却期限が近づいてきています。
            </div>
          </div>

          <div
            className={
              isOpen[0]
                ? st.newsController
                : `${st.newsController} ${st.newsControllerOpen}`
            }
          >
            <button className={st.deleteBtn} value={0} onClick={toggleDelete}>
              消去する
            </button>
          </div>

          <div
            className={
              isOpen[0]
                ? `${st.confirmContainerOpen} ${st.confirmContainer}`
                : st.confirmContainer
            }
          >
            <div className={st.confirmMessage}>
              <span>本当に消去する？</span>
            </div>

            <div className={st.confirmController}>
              <button className={st.yes}>はい</button>
              <button className={st.no} value={0} onClick={toggleDelete}>
                いいえ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={st.bottomSpace}></div>
    </main>
  );
};

export default NewsTop;
