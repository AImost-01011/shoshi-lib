import { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";

import MainNav from "../../../components/reusables/MainNav";
import HandTop from "../../../components/handover-return/HandTop";
import { RootState } from "../../../redux/store";
import { useGetUserByUserIdQuery } from "../../../redux/query/userQuery";
import { setUserId } from "../../../redux/supporterSlice";
import { useUser } from "@auth0/nextjs-auth0";
import NotLoggedIn from "../../../components/reusables/NotLoggedIn";

const HandoverReturn: NextPage<{ userId: string }> = (props) => {
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
  }, [data?.userName, dispatch, props.userId]);

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
          <title>しょしまる図書館-引継返却</title>
        </Head>

        <div style={{ overflow: supporter.isNavMove ? "hidden" : "scroll" }}>
          <MainNav />

          <HandTop />
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

export default HandoverReturn;
