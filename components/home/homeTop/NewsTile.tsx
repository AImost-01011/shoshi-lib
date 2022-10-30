import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";

import { useGetUserByUserIdQuery } from "../../../redux/query/userQuery";
import { RootState } from "../../../redux/store";
import st from "./newsTile.module.scss";

const NewsTile: React.FC = () => {
  const supporter = useSelector((state: RootState) => state.supporter);
  const { data } = useGetUserByUserIdQuery(supporter.userId, {
    skip: supporter.isSkip,
  });

  return (
    <div className={st.newsTile}>
      <div className={st.title}>おしらせ</div>

      <div className={st.innerList}>
        {data?.news.length ? (
          data.news.map((el, i) => (
            <div className={st.listItem} key={i}>
              <div className={st.listTitleContainer}>
                <div className={st.itemPoint}></div>
                <span className={st.itemTitle}>{el.title}</span>
              </div>

              <div className={st.listContentContainer}>
                <span className={st.itemContent}>{el.content}</span>
                <span className={st.itemDay}>
                  {format(new Date(el.timestamp), "yyyy/MM/dd")}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className={st.noItem}>おしらせはないよ</div>
        )}

        <Link href={`/${data?.userId}/news`} passHref={true}>
          <button className={st.listBtn}>もっとみる▼</button>
        </Link>
      </div>
    </div>
  );
};

export default NewsTile;
