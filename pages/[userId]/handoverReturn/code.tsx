import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { format } from "date-fns";
import axios, { AxiosResponse } from "axios";

import st from "../../../styles/handover-return/code.module.scss";
import MainNav from "../../../components/reusables/MainNav";
import { RootState } from "../../../redux/store";
import PageTitle from "../../../components/reusables/PageTitle";
import PageDesc from "../../../components/reusables/PageDesc";
import Divider from "../../../components/reusables/Divider";
import BottomSpace from "../../../components/reusables/BottomSpace";
import { useGetUserByUserIdQuery } from "../../../redux/query/userQuery";
import { setUserId } from "../../../redux/supporterSlice";
import { BookType, UserLending } from "../../../redux/globalType";
import { toast } from "react-toastify";
import { useUser } from "@auth0/nextjs-auth0";
import NotLoggedIn from "../../../components/reusables/NotLoggedIn";

const Code: NextPage<{ userId: string }> = (props) => {
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState(0);
  const [cardCord, setCardCord] = useState(0);
  const [gotBook, setGotBook] = useState<BookType>({
    bookId: "",
    bookName: "",
    bookShortName: "",
    lent: {
      lentDate: "",
      dueDate: "",
      userId: "",
      userName: "",
      lentState: 0,
    },
    requested: [],
    property: {
      content: [],
      imagePath: "",
      tag: [],
      launch: "",
    },
  });
  const [handoverBook, setHandoverBook] = useState<UserLending>({
    bookId: "",
    bookName: "",
    bookShortName: "",
    dueDate: "0",
    lendDate: "",
  });

  const didEffect = useRef(false);
  const supporter = useSelector((state: RootState) => state.supporter);
  const dispatch = useDispatch();
  const userController = useUser();
  const { data, refetch } = useGetUserByUserIdQuery(props.userId, {
    skip: supporter.isSkip,
  });

  useEffect(() => {
    if (props.userId && !didEffect.current) {
      didEffect.current = true;
      dispatch(setUserId(props.userId));
    }

    refetch();
  }, [data?.userName, dispatch, props.userId, handoverBook, refetch]);

  const codeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCode(e.target.value);

  const codeClick = () => {
    setCode("");
    axios
      .get(`/api/book/read/bookId/${code}`)
      .then((item: AxiosResponse<BookType>) => {
        if (item.data.lent.userId && data?.userId) {
          const requestedArr: string[] = [];
          item.data.requested.forEach((el) => requestedArr.push(el.userId));

          if (requestedArr.includes(data.userId)) {
            setGotBook(item.data);
            setPhase(1);
            setCardCord(1);
          } else {
            setCardCord(2);
            setPhase(1);
          }
        } else {
          setCardCord(2);
          setPhase(1);
        }
      })
      .catch((err) => {
        setCardCord(0);
        setPhase(1);
      });
  };

  const handoverClick = () => {
    axios
      .post("/api/transaction/userReturn", {
        bookId: gotBook.bookId,
        returnUserId: gotBook.lent.userId,
        lendUserId: data?.userId,
      })
      .then((item: AxiosResponse<{ isOk: boolean; book: UserLending }>) => {
        if (item.data.isOk) {
          setHandoverBook(item.data.book);
          setPhase(2);
          return refetch();
        } else {
          setPhase(0);
          toast("??????????????????????????????3???????????????");
        }
      })
      .catch((err) => console.log(err));
  };

  const backPhase = () => {
    setCode("");
    setPhase(0);
  };

  if (!userController.user) {
    return (
      <>
        <Head>
          <title>????????????????????????????????????</title>
        </Head>

        <NotLoggedIn />
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>????????????????????????-????????????????????????</title>
        </Head>
        <div style={{ overflow: supporter.isNavMove ? "hidden" : "scroll" }}>
          <MainNav />

          <main className={st.code}>
            <PageTitle title="????????????????????????" />
            <PageDesc desc="?????????????????????????????????QR????????????????????????????????????????????????????????????????????????" />
            <Divider />

            <div className={phase === 0 ? `${st.one} ${st.oneOpen}` : st.one}>
              <div className={st.title}>???</div>

              <div className={st.inputCard}>
                <div className={st.inputTitle}>???????????????</div>

                <div className={st.inputContainer}>
                  <input
                    type="text"
                    className={st.typeInput}
                    onChange={codeChange}
                    value={code}
                  />
                </div>
              </div>

              <div className={st.btnContainer}>
                <button onClick={codeClick} className={st.goBtn}>
                  ??????
                </button>
                <Link href={`/${data?.userId}/home`} passHref={true}>
                  <button className={st.backBtn}>?????????????????????</button>
                </Link>
              </div>
            </div>

            <div className={phase === 1 ? `${st.two} ${st.twoOpen}` : st.two}>
              <div className={st.title}>???</div>

              {cardCord === 0 ? (
                <div className={st.resultContainer}>
                  <div className={`${st.resultCard} ${st.rejectCard}`}>
                    <div className={st.rejectMessage}>
                      ???????????????????????????????????????
                    </div>
                  </div>

                  <div className={st.rejectBtnContainer}>
                    <button className={st.confirm} onClick={backPhase}>
                      ????????????
                    </button>
                    <Link href={`/${data?.userId}/home`} passHref={true}>
                      <button className={st.reject}>?????????????????????</button>
                    </Link>
                  </div>
                </div>
              ) : cardCord === 1 ? (
                <div className={st.resultContainer}>
                  <div className={`${st.resultCard} ${st.bookCard}`}>
                    <div className={st.result}>
                      <div className={st.resultImg}></div>
                      <div className={st.resultTitle}>{gotBook.bookName}</div>
                      <div
                        className={st.resultOwner}
                      >{`??????????????????: ${gotBook.lent.userName}`}</div>
                    </div>
                  </div>

                  <div className={st.question}>
                    ?????????????????????????????????????????????
                  </div>

                  <div className={st.btnContainer}>
                    <button className={st.confirm} onClick={handoverClick}>
                      ??????
                    </button>
                    <button className={st.reject} onClick={backPhase}>
                      ?????????
                    </button>
                  </div>
                </div>
              ) : (
                <div className={st.resultContainer}>
                  <div className={`${st.resultCard} ${st.rejectCard}`}>
                    <div className={st.rejectMessage}>
                      ???????????????????????????????????????????????????
                    </div>
                  </div>

                  <div className={st.rejectBtnContainer}>
                    <button className={st.confirm} onClick={backPhase}>
                      ????????????
                    </button>
                    <Link href={`/${data?.userId}/home`} passHref={true}>
                      <button className={st.reject}>?????????????????????</button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div
              className={phase === 2 ? `${st.three} ${st.threeOpen}` : st.three}
            >
              <div className={st.title}>???</div>

              <div className={st.succeedContainer}>
                <div className={st.succeedCard}>
                  <div className={st.message}>????????????????????????????????????</div>

                  <div>{`???????????????${format(
                    new Date(handoverBook.dueDate),
                    "yyyy???MM???dd???"
                  )}?????????`}</div>
                </div>

                <div className={st.btnContainer}>
                  <Link href={`/${data?.userId}/home`} passHref={true}>
                    <button>?????????</button>
                  </Link>
                </div>
              </div>
            </div>

            <BottomSpace />
          </main>
        </div>
      </>
    );
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = { userId: "" };

  if (context.params && typeof context.params.userId === "string") {
    props.userId = context.params.userId;
  }
  return { props: props };
};

export default Code;
