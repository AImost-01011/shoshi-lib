import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import st from "../../styles/admin/return.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { useUser } from "@auth0/nextjs-auth0";
import { BookType } from "../../redux/globalType";
import PageTitle from "../../components/reusables/PageTitle";
import QrScanner from "../../components/reusables/QrScanner";
import axios, { AxiosResponse } from "axios";

const Return = () => {
  const [phase, setPhase] = useState(0);
  const [isFound, setIsFound] = useState(false);

  const [book, setBook] = useState<BookType>({
    bookId: "",
    bookName: "",
    bookShortName: "",
    lent: {
      lentDate: "",
      dueDate: "",
      userId: "",
      userName: "",
    },
    requested: [],
    property: {
      content: [],
      imagePath: "",
      tag: [],
      launch: "",
    },
    wanted: { userId: "", userName: "", wantedDate: "" },
  });

  const onScan = async (data: string | null) => {
    if (data) {
      const bookData = (await axios.get(
        `/api/book/read/bookId/${data}`
      )) as AxiosResponse<BookType>;

      if (bookData.data.lent.userId) {
        setBook(bookData.data);
        setIsFound(true);
        setPhase(1);
      } else {
        setIsFound(false);
        setPhase(1);
      }
    }
  };

  const backPhase = async () => {
    setTimeout(() => setIsFound(false), 1000);

    setBook({
      bookId: "",
      bookName: "",
      bookShortName: "",
      lent: {
        lentDate: "",
        dueDate: "",
        userId: "",
        userName: "",
      },
      requested: [],
      property: {
        content: [],
        imagePath: "",
        tag: [],
        launch: "",
      },
      wanted: { userId: "", userName: "", wantedDate: "" },
    });
    setPhase(0);
  };

  const desideReturn = () => {
    axios
      .post("/api/transaction/adminReturn", {
        userId: book.lent.userId,
        bookId: book.bookId,
      })
      .then(() => {
        setPhase(2);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>管理者-図書館返却</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={st.return}>
        <PageTitle title="返却" />

        <div className={phase === 0 ? `${st.one} ${st.oneOpen}` : st.one}>
          <div className={st.title}>①</div>

          <QrScanner isActive={phase === 0} onScan={onScan} />

          <div className={st.btnContainer}>
            <Link href="/admin/home" passHref={true}>
              <button>やめる</button>
            </Link>
          </div>
        </div>

        <div className={phase === 1 ? `${st.two} ${st.twoOpen}` : st.two}>
          <div className={st.title}>②</div>

          {isFound ? (
            <div className={st.succeeded}>
              <div className={st.scanCard}>
                <div className={st.bookTitle}>{book.bookName}</div>
                <div>{`前の所有者:${book.lent.userName}`}</div>
              </div>

              <div className={st.btnContainer}>
                <button onClick={desideReturn}>返却</button>
                <button onClick={backPhase}>もどる</button>
              </div>
            </div>
          ) : (
            <div className={st.failed}>
              <div className={st.errorCard}>
                <div className={st.error}>
                  該当の図書は見つかりませんでした。
                  <br />
                  または貸し出されていません
                </div>
              </div>

              <div className={st.btnContainer}>
                <button onClick={backPhase}>もう一度</button>
                <Link href="/admin/home" passHref={true}>
                  <button>やめる</button>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className={phase === 2 ? `${st.three} ${st.threeOpen}` : st.three}>
          <div className={st.title}>③</div>

          <div className={st.succeedCard}>
            <div>返却完了！</div>
          </div>

          <div className={st.btnContainer}>
            <button onClick={backPhase}>はじめから</button>
            <Link href="/admin/home" passHref={true}>
              <button>終了</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Return;