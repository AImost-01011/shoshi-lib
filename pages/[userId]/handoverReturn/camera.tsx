import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import st from "../../../styles/handover-return/camera.module.scss";
import axios, { AxiosResponse } from "axios";
import { format } from "date-fns";

import MainNav from "../../../components/reusables/MainNav";
import { RootState } from "../../../redux/store";
import PageTitle from "../../../components/reusables/PageTitle";
import PageDesc from "../../../components/reusables/PageDesc";
import Divider from "../../../components/reusables/Divider";
import BottomSpace from "../../../components/reusables/BottomSpace";
import { useGetUserByUserIdQuery } from "../../../redux/query/userQuery";
import { BookType, UserLending, UserType } from "../../../redux/globalType";
import { setUserId } from "../../../redux/supporterSlice";
import { toast } from "react-toastify";
import { useUser } from "@auth0/nextjs-auth0";
import NotLoggedIn from "../../../components/reusables/NotLoggedIn";
import QrReader from "../../../components/reusables/QrReader";

const Camera: NextPage<{ userId: string }> = (props) => {
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

  const backPhase = () => {
    setPhase(0);
  };

  const qrScan = (e: string | null) => {
    if (e) {
      axios
        .get(`/api/book/read/bookId/${e}`)
        .then((item: AxiosResponse<BookType>) => {
          if (item.data.lent.lentState === 2) {
            // まだ貸し出している
            if (item.data.lent.userId !== data?.userId) {
              // 貸出先が引き継ぎユーザーでない
              const priorityUser = item.data.requested.find((el) => {
                const priorityArr: number[] = item.data.requested.map(
                  (element) => element.priority
                );
                if (data) {
                  if (data.lending.length <= 2) {
                    return el.priority === Math.min(...priorityArr);
                  } else return false;
                } else return false;
              });

              if (
                data?.request.some(
                  (element) => element.bookId === item.data.bookId
                ) &&
                priorityUser?.userId === data.userId
              ) {
                // 引き継ぎユーザーがリクエストしている&&優先度最上位
                setGotBook(item.data);
                setCardCord(1);
                setPhase(1);
              } else {
                // 引き継ぎユーザーがリクエストしていない
                setCardCord(2);
                setPhase(1);
              }
            } else {
              // 貸出先が引き継ぎユーザーである
              setCardCord(2);
              setPhase(1);
            }
          } else {
            // 貸し出していない
            setCardCord(2);
            setPhase(1);
          }
        })
        .catch((err) => {
          setCardCord(0);
          setPhase(1);
        });
    }
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
          toast("一度に借りられるのは3冊までです");
        }
      })
      .catch((err) => console.log(err));
  };

  if (!userController.user) {
    return (
      <>
        <Head>
          <title>ログインし直してください</title>
        </Head>

        <NotLoggedIn />
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>しょしまる図書館-カメラで引き継ぎ</title>
        </Head>
        <div style={{ overflow: supporter.isNavMove ? "hidden" : "scroll" }}>
          <MainNav />

          <main className={st.camera}>
            <PageTitle title="カメラで引き継ぎ" />
            <PageDesc desc="※カメラで引き継ぎするにはカメラの権限を許可する必要があります。" />
            <Divider />

            <div className={phase === 0 ? `${st.one} ${st.oneOpen}` : st.one}>
              <div className={st.title}>①</div>

              {phase === 0 ? (
                <div className={st.cameraContainer}>
                  <QrReader onScan={qrScan} />
                </div>
              ) : (
                <div />
              )}

              <div className={st.cameraDesc}>
                管理用QRコードをかざしてください。
              </div>

              <div className={st.returnBtnContainer}>
                <Link href={`/${data?.userId}/home`} passHref={true}>
                  <button>やっぱりやめる</button>
                </Link>
              </div>
            </div>

            <div className={phase === 1 ? `${st.two} ${st.twoOpen}` : st.two}>
              <div className={st.title}>②</div>

              {cardCord === 0 ? (
                <div className={st.resultContainer}>
                  <div className={`${st.resultCard} ${st.rejectCard}`}>
                    <div className={st.rejectMessage}>
                      本が見つかりませんでした。
                    </div>
                  </div>

                  <div className={st.rejectBtnContainer}>
                    <button className={st.confirm} onClick={backPhase}>
                      もう一度
                    </button>
                    <Link href={`/${data?.userId}/home`} passHref={true}>
                      <button className={st.reject}>やっぱりやめる</button>
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
                      >{`前のオーナー: ${gotBook.lent.userName}`}</div>
                    </div>
                  </div>

                  <div className={st.question}>
                    引き継ぎするのはこの本ですか？
                  </div>

                  <div className={st.btnContainer}>
                    <button className={st.confirm} onClick={handoverClick}>
                      はい
                    </button>
                    <button className={st.reject} onClick={backPhase}>
                      いいえ
                    </button>
                  </div>
                </div>
              ) : (
                <div className={st.resultContainer}>
                  <div className={`${st.resultCard} ${st.rejectCard}`}>
                    <div className={st.rejectMessage}>
                      この本を引き継ぐ権利がありません。
                    </div>
                  </div>

                  <div className={st.rejectBtnContainer}>
                    <button className={st.confirm} onClick={backPhase}>
                      もう一度
                    </button>
                    <Link href={`/${data?.userId}/home`} passHref={true}>
                      <button className={st.reject}>やっぱりやめる</button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div
              className={phase === 2 ? `${st.three} ${st.threeOpen}` : st.three}
            >
              <div className={st.title}>③</div>

              <div className={st.succeedContainer}>
                <div className={st.succeedCard}>
                  <div className={st.message}>引き継ぎが完了しました！</div>

                  <div>{`返却期限は${format(
                    new Date(handoverBook.dueDate),
                    "yyyy年MM月dd日"
                  )}です。`}</div>
                </div>

                <div className={st.btnContainer}>
                  <Link href={`/${data?.userId}/home`} passHref={true}>
                    <button>もどる</button>
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

export default Camera;
