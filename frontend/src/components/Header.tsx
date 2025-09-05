import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import useAuthStore from "../store/AuthStore";
import { CgProfile } from "react-icons/cg";
import logoImg from "/logo-glowtime.png";

export default function Header() {
  const navigate = useNavigate();
  const [navVisible, setNavVisible] = useState(false);
  const { user, logoutService } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 760) {
        setNavVisible(true);
      } else {
        setNavVisible(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function slideToggle() {
    if (window.innerWidth < 760) setNavVisible(!navVisible);
  }

  function handleLogout() {
    logoutService();
    navigate({ to: "/login" });
  }

  return (
    <header className="fixed top-0 left-0 z-[99] w-screen bg-[#202020] py-5 px-7">
      <div className="md:flex justify-between">
        <div className="md:flex">
          <div className="flex justify-between">
            <Link to="/">
              <div className="flex">
                <img src={logoImg} alt="" className="w-[30px] h-auto" />
                <div className="hidden md:block pl-1 text-cyan-300 font-bold mr-2 text-center py-2 md:py-1">
                  GlowTime
                </div>
              </div>
            </Link>
            <button
              id="hamburger-menu"
              className="text-3xl md:hidden text-[#8778D7]"
              onClick={slideToggle}
            >
              &#x2630;
            </button>
          </div>
          <div
            className={`${navVisible ? "visible" : ""} md:flex`}
            id="main-nav"
          >
            <Link onClick={slideToggle} to="/about">
              <div className="mx-2 text-center py-2 md:py-1 hover:text-cyan-300 transition-all ease-in-out duration-300">
                About
              </div>
            </Link>
            <Link onClick={slideToggle} to="/contact">
              <div className="mx-2 text-center py-2 md:py-1 hover:text-cyan-300 transition-all ease-in-out duration-300">
                Contact
              </div>
            </Link>
            {!user && (
              <Link onClick={slideToggle} to="/login">
                <div className="md:hidden mx-2 text-center py-2 hover:text-cyan-300 transition-all ease-in-out duration-300">
                  Login
                </div>
              </Link>
            )}
            {!user && (
              <Link onClick={slideToggle} to="/signup">
                <div className="md:hidden mx-2 text-center py-2">Signup</div>
              </Link>
            )}
            {user && (
              <Link onClick={slideToggle} to="/dashboard">
                <div className="md:hidden mx-2 text-center py-2 hover:text-cyan-300 transition-all ease-in-out duration-300">
                  Dashboard
                </div>
              </Link>
            )}
            {user && (
              <div
                onClick={handleLogout}
                className="md:hidden mx-2 text-center py-2 hover:text-cyan-300 transition-all ease-in-out duration-300 cursor-pointer"
              >
                Logout
              </div>
            )}
          </div>
        </div>
        <div className="md:flex">
          {!user && (
            <Link to="/login">
              <div className="hidden md:block mx-2 text-center py-2 md:py-1 hover:text-cyan-300 transition-all ease-in-out duration-300">
                Login
              </div>
            </Link>
          )}
          {!user && (
            <Link to="/signup">
              <div className="hidden md:block mx-2 text-center py-1 px-3 border border-cyan-300 text-cyan-300 rounded hover:bg-cyan-300 hover:text-black ease-in-out duration-300">
                Signup
              </div>
            </Link>
          )}
          {user && (
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="hidden md:flex cursor-pointer"
            >
              <CgProfile size={25} className="" />
              <div className="ml-2 text-xl">{user && user.email}</div>
            </div>
          )}
        </div>
        {showMenu && (
          <div className="absolute top-[70px] right-[100px] mx-2 py-2 md:py-1 bg-[#202020]">
            <Link
              to="/dashboard"
              className="py-2 md:py-1 hover:text-cyan-300 transition-all ease-in-out duration-300 cursor-pointer"
            >
              Dashboard
            </Link>
            <div
              onClick={handleLogout}
              className="py-2 md:py-1 hover:text-cyan-300 transition-all ease-in-out duration-300 cursor-pointer"
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
