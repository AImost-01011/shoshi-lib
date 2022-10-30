import React from "react";
import st from "./handTop.module.scss";
import Link from "next/link";

import PageTitle from "../reusables/PageTitle";
import PageDesc from "../reusables/PageDesc";
import Divider from "../reusables/Divider";
import BottomSpace from "../reusables/BottomSpace";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useGetUserByUserIdQuery } from "../../redux/query/userQuery";

const HandTop: React.FC = () => {
  const supporter = useSelector((state: RootState) => state.supporter);
  const { data } = useGetUserByUserIdQuery(supporter.userId, {
    skip: supporter.isSkip,
  });

  return (
    <main className={st.handTop}>
      <PageTitle title="引継返却" />
      <PageDesc desc="貸出中の本にリクエストがあったらリクエスト者に直接本を引き継ぐことができるよ。カメラを使って本のQRコードを読むか、管理コードを打ち込むことで引き継げるよ。通常返却の場合は管理者か返却ポストに返却してね。" />
      <Divider />

      <div className={st.selectContainer}>
        <Link href={`/${data?.userId}/handoverReturn/camera`} passHref={true}>
          <button>カメラを使って引き継ぎ</button>
        </Link>

        <Link href={`/${data?.userId}/handoverReturn/code`} passHref={true}>
          <button>コード手入力で引き継ぎ</button>
        </Link>
      </div>

      <div>
        <div>
          ※カメラを使って引き継ぎを行う際カメラの権限を許可する必要があります。
        </div>
      </div>

      <BottomSpace />
    </main>
  );
};

export default HandTop;
