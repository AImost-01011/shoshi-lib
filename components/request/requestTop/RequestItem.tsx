import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { UserRequest } from "../../../redux/globalType";
import { useGetUserByUserIdQuery } from "../../../redux/query/userQuery";
import { RootState } from "../../../redux/store";
import st from "./requestItem.module.scss";

const RequestItem: React.FC<{ request: UserRequest }> = ({ request }) => {
  const [isOpen, setIsOpen] = useState(false);

  const supporter = useSelector((state: RootState) => state.supporter);
  const { data, refetch } = useGetUserByUserIdQuery(supporter.userId, {
    skip: supporter.isSkip,
  });

  const toggleDelete = () => {
    setIsOpen((prevState) => (prevState ? false : true));
  };

  const cancelClick = () => {
    axios
      .post("/api/transaction/userRequestCancel", {
        userId: data?.userId,
        bookId: request.bookId,
      })
      .then((item) => {
        setIsOpen(false);
        if (item.data.isOk) {
          toast(`「${item.data.message}」のリクエストをキャンセルしました。`);
          return refetch();
        } else toast(item.data.message);
      })
      .catch((err) => {
        console.log(err);

        toast(
          "リクエストのキャンセル中にエラーが発生しました。今のキャンセルは無効です。"
        );
        return refetch();
      });
  };

  return (
    <div className={st.requestItem}>
      <div className={st.bookInfo}>
        <div className={st.bookPicture}></div>

        <div className={st.bookTitle}>
          <div>{request.bookName}</div>
        </div>
      </div>

      <div
        className={
          isOpen
            ? st.requestController
            : `${st.requestController} ${st.requestControllerOpen}`
        }
      >
        <button value={0} onClick={toggleDelete}>
          リクエストをやめる
        </button>
      </div>

      <div
        className={
          isOpen
            ? `${st.deleteController} ${st.deleteControllerOpen}`
            : st.deleteController
        }
      >
        <div className={st.deleteMessage}>
          <span>本当にリクエストをやめる？</span>
        </div>

        <div className={st.confirmController}>
          <button className={st.yes} onClick={cancelClick}>
            はい
          </button>
          <button className={st.no} value={0} onClick={toggleDelete}>
            いいえ
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestItem;
