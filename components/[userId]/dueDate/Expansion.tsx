import React, { useState, useEffect, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import st from "./expansion.module.scss";
import { BookType, UserLending } from "../../../redux/globalType";

const Expansion: React.FC<{
  lendingBook: UserLending;
  userId: string;
  refetch: any;
}> = ({ lendingBook, userId, refetch }) => {
  const [expansionCode, setExpansionCode] = useState(0);

  const didEffect = useRef(false);

  useEffect(() => {
    if (!didEffect.current) {
      axios
        .get(`/api/book/read/bookId/${lendingBook.bookId}`)
        .then((item: AxiosResponse<BookType>) => {
          if (!item.data.requested.length) {
            const diffTime =
              new Date(lendingBook.dueDate).getTime() - new Date().getTime();
            const diffDay = diffTime / 1000 / 60 / 60 / 24;

            if (diffDay <= 3 && 0 <= diffDay) setExpansionCode(2);
            else if (diffDay < 0) setExpansionCode(3);
            else setExpansionCode(1);
          }
        });

      didEffect.current = true;
    }
  }, [lendingBook]);

  const expandClick = async () => {
    setExpansionCode(4);

    axios
      .post("/api/transaction/expandTerm", {
        userId: userId,
        bookId: lendingBook.bookId,
      })
      .then((item) => {
        if (item.status === 200) {
          setExpansionCode(1);
          toast("貸与期間が7日間延長されました。");
          refetch();
        } else {
          setExpansionCode(2);
          toast("延長申請中にエラーが起こりました。");
        }
      })
      .catch((err) => console.log(err));
  };

  if (expansionCode === 4) {
    return (
      <button className={st.loading} disabled={true}>
        読み込み中...
      </button>
    );
  } else if (expansionCode === 3) {
    return (
      <button className={st.expired} disabled={true}>
        貸出期限を過ぎています
      </button>
    );
  } else if (expansionCode === 2) {
    return (
      <button className={st.expansion} onClick={expandClick}>
        延長を申請する
      </button>
    );
  } else if (expansionCode === 1) {
    return (
      <button className={st.still} disabled={true}>
        延長申請は返却3日前からです
      </button>
    );
  } else {
    return (
      <button className={st.noExpansion} disabled={true}>
        他のリクエストがあるため延長ができません
      </button>
    );
  }
};

export default Expansion;
