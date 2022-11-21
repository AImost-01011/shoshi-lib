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
          toast("一度に借りられるのは3冊までです");
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
          <title>ログインし直してください</title>
        </Head>

        <NotLoggedIn />
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>しょしまる図書館-手打ちで引き継ぎ</title>
        </Head>
        <div style={{ overflow: supporter.isNavMove ? "hidden" : "scroll" }}>
          <MainNav />

          <main className={st.code}>
            <PageTitle title="手入力で引き継ぎ" />
            <PageDesc desc="表紙や裏表紙の裏にあるQRコード下に記載されている図書コードを入力しよう。" />
            <Divider />

            <div className={phase === 0 ? `${st.one} ${st.oneOpen}` : st.one}>
              <div className={st.title}>①</div>

              <div className={st.inputCard}>
                <div className={st.inputTitle}>図書コード</div>

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
                  決定
                </button>
                <Link href={`/${data?.userId}/home`} passHref={true}>
                  <button className={st.backBtn}>やっぱりやめる</button>
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

export default Code;
