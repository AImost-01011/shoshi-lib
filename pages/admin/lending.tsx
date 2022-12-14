import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useUser } from "@auth0/nextjs-auth0";
import { format } from "date-fns";
import st from "../../styles/admin/lending.module.scss";
import PageTitle from "../../components/reusables/PageTitle";
import axios, { AxiosResponse } from "axios";
import { BookType, UserType } from "../../redux/globalType";
import { toast } from "react-toastify";
import db from "../../utils/db";
import QrReader from "../../components/reusables/QrReader";

const Lending = () => {
  const [phase, setPhase] = useState(0);
  const [isFound, setIsFound] = useState(false);
  const [cardCord, setCardCord] = useState(0);

  const [users, setUsers] = useState<UserType[]>([]);
  const [book, setBook] = useState<BookType>({
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
  const [lendingUserId, setLendingUserId] = useState("");
  const [lendingDueDate, setLendingDueDate] = useState("");
  const [confirmed, setConfirmed] = useState({
    bookName: "",
    userName: "",
    due: "",
  });

  const backPhase = async () => {
    setTimeout(() => setCardCord(0), 1000);
    setLendingUserId("");
    setLendingDueDate("");
    setBook({
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
    setPhase(0);
  };

  const onScan = async (data: string | null) => {
    if (data) {
      axios
        .get(`/api/book/read/bookId/${data}`)
        .then((doc: AxiosResponse<BookType>) => {
          if (doc.data.lent.lentState === 0 && !doc.data.requested.length) {
            // 現在予約がない&&リクエストが入っていない
            axios
              .get("/api/user/get")
              .then((item: AxiosResponse<UserType[]>) => {
                const safeUser = item.data.filter(
                  (el) => el.lending.length <= 2
                );
                setUsers(safeUser);
                setLendingUserId(safeUser[0].userId);
                setBook(doc.data);
                setCardCord(1);
                setPhase(1);
              })
              .catch((err) => console.log(err));
          } else if (doc.data.lent.lentState === 1) {
            // 現在予約が入っている
            axios
              .get(`/api/user/get/userId/${doc.data.lent.userId}`)
              .then((item: AxiosResponse<UserType>) => {
                setUsers([item.data]);
                setLendingUserId(item.data.userId);
                setBook(doc.data);
                setCardCord(2);
                setPhase(1);
              });
          } else {
            setCardCord(0);
            setPhase(1);
          }
        })
        .catch((err) => {
          setPhase(1);
        });
    }
  };

  const lendingUserChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setLendingUserId(e.target.value);

  const lendingDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLendingDueDate(e.target.value);

  const desideLending = () => {
    if (lendingDueDate && lendingUserId) {
      axios
        .post("/api/transaction/adminLending", {
          userId: lendingUserId,
          bookId: book?.bookId,
          bookShortName: book?.bookShortName,
          dueDate: lendingDueDate,
        })
        .then(
          (
            doc: AxiosResponse<{
              bookName: string;
              userName: string;
              due: string;
            }>
          ) => {
            setConfirmed(doc.data);
            setPhase(2);
          }
        )
        .catch((err) => {
          console.log(err);

          toast("エラーが発生しました。");
        });
    } else {
      toast("userIdとdueDate入力してください");
    }
  };

  return (
    <>
      <Head>
        <title>管理者-図書館貸出</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={st.lending}>
        <PageTitle title="貸出" />

        <div className={phase === 0 ? `${st.one} ${st.oneOpen}` : st.one}>
          <div className={st.title}>①</div>

          {phase === 0 ? <QrReader onScan={onScan} /> : <div />}

          <div className={st.btnContainer}>
            <Link href="/admin/home" passHref={true}>
              <button>やめる</button>
            </Link>
          </div>
        </div>

        <div className={phase === 1 ? `${st.two} ${st.twoOpen}` : st.two}>
          <div className={st.title}>②</div>

          {cardCord === 0 ? (
            <div className={st.failed}>
              <div className={st.errorCard}>
                <div className={st.error}>
                  該当の図書は見つかりませんでした。またはすでに貸し出されています。
                </div>
              </div>

              <div className={st.btnContainer}>
                <button onClick={backPhase}>もう一度</button>
                <Link href="/admin/home" passHref={true}>
                  <button>やめる</button>
                </Link>
              </div>
            </div>
          ) : cardCord === 1 ? (
            <div className={st.succeeded}>
              <div className={st.scanCard}>
                <div className={st.bookTitle}>{book?.bookName}</div>

                <select
                  name=""
                  id=""
                  className={st.lendingUser}
                  onChange={lendingUserChange}
                >
                  {users.map((el, i) => (
                    <option value={el.userId} key={i}>
                      {el.userName}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  name=""
                  id=""
                  onChange={lendingDueDateChange}
                  className={st.lendingDate}
                />
              </div>

              <div className={st.btnContainer}>
                <button onClick={desideLending}>貸出する</button>
                <button onClick={backPhase}>やめる</button>
              </div>
            </div>
          ) : (
            <div className={st.succeeded}>
              <div className={st.scanCard}>
                <div className={st.bookTitle}>{`${book?.bookName}-予約`}</div>

                <select
                  name=""
                  id=""
                  className={st.lendingUser}
                  onChange={lendingUserChange}
                >
                  {users.map((el, i) => (
                    <option value={el.userId} key={i}>
                      {el.userName}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  name=""
                  id=""
                  onChange={lendingDueDateChange}
                  className={st.lendingDate}
                />
              </div>

              <div className={st.btnContainer}>
                <button onClick={desideLending}>貸出する</button>
                <button onClick={backPhase}>やめる</button>
              </div>
            </div>
          )}

          {/* {isFound ? (
            <div className={st.succeeded}>
              <div className={st.scanCard}>
                <div className={st.bookTitle}>{book?.bookName}</div>

                <select
                  name=""
                  id=""
                  className={st.lendingUser}
                  onChange={lendingUserChange}
                >
                  {users.map((el, i) => (
                    <option value={el.userId} key={i}>
                      {el.userName}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  name=""
                  id=""
                  onChange={lendingDueDateChange}
                  className={st.lendingDate}
                />
              </div>

              <div className={st.btnContainer}>
                <button onClick={desideLending}>貸出する</button>
                <button onClick={backPhase}>やめる</button>
              </div>
            </div>
          ) : (
            <div className={st.failed}>
              <div className={st.errorCard}>
                <div className={st.error}>
                  該当の図書は見つかりませんでした。またはすでに貸し出されています。
                </div>
              </div>

              <div className={st.btnContainer}>
                <button onClick={backPhase}>もう一度</button>
                <Link href="/admin/home" passHref={true}>
                  <button>やめる</button>
                </Link>
              </div>
            </div>
          )} */}
        </div>

        <div className={phase === 2 ? `${st.three} ${st.threeOpen}` : st.three}>
          <div className={st.title}>③</div>

          <div className={st.succeedCard}>
            <div className={st.bookTitle}>{confirmed.bookName}</div>
            <div className={st.lendingUser}>{confirmed.userName}</div>
            <div className={st.lendingDate}>
              {format(
                confirmed.due ? new Date(confirmed.due) : new Date(),
                "yyyy/MM/ddまで"
              )}
            </div>
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

export default Lending;
