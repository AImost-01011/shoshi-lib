import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";
import { useUser } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";

import { RootState } from "../../redux/store";
import { useGetUserByUserIdQuery } from "../../redux/query/userQuery";
import { setUserId } from "../../redux/supporterSlice";
import MainNav from "../../components/reusables/MainNav";
import LendingTop from "../../components/lending/LendingTop";
import NotLoggedIn from "../../components/reusables/NotLoggedIn";

const Lending = (props: { userId: string }) => {
  const didEffect = useRef(false);
  const supporter = useSelector((state: RootState) => state.supporter);
  const dispatch = useDispatch();
  const userController = useUser();
  const { data } = useGetUserByUserIdQuery(props.userId, {
    skip: supporter.isSkip,
  });

  useEffect(() => {
    if (props.userId && !didEffect.current) {
      didEffect.current = true;
      dispatch(setUserId(props.userId));
    }
  }, [dispatch, props.userId]);

  if (!userController.user) {
    return (
      <>
        <Head>
          <title>ログインし直してください</title>
        </Head>

        <NotLoggedIn />
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>{`しょしまる図書館-貸出`}</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div style={{ overflow: supporter.isNavMove ? "hidden" : "scroll" }}>
          <MainNav />

          <LendingTop />
        </div>
      </>
    );
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = { userId: "" };

  if (context.params && typeof context.params.userId === "string") {
    props.userId = context.params.userId;
  }
  return { props: props };
};

export default Lending;
