import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { RiVideoUploadFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";

const Navbar = ({ user, theme, handleThemeSwitch }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleToggleSearch = () => {
    setToggleSearch(!toggleSearch);
  };

  return (
    <main className="w-full bg-white dark:bg-slate-950 dark:text-white flex flex-row justify-between py-3 px-8 sticky top-0 left-0 z-50">
      {/* Large screen logo */}
      <div className="hidden sm:flex items-center">
        <Link to={"/"}>
          <h1 className="font-bold text-xl sm:text-4xl font-satisfy bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">Stream Verse</h1>
        </Link>
      </div>

      {/* Mobile view Logo */}
      {!toggleSearch && (
        <div className="md:hidden flex items-center">
          <Link to={"/"}>
            <h1 className="font-bold font-satisfy bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">Stream Verse</h1>
          </Link>
          <div
            className="flex md:hidden items-center ml-8"
            onClick={handleToggleSearch}
          >
            <BiSearchAlt size={25} />
          </div>
        </div>
      )}

      {/* Mobile Search */}
      {toggleSearch && (
        <div className="md:hidden w-full flex flex-row rounded-lg">
          <input
            type="text"
            placeholder="Search..."
            className={`outline-none border-2 w-full rounded-l-full px-5 py-2 ${theme === "dark" ? "bg-slate-900" : ""}`}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
          <button
            className="bg-blue-500 px-3 py-1 text-white font-semibold text-sm mx-1 rounded-r-full"
            onClick={() => setToggleSearch(false)}
          >
            Back
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div
        className={`hidden sm:flex flex-row space-x-4 border-2 border-gray-300 items-center py-1 px-3 rounded-xl ${
          theme === "dark" ? "bg-slate-800" : ""
        }`}
      >
        <BiSearchAlt size={25} />
        <input
          type="text"
          placeholder="Search..."
          className={`w-[60vw] outline-none px-3 ${
            theme === "dark" ? "bg-slate-800" : ""
          }`}
        />
      </div>

      {/* Right side view */}
      <div className="hidden sm:flex flex-row items-center space-x-8">
        {/* Theme Switch */}
        <button onClick={handleThemeSwitch}>
          {theme === "dark" ? (
            <BsSunFill size={25} />
          ) : (
            <BsMoonStarsFill size={25} />
          )}
        </button>

        {/* Create Video */}
        <Link to={"/create"}>
          <RiVideoUploadFill
            size={25}
            className="shadow-xl hover:animate-bounce duration-300"
          />
        </Link>

        {/* User Profile Menu */}
        <div className="relative inline-block text-left" ref={menuRef}>
          <button className="focus:outline-none" onClick={toggleMobileMenu}>
            <img
              src={user?.photoURL}
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </button>
          {isMobileMenuOpen && (
            <div className="lg:flex origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <Link to={`/userDetail/${user?.uid}`}>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none">
                    My Account
                  </button>
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login", { replace: true });
                  }}
                >
                  Logout
                  <IoLogOut className="ml-2 inline-block" fontSize={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile view right side */}
      {!toggleSearch && (
        <div className="md:hidden flex flex-row items-center space-x-8">
          <button onClick={handleThemeSwitch}>
            {theme === "dark" ? (
              <BsSunFill size={25} />
            ) : (
              <BsMoonStarsFill size={25} />
            )}
          </button>
          <Link to={"/create"}>
            <RiVideoUploadFill
              size={25}
              className="shadow-xl hover:animate-bounce duration-300"
            />
          </Link>
          <div className="relative inline-block text-left" ref={menuRef}>
            <button className="focus:outline-none" onClick={toggleMenu}>
              <img
                src={user?.photoURL}
                alt="User Avatar"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </button>
            {isMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <Link to={`/userDetail/${user?.uid}`}>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none">
                      My Account
                    </button>
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                    onClick={() => {
                      localStorage.clear();
                      navigate("/login", { replace: true });
                    }}
                  >
                    Logout
                    <IoLogOut className="ml-2 inline-block" fontSize={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Navbar;
