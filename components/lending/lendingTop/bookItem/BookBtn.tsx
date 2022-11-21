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
    if (
      book.lent.userId === data?.userId ||
      book.requested.some((element) => element.userId === data?.userId)
    )
      setStateCode(1);
    else if (book.lent.lentState >= 1) setStateCode(2);
    else setStateCode(3);
  }, [book.lent.lentState, book.lent.userId, book.requested, data?.userId]);

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
      .catch((err) => {
        console.log(err);

        setStateCode(2);
        toast(`リクエスト中にエラーが発生しました。今のリクエストは無効です。`);

        return refetch();
      });
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
          toast(`「${item.data.bookName}」を予約しました。`);
          refetch();
        } else {
          setStateCode(3);
          toast(item.data.message);
        }
      })
      .catch((err) => {
        console.log(err);

        setStateCode(3);
        toast(`予約中にエラーが発生しました。今の予約は無効です。`);

        return refetch();
      });
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
};

export default BookBtn;
