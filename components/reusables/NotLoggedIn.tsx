import React from "react";
import st from "./notLoggedIn.module.scss";
import Link from "next/link";

const NotLoggedIn: React.FC = () => {
  return (
    <div className={st.notLoggedIn}>
      <div className={st.container}>
        <div className={st.title}>
          あなたはログアウトした状態です。
          <br />
          ログインしてください
        </div>
        <Link href="/api/auth/login" passHref={true}>
          <button className={st.loginBtn}>ログイン画面へ</button>
        </Link>
      </div>
    </div>
  );
};

export default NotLoggedIn;
