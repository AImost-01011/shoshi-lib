import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import st from "./mainNav.module.scss";

import upIcon from "../../public/up.png";
import requestIcon from "../../public/request.png";
import { RootState } from "../../redux/store";
import { toggleNav } from "../../redux/supporterSlice";
import { useGetUserByUserIdQuery } from "../../redux/query/userQuery";

const MainNav = () => {
  const supporter = useSelector((state: RootState) => state.supporter);
  const dispatch = useDispatch();
  const { data } = useGetUserByUserIdQuery(supporter.userId, {
    skip: supporter.isSkip,
  });

  const toggleOpen = () => {
    dispatch(toggleNav());
  };

  return (
    <nav
      className={
        supporter.isNavOpen ? `${st.mainNav} ${st.mainNavOpen}` : st.mainNav
      }
    >
      <section className={st.titleTop} onClick={toggleOpen}>
        <div className={st.upIcon}>
          <Image alt="up image" src={upIcon} />
        </div>
        <div className={st.titleContainer}>
          <div className={st.title}>しょしまる図書館</div>

          <Link href={`/${data?.userId}/request`}>
            <div className={st.bagContainer}>
              <div className={st.bagIcon}>
                <Image alt="bag icon" src={requestIcon} />
              </div>

              {data?.request.length ? (
                <div className={st.notiIcon}>
                  <div className={st.notiInner} />
                </div>
              ) : (
                <div />
              )}
            </div>
          </Link>
        </div>
      </section>

      <section className={st.navBody}>
        <div className={st.listContainer}>
          <div className={st.listTitle}>
            <span className={st.title}>貸出・返却</span>
            <div className={st.titleLine}></div>
          </div>

          <div className={st.rentalContainer}>
            <Link href={`/${data?.userId}/lending`} passHref={true}>
              <button onClick={toggleOpen}>貸出</button>
            </Link>

            <Link href={`/${data?.userId}/handoverReturn`} passHref={true}>
              <button onClick={toggleOpen}>引継返却</button>
            </Link>
          </div>
        </div>

        <div className={st.listContainer}>
          <div className={st.listTitle}>
            <span className={st.title}>マイページ</span>
            <div className={st.titleLine}></div>
          </div>

          <div className={st.myPageContainer}>
            <Link href={`/${data?.userId}/dueDate`} passHref={true}>
              <button onClick={toggleOpen}>返却期限</button>
            </Link>

            <Link href={`/${data?.userId}/request`} passHref={true}>
              <button onClick={toggleOpen}>リクエスト中</button>
            </Link>
          </div>
        </div>

        <div className={st.listContainer}>
          <div className={st.listTitle}>
            <span className={st.title}>ページ移動</span>
            <div className={st.titleLine}></div>
          </div>

          <div className={st.rentalContainer}>
            <Link href={`/${data?.userId}/home`} passHref={true}>
              <button onClick={toggleOpen}>ホームへ</button>
            </Link>

            <Link href="/api/auth/logout" passHref={true}>
              <button onClick={toggleOpen}>ログアウト</button>
            </Link>
          </div>
        </div>

        <div className={st.listContainer}>
          <button className={st.backBtn} onClick={toggleOpen}>
            ×
          </button>
        </div>
      </section>
    </nav>
  );
};

export default MainNav;
