import React from "react";
import {
  Category,
  Create,
  Feed,
  NavBar,
  Search,
  UserProfile,
  VideoPinDetail,
} from "../Components";
import { Routes, Route } from "react-router-dom";
import { categories } from "../data";

const Home = ({ user, theme, handleThemeSwitch }) => {
  return (
    <>
      <div className="">
        <NavBar
          user={user}
          theme={theme}
          handleThemeSwitch={handleThemeSwitch}
        />
        <div className="flex flex-row">
          <div className="flex flex-col justify-start items-center w-20 sticky top-0 left-0">
            {categories &&
              categories.map((curElem) => {
                return <Category key={curElem.id} data={curElem} />;
              })}
          </div>

          <div className="flex w-full px-4">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/category/:categoryID" element={<Feed />} />
              <Route path="/create" element={<Create theme={theme} />} />
              <Route
                path="/videoDetail/:videoID"
                element={<VideoPinDetail />}
              />
              <Route path="/search" element={<Search />} />
              <Route path="/userDetail/:userId" element={<UserProfile />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
