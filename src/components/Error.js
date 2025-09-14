import React from "react";
import { useRouteError } from "react-router";

const Error = () => {
  const error = useRouteError();
  return (
    <div>
      <p>error</p>
      <p>{error.message}</p>
    </div>
  );
};

export default Error;
