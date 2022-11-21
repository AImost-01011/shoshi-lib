import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { format } from "date-fns";

import "react-toastify/dist/ReactToastify.css";
import st from "./bookItem.module.scss";
import upIcon from "../../../public/up.png";
import { BookType } from "../../../redux/globalType";
import BookBtn from "./bookItem/BookBtn";

const BookItem: React.FC<{ book: BookType }> = ({ book }) => {
  const [isOpen, setIsOpen] = useState(false);

  const detailRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className={st.bookItem}>
      <div className={st.bookInfoContainer}>
        <div className={st.bookPic}></div>
        <div className={st.title}>{book.bookShortName}</div>
        <div className={st.resBtn}>
          <BookBtn book={book} />
        </div>
      </div>

      <div
        className={st.bookDetailContainer}
        style={{
          height: isOpen ? `${detailRef.current?.clientHeight}px` : `0px`,
        }}
      >
        <div ref={detailRef}>
          <div className={st.detailTitleContainer}>
            <div className={st.detailTitle}>リクエスト</div>
            <div className={st.detailTitle}>追加日</div>
            <div className={st.detailTitle}>タグ</div>
          </div>

          <div className={st.detailDataContainer}>
            <div className={st.detailData}>{`${book.requested.length}人`}</div>
            <div className={st.detailData}>
              {format(new Date(book.property.launch), "yyyy/MM/dd")}
            </div>
            <div className={st.detailData}>
              {book.property.tag.map((el, i) => (
                <span className={st.tags} key={i}>{`#${el.tagName}`}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={st.controllContainer}>
        <button onClick={toggleOpen}>
          <div
            className={
              isOpen ? `${st.openIcon} ${st.openIconOpen}` : st.openIcon
            }
          >
            <Image alt="up icon" src={upIcon} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default BookItem;
