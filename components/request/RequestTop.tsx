import React from "react";
import st from "./requestTop.module.scss";

import User from "../reusables/User";
import PageTitle from "../reusables/PageTitle";
import PageDesc from "../reusables/PageDesc";
import Divider from "../reusables/Divider";
import BottomSpace from "../reusables/BottomSpace";
import RequestItem from "./requestTop/RequestItem";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useGetUserByUserIdQuery } from "../../redux/query/userQuery";

const RequestTop = () => {
  const supporter = useSelector((state: RootState) => state.supporter);
  const { data } = useGetUserByUserIdQuery(supporter.userId, {
    skip: supporter.isSkip,
  });

  return (
    <main className={st.requestTop}>
      <User />
      <PageTitle title="リクエスト中の本" />
      <PageDesc desc="今貸し出し中だけど返却されたら借りたい本をリクエストできるよ。" />
      <Divider />

      <div className={st.listContainer}>
        {data?.request.length ? (
          data?.request.map((el, i) => <RequestItem key={i} request={el} />)
        ) : (
          <div className={st.noItem}>リクエスト中の本はないよ</div>
        )}
      </div>

      <BottomSpace />
    </main>
  );
};

export default RequestTop;
