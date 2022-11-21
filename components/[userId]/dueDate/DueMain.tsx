import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import st from "./dueMain.module.scss";
import { format } from "date-fns";
import ja from "date-fns/locale/ja";

import User from "../../reusables/User";
import PageTitle from "../../reusables/PageTitle";
import PageDesc from "../../reusables/PageDesc";
import Divider from "../../reusables/Divider";
import { RootState } from "../../../redux/store";
import { useGetUserByUserIdQuery } from "../../../redux/query/userQuery";
import Expansion from "./Expansion";
import { UserLending } from "../../../redux/globalType";
import BottomSpace from "../../reusables/BottomSpace";

const DueMain = () => {
  const [lending, setLending] = useState<UserLending[]>([]);

  const supporter = useSelector((state: RootState) => state.supporter);
  const { data, refetch } = useGetUserByUserIdQuery(supporter.userId, {
    skip: supporter.isSkip,
  });

  useEffect(() => {
    if (data?.lending.length) {
      const sortedLending = Array.from(data.lending).sort((a, b) => {
        const aDate = new Date(a.dueDate);
        const bDate = new Date(b.dueDate);
        if (aDate < bDate) return -1;
        if (aDate > bDate) return 1;
        return 0;
      });
      setLending([...sortedLending]);
    }
  }, [data?.lending]);

  return (
    <main className={st.dueMain}>
      <User />
      <PageTitle title="返却期限・貸出延長" />
      <PageDesc desc="一度に借りられるのは3冊までです。3冊借りている状態で本のリクエストが通っても借りることができません。返却処理が通った以降の本は借りることができます。" />

      {data?.lending.length === 3 ? (
        <span className={st.caution}>
          ！現在3冊借りているためリクエストした本を借りることができません。！
        </span>
      ) : (
        <div />
      )}

      <Divider />

      <div className={st.bookContainer}>
        {lending.length && data?.lending.length ? (
          lending.map((el, i) => (
            <div className={st.bookCard} key={i}>
              <div className={st.bookInfo}>
                <div className={st.bookPicture}></div>
                <div className={st.bookTitle}>
                  <span>{el.bookShortName}</span>
                </div>
                <div className={st.bookDue}>
                  <span>
                    {format(new Date(el.dueDate), "yyyy/MM/dd(E)まで", {
                      locale: ja,
                    })}
                  </span>
                </div>
              </div>

              <div className={st.expansionContainer}>
                <Expansion
                  lendingBook={el}
                  userId={data.userId}
                  refetch={refetch}
                />
              </div>
            </div>
          ))
        ) : (
          <div className={st.noItem}>借りている本はないよ</div>
        )}
      </div>

      <BottomSpace />
    </main>
  );
};

export default DueMain;
