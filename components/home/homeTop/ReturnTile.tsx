import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import ja from "date-fns/locale/ja";

import { useGetUserByUserIdQuery } from "../../../redux/query/userQuery";
import { RootState } from "../../../redux/store";
import st from "./returnTile.module.scss";

const ReturnTile: React.FC = () => {
  const supporter = useSelector((state: RootState) => state.supporter);
  const { data } = useGetUserByUserIdQuery(supporter.userId, {
    skip: supporter.isSkip,
  });

  return (
    <div className={st.returnTile}>
      <div className={st.title}>返却期限・貸出延長</div>

      <div className={st.innerList}>
        {data?.lending.length ? (
          data?.lending.map((el, i) => (
            <div className={st.listItem} key={i}>
              <div className={st.listTitleContainer}>
                <div className={st.itemPoint}></div>
                <span className={st.itemTitle}>{el.bookShortName}</span>
              </div>
              <div className={st.listContentContainer}>
                <div className={st.itemContent}></div>
                <span className={st.itemDay}>
                  {format(new Date(el.dueDate), "~yyyy/MM/dd(E)", {
                    locale: ja,
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className={st.noItem}>借りている本はないよ</div>
        )}

        <Link href={`/${data?.userId}/dueDate`} passHref={true}>
          <button className={st.listBtn}>もっとみる▼</button>
        </Link>
      </div>
    </div>
  );
};

export default ReturnTile;
