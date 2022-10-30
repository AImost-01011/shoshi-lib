import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import st from "./mainNav.module.scss";

import upIcon from "../../public/up.png";
import requestIcon from "../../public/request.png";
import { RootState } from "../../redux/store";
import {
  openNav,
  closeNav,
  moveNav,
  stopNav,
} from "../../redux/supporterSlice";
import { useGetUserByUserIdQuery } from "../../redux/query/userQuery";

let navStart = 0;
let navEnd = 0;
let windowHeight = 0;

const MainNav = () => {
  const [navSwipe, setNavSwipe] = useState<number>(1000);

  const supporter = useSelector((state: RootState) => state.supporter);
  const dispatch = useDispatch();
  const { data, error, isFetching } = useGetUserByUserIdQuery(
    supporter.userId,
    { skip: supporter.isSkip }
  );

  useEffect(() => {
    windowHeight = window.innerHeight;
    setNavSwipe(windowHeight - 100);

    const checkTouchStart = (e: TouchEvent) => {
      navStart = e.touches[0].pageY;
      dispatch(moveNav());
    };

    const checkTouchEnd = () => {
      if (navStart - navEnd > 100 || navStart - navEnd < -100) {
        if (navStart < navEnd) {
          setNavSwipe(windowHeight - 100);
          dispatch(closeNav());
        } else {
          setNavSwipe(0);
          dispatch(openNav());
        }
      } else {
        if (navStart < navEnd) {
          setNavSwipe(0);
        } else {
          setNavSwipe(windowHeight - 100);
        }
      }

      dispatch(stopNav());
    };

    document
      .getElementById("topNav")
      ?.addEventListener("touchstart", checkTouchStart);
    document
      .getElementById("topNav")
      ?.addEventListener("touchmove", checkTouchMove);
    document
      .getElementById("topNav")
      ?.addEventListener("touchend", checkTouchEnd);

    return () => {
      document
        .getElementById("topNav")
        ?.removeEventListener("touchstart", checkTouchStart);
      document
        .getElementById("topNav")
        ?.removeEventListener("touchmove", checkTouchMove);
      document
        .getElementById("topNav")
        ?.removeEventListener("touchend", checkTouchEnd);
    };
  }, [dispatch]);

  const checkTouchMove = (e: TouchEvent) => {
    const touchY = e.changedTouches[0].pageY;

    switch (true) {
      case touchY < 0:
        setNavSwipe(0);
        navEnd = 0;
        break;
      case 0 <= touchY && touchY <= windowHeight - 100:
        setNavSwipe(touchY);
        navEnd = touchY;
        break;
      case windowHeight - 100 < touchY:
        setNavSwipe(windowHeight - 100);
        navEnd = windowHeight - 100;
        break;
      default:
        break;
    }
  };

  const closeNavigation = () => {
    dispatch(closeNav());
    setNavSwipe(windowHeight - 100);
  };

  return (
    <nav
      className={
        supporter.isNavOpen ? `${st.mainNav} ${st.mainNavOpen}` : st.mainNav
      }
      style={{
        top: `${navSwipe}px`,
        transition: supporter.isNavMove
          ? "0s"
          : "0.4s cubic-bezier(0.22,0.61,0.36,1)",
        height: `${windowHeight}px`,
      }}
    >
      <section className={st.titleTop} id="topNav">
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
              <button>貸出</button>
            </Link>

            <Link href={`/${data?.userId}/handoverReturn`} passHref={true}>
              <button>引継返却</button>
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
              <button>返却期限</button>
            </Link>

            {/* <Link href={`/${data?.userId}/news`} passHref={true}>
              <button>おしらせ</button>
            </Link> */}

            <Link href={`/${data?.userId}/request`} passHref={true}>
              <button>リクエスト中</button>
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
              <button>ホームへ</button>
            </Link>

            <Link href="/api/auth/logout" passHref={true}>
              <button>ログアウト</button>
            </Link>
          </div>
        </div>

        <div className={st.listContainer}>
          <button className={st.backBtn} onClick={closeNavigation}>
            ×
          </button>
        </div>
      </section>
    </nav>
  );
};

export default MainNav;
