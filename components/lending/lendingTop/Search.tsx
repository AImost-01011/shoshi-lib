import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import st from "./search.module.scss";
import { searchByTagId } from "../../../redux/supporterSlice";

const tagArr = [
  { tagId: "s00", tagName: "貸与可能", tagType: "s" },
  { tagId: "s01", tagName: "リクエストあり", tagType: "s" },
  { tagId: "s02", tagName: "貸出中", tagType: "s" },
  { tagId: "u00", tagName: "一般", tagType: "u" },
  { tagId: "u01", tagName: "CBT", tagType: "u" },
  { tagId: "u02", tagName: "OSCE", tagType: "u" },
  { tagId: "u03", tagName: "国試", tagType: "u" },
  { tagId: "d00", tagName: "消化器", tagType: "d" },
  { tagId: "d01", tagName: "循環器", tagType: "d" },
  { tagId: "d02", tagName: "代謝・内分泌", tagType: "d" },
  { tagId: "d03", tagName: "腎・泌尿器", tagType: "d" },
  { tagId: "d04", tagName: "免疫・膠原病", tagType: "d" },
  { tagId: "d05", tagName: "血液", tagType: "d" },
  { tagId: "d06", tagName: "感染症", tagType: "d" },
  { tagId: "d07", tagName: "呼吸器", tagType: "d" },
  { tagId: "d08", tagName: "神経", tagType: "d" },
  { tagId: "d09", tagName: "精神", tagType: "d" },
  { tagId: "d10", tagName: "中毒・麻酔", tagType: "d" },
  { tagId: "d11", tagName: "小児", tagType: "d" },
  { tagId: "d12", tagName: "産婦人・乳腺", tagType: "d" },
  { tagId: "d13", tagName: "眼", tagType: "d" },
  { tagId: "d14", tagName: "耳・鼻・咽喉", tagType: "d" },
  { tagId: "d15", tagName: "整形", tagType: "d" },
  { tagId: "d16", tagName: "皮膚", tagType: "d" },
  { tagId: "d17", tagName: "放射線", tagType: "d" },
  { tagId: "d18", tagName: "公衆衛生", tagType: "d" },
  { tagId: "d19", tagName: "基礎", tagType: "d" },
  { tagId: "d20", tagName: "分類不能", tagType: "d" },
];

const stateArr = tagArr.filter((el) => el.tagType === "s");
const usageArr = tagArr.filter((el) => el.tagType === "u");
const departmentArr = tagArr.filter((el) => el.tagType === "d");

const Search: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOption, setSearchOption] = useState<{
    state: string[];
    usage: string[];
    department: string[];
  }>({
    state: ["s00", "s01", "s02"],
    usage: ["u00", "u01", "u02", "u03"],
    department: [
      "d00",
      "d01",
      "d02",
      "d03",
      "d04",
      "d05",
      "d06",
      "d07",
      "d08",
      "d09",
      "d10",
      "d11",
      "d12",
      "d13",
      "d14",
      "d15",
      "d16",
      "d17",
      "d18",
      "d19",
      "d20",
    ],
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      searchByTagId({
        state: searchOption.state,
        usage: searchOption.usage,
        department: searchOption.department,
      })
    );
  }, [dispatch, searchOption]);

  const stateCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchOption.state.includes(e.target.value)) {
      setSearchOption((prevState) => {
        const newState = prevState.state.filter((el) => el !== e.target.value);
        return {
          state: newState,
          usage: prevState.usage,
          department: prevState.department,
        };
      });
    } else {
      setSearchOption((prevState) => {
        return {
          state: [...prevState.state, e.target.value],
          usage: prevState.usage,
          department: prevState.department,
        };
      });
    }
  };

  const usageCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchOption.usage.includes(e.target.value)) {
      setSearchOption((prevState) => {
        const newUsage = prevState.usage.filter((el) => el !== e.target.value);
        return {
          state: prevState.state,
          usage: newUsage,
          department: prevState.department,
        };
      });
    } else {
      setSearchOption((prevState) => {
        return {
          state: prevState.state,
          usage: [...prevState.usage, e.target.value],
          department: prevState.department,
        };
      });
    }
  };

  const departCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchOption.department.includes(e.target.value)) {
      setSearchOption((prevState) => {
        const newDepart = prevState.department.filter(
          (el) => el !== e.target.value
        );
        return {
          state: prevState.state,
          usage: prevState.usage,
          department: newDepart,
        };
      });
    } else {
      setSearchOption((prevState) => {
        return {
          state: prevState.state,
          usage: prevState.usage,
          department: [...prevState.department, e.target.value],
        };
      });
    }
  };

  const checkClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.currentTarget.value === "check") {
      setSearchOption({
        state: ["s00", "s01", "s02"],
        usage: ["u00", "u01", "u02", "u03"],
        department: [
          "d00",
          "d01",
          "d02",
          "d03",
          "d04",
          "d05",
          "d06",
          "d07",
          "d08",
          "d09",
          "d10",
          "d11",
          "d12",
          "d13",
          "d14",
          "d15",
          "d16",
          "d17",
          "d18",
          "d19",
          "d20",
        ],
      });
    } else {
      setSearchOption({
        state: [],
        usage: [],
        department: [],
      });
    }
  };

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <section className={st.search}>
      <div className={st.titleContainer}>
        <span>本の検索</span>
      </div>

      <div
        className={
          isOpen
            ? `${st.bodyContainer} ${st.bodyContainerOpen}`
            : st.bodyContainer
        }
      >
        <div className={st.cateContainer}>
          <div className={st.cateTitleContainer}>
            <span className={st.title}>貸出状況</span>
            <div className={st.divider}></div>
          </div>

          <div className={st.cateItemList}>
            {stateArr.map((el, i) => (
              <div className={st.cateItemContainer} key={i}>
                <input
                  type="checkbox"
                  id={el.tagId}
                  value={el.tagId}
                  className={st.cateCheck}
                  onChange={stateCheck}
                  checked={searchOption.state.some((item) => item === el.tagId)}
                />
                <label htmlFor={el.tagId} className={st.cateItem}>
                  <span>{el.tagName}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className={st.cateContainer}>
          <div className={st.cateTitleContainer}>
            <span className={st.title}>用途</span>
            <div className={st.divider}></div>
          </div>

          <div className={st.cateItemList}>
            {usageArr.map((el, i) => (
              <div className={st.cateItemContainer} key={i}>
                <input
                  type="checkbox"
                  id={el.tagId}
                  value={el.tagId}
                  className={st.cateCheck}
                  checked={searchOption.usage.includes(el.tagId)}
                  onChange={usageCheck}
                />
                <label htmlFor={el.tagId} className={st.cateItem}>
                  <span>{el.tagName}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className={st.cateContainer}>
          <div className={st.cateTitleContainer}>
            <span className={st.title}>科目</span>
            <div className={st.divider}></div>
          </div>

          <div className={st.cateItemList}>
            {departmentArr.map((el, i) => (
              <div className={st.cateItemContainer} key={i}>
                <input
                  type="checkbox"
                  id={el.tagId}
                  value={el.tagId}
                  className={st.cateCheck}
                  checked={searchOption.department.includes(el.tagId)}
                  onChange={departCheck}
                />
                <label htmlFor={el.tagId} className={st.cateItem}>
                  <span>{el.tagName}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className={st.checkBtnContainer}>
          <button className={st.checkBtn} value="check" onClick={checkClick}>
            はじめから
          </button>
          <button
            className={st.checkOutBtn}
            value="unCheck"
            onClick={checkClick}
          >
            チェックをはずす
          </button>
        </div>
      </div>

      <div
        className={
          isOpen ? `${st.btnContainer} ${st.btnContainerOpen}` : st.btnContainer
        }
      >
        <button className={st.openBtn} onClick={toggleOpen}></button>
      </div>
    </section>
  );
};

export default Search;
