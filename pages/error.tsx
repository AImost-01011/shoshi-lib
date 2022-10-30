import { NextPage } from "next";
import React, { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

const Error: NextPage = () => {
  const { error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!error) {
      router.back();
    }
  }, [error, router]);

  return <div>{error?.message}</div>;
};

export default Error;
