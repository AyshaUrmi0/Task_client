import React from "react";
import useAuth from "../hooks/useAuth";
import ViewAllTask from "../components/ViewAllTask";

const Home = () => {
  return (
    <div>
      <ViewAllTask></ViewAllTask>
    </div>
  );
};

export default Home;
