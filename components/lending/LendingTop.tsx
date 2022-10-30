import React from "react";
import { useSelector } from "react-redux";

import st from "./lendingTop.module.scss";
import PageTitle from "../reusables/PageTitle";
import PageDesc from "../reusables/PageDesc";
import Divider from "../reusables/Divider";
import Search from "./lendingTop/Search";
import BookItem from "./lendingTop/BookItem";
import BottomSpace from "../reusables/BottomSpace";
import { RootState } from "../../redux/store";

const LendingTop: React.FC = () => {
  const supporter = useSelector((state: RootState) => state.supporter);

  return (
    <main className={st.lendingTop}>
      <PageTitle title="貸出" />
      <PageDesc desc="本の貸し出し予約やリクエストを行えるよ。1人が一度に予約できるのは3冊までだよ。リクエストは一度に何冊でもできるよ。" />
      <Divider />

      <Search />

      <section className={st.bookListContainer}>
        {supporter.search.isLoading ? (
          <div>読み込み中</div>
        ) : supporter.search.books.length ? (
          supporter.search.books.map((el, i) => <BookItem book={el} key={i} />)
        ) : (
          <div>本が見つからないよ</div>
        )}
      </section>

      <BottomSpace />
    </main>
  );
};

export default LendingTop;
