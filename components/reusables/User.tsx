import React from "react";
import { useSelector } from "react-redux";
import { useGetUserByUserIdQuery } from "../../redux/query/userQuery";
import { RootState } from "../../redux/store";
import st from "./user.module.scss";

const User: React.FC = () => {
  const supporter = useSelector((state: RootState) => state.supporter);
  const { data, error, isFetching } = useGetUserByUserIdQuery(
    supporter.userId,
    { skip: supporter.isSkip }
  );

  return (
    <>
      {isFetching ? (
        <div>
          <div>now loading</div>
        </div>
      ) : (
        <div className={st.user}>
          <div>{data?.userName}</div>
        </div>
      )}
    </>
  );
};

export default User;
