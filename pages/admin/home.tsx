import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import axios, { AxiosResponse } from "axios";
import { format } from "date-fns";

import st from "../../styles/admin/home.module.scss";
import { BookType } from "../../redux/globalType";

const Home = () => {
  const [books, setBooks] = useState<BookType[]>([]);

  useEffect(() => {
    axios
      .get("/api/book/read")
      .then((doc: AxiosResponse<BookType[]>) => {
        const sortedBooks = doc.data.sort((a, b) => {
          const aDate = new Date(a.lent.dueDate);

          const bDate = new Date(b.lent.dueDate);
          if (aDate < bDate) return -1;
          if (aDate > bDate) return 1;
          return 0;
        });
        setBooks(sortedBooks);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Head>
        <title>管理者-図書館エントランス</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={st.home}>
        <div className={st.titleContainer}>
          <div className={st.title}>管理者ページです</div>
        </div>

        <div className={st.btnContainer}>
          <Link href="/admin/lending" passHref={true}>
            <button>貸出処理</button>
          </Link>

          <Link href="/admin/return" passHref={true}>
            <button>返却処理</button>
          </Link>

          <Link href="/api/auth/logout" passHref={true}>
            <button>ログアウト</button>
          </Link>
        </div>

        <div className={st.lendingBoard}>
          <div className={st.titleContainer}>
            <div className={st.title}>貸出状況</div>
          </div>

          <div className={st.lendingList}>
            {books.map((el, i) => {
              const timeDiff =
                new Date(el.lent.dueDate).getTime() - new Date().getTime();
              const isError = timeDiff / (60 * 60 * 1000 * 24) < 3;

              if (el.lent.dueDate) {
                return (
                  <div
                    className={`${st.listItem} ${isError ? st.listError : ""}`}
                    key={i}
                  >
                    <div className={st.listTitle}>{el.lent.userName}</div>
                    <div className={st.listDate}>
                      {format(new Date(el.lent.dueDate), "~yyyy/MM/dd")}
                    </div>
                    <div className={st.listBook}>{el.bookShortName}</div>
                  </div>
                );
              } else {
                return <div key={i} />;
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
