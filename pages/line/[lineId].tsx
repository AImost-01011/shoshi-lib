import React, { useEffect, useRef } from "react";
import { GetServerSideProps, NextPage } from "next";
import Cookies from "js-cookie";
import Link from "next/link";

import st from "../../styles/line/lineId.module.scss";

const LineId: NextPage<{ lineId: string }> = (props) => {
  const didEffect = useRef(false);

  useEffect(() => {
    if (!didEffect.current && props.lineId) {
      Cookies.set("lineId", props.lineId, { expires: 1 / 2 });
    }
  }, [props.lineId]);

  return (
    <>
      <main className={st.lineId}>
        <div className={st.titleContainer}>
          <span className={st.title}>Welcome to しょしまる図書館</span>
        </div>

        <div className={st.logo}>shoshimaru logo</div>

        <div className={st.talkContainer}>
          はじめまして！
          <br />
          ぼくしょしまるっていうんだ。
          <br />
          シャーレの星から来たそしまるの兄だよ。
          <br />
          そしまるがこっちでお邪魔しているって聞いて心配になって来ちゃった。
          <br />
          うちのそしまるが迷惑をかけていないかな？
          <br />
          まあ立ち話もなんだから
          <br />
          僕の図書館に入ってお話ししようよ。
          <br />
          Googleアカウントはもっているかな？
          <br />
          図書館に入るにはそれが必要なんだ。
        </div>

        <div className={st.btnContainer}>
          <Link href="/api/auth/login" passHref={true}>
            <button>図書館に入る</button>
          </Link>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = { lineId: "" };

  if (context.params && typeof context.params.lineId === "string") {
    props.lineId = context.params.lineId;
  }
  return { props: props };
};

export default LineId;
