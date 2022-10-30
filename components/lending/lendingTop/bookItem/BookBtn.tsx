import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios, { AxiosResponse } from "axios";

import { BookType } from "../../../../redux/globalType";
import { useGetUserByUserIdQuery } from "../../../../redux/query/userQuery";
import { RootState } from "../../../../redux/store";
import st from "./bookBtn.module.scss";

const BookBtn: React.FC<{ book: BookType }> = ({ book }) => {
  const [stateCode, setStateCode] = useState(0);
  const supporter = useSelector((state: RootState) => state.supporter);

  const { data, refetch } = useGetUserByUserIdQuery(supporter.userId, {
    skip: supporter.isSkip,
  });

  useEffect(() => {
    let judgeArr: string[] = [];
    const lendingUserId = book.lent.userId;

    data?.lending.forEach((el) => judgeArr.push(el.bookId));
    data?.request.forEach((el) => judgeArr.push(el.bookId));
    data?.want.forEach((el) => judgeArr.push(el.bookId));

    if (judgeArr.includes(book.bookId)) setStateCode(1);
    else if (lendingUserId || book.wanted.userId) setStateCode(2);
    else setStateCode(3);
  }, [
    book.bookId,
    book.lent.userId,
    book.wanted.userId,
    data?.lending,
    data?.request,
    data?.want,
  ]);

  const requestClick = async () => {
    setStateCode(4);

    axios
      .post("/api/transaction/userRequest", {
        userId: data?.userId,
        bookId: book.bookId,
      })
      .then((item: AxiosResponse<{ bookName: string }>) => {
        setStateCode(1);
        toast(`「${item.data.bookName}」をリクエストしました。`);
        return refetch();
      })
      .catch((err) => console.log(err));
  };

  const reserveClick = async () => {
    setStateCode(4);

    axios
      .post("/api/transaction/userWant", {
        userId: data?.userId,
        bookId: book.bookId,
      })
      .then((item) => {
        if (item.data.isOk) {
          setStateCode(1);
          toast(`「${item.data.bookName}」をリクエストしました。`);
          refetch();
        } else {
          setStateCode(3);
          toast(item.data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  switch (stateCode) {
    case 0:
      return (
        <button className={`${st.bookBtn} ${st.notAvailable}`} disabled={true}>
          利用できません
        </button>
      );

    case 1:
      return (
        <button className={`${st.bookBtn} ${st.requested}`} disabled={true}>
          貸出・リクエスト中です
        </button>
      );

    case 2:
      return (
        <button
          className={`${st.bookBtn} ${st.request}`}
          onClick={requestClick}
        >
          リクエストする
        </button>
      );

    case 3:
      return (
        <button
          className={`${st.bookBtn} ${st.preserve}`}
          onClick={reserveClick}
        >
          予約する
        </button>
      );

    case 4:
      return (
        <button className={`${st.bookBtn} ${st.notAvailable}`} disabled={true}>
          読み込み中
        </button>
      );

    default:
      return (
        <button className={`${st.bookBtn} ${st.notAvailable}`} disabled={true}>
          利用できません
        </button>
      );
  }

  //   return <button className={st.bookBtn}>予約する</button>;
};

export default BookBtn;
