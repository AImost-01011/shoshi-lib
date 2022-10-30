import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetUserByUserIdQuery } from "../../../redux/query/userQuery";
import { RootState } from "../../../redux/store";

import st from "./requestTile.module.scss";

const RequestTile: React.FC = () => {
  const supporter = useSelector((state: RootState) => state.supporter);
  const { data } = useGetUserByUserIdQuery(supporter.userId, {
    skip: supporter.isSkip,
  });

  return (
    <div className={st.requestTile}>
      <div className={st.title}>リクエスト中</div>

      <div className={st.reqList}>
        {data?.request.length ? (
          data.request.map((el, i) => (
            <div className={st.listItem} key={i}>
              <div className={st.itemPicture}></div>
              <div className={st.itemTitle}>{el.bookShortName}</div>
            </div>
          ))
        ) : (
          <div className={st.noItem}>リクエスト中の本はないよ</div>
        )}

        <Link href={`/${data?.userId}/request`} passHref={true}>
          <button className={st.listBtn}>もっとみる▼</button>
        </Link>
      </div>
    </div>
  );
};

export default RequestTile;
