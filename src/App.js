import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Container/Home";
import Login from "./Container/Login";
import { fetchUser, userAccessToken } from "./utils/fetchUser";

const App = () => {
  const getTheme = () => {
    const applicableTheme = localStorage.getItem("ApplicableTheme");
    return applicableTheme || "light"; // Default to "light" if no theme is found
  };

  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(getTheme()); // Initialize with saved theme
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("ApplicableTheme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const accessToken = userAccessToken();
    if (!accessToken) {
      navigate("/login", { replace: true });
    } else {
      const [userInfo] = fetchUser();
      setUser(userInfo);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <main
      className={`min-h-screen h-full bg-${theme === "dark" ? "slate-950" : "white"} text-${
        theme === "dark" ? "white" : "black"
      } h-full`}
    >
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          path="/*"
          element={
            <Home
              user={user}
              theme={theme}
              handleThemeSwitch={handleThemeSwitch}
            />
          }
        />
      </Routes>
    </main>
  );
};

export default App;
