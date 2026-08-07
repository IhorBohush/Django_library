import { Link } from "react-router-dom";
import {
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";

import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axios";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const navbarRef = useRef(null);
  const desktopCategoriesRef = useRef(null);
  const mobileCategoriesRef = useRef(null);

  const { user, logout } = useContext(AuthContext);

  // Закриття меню при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedDesktopCategories =
        desktopCategoriesRef.current?.contains(event.target);

      const clickedMobileCategories =
        mobileCategoriesRef.current?.contains(event.target);

      // Закриваємо категорії при кліку
      // в будь-якому місці поза ними
      if (
        !clickedDesktopCategories &&
        !clickedMobileCategories
      ) {
        setCategoriesOpen(false);
      }

      // Якщо клік повністю поза Navbar —
      // закриваємо також burger menu
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Завантаження категорій
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories/");

        setCategories(res.data.results);
      } catch (error) {
        console.error(
          "Помилка завантаження категорій:",
          error
        );
      }
    };

    fetchCategories();
  }, []);

  const closeMenus = () => {
    setMobileOpen(false);
    setCategoriesOpen(false);
  };

  const handleLogout = () => {
    closeMenus();
    logout();
  };

  return (
    <nav
      ref={navbarRef}
      className="
        fixed
        top-0
        left-0
        w-full
        bg-slate-900
        text-white
        shadow-md
        z-50
      "
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ================= TOP ================= */}

        <div className="flex justify-between items-center py-4">

          <h1 className="text-xl font-bold">
            LIBRARY
          </h1>

          {/* ================= DESKTOP ================= */}

          <div className="hidden md:flex gap-6 items-center">

            {/* Категорії */}
            <div
              ref={desktopCategoriesRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setCategoriesOpen((prev) => !prev)
                }
                className="
                  cursor-pointer
                  hover:text-sky-400
                  transition
                "
              >
                Категорії ▾
              </button>

              {categoriesOpen && (
                <div
                  className="
                    absolute
                    top-10
                    left-0
                    z-50
                    bg-white
                    text-black
                    rounded-xl
                    shadow-xl
                    p-4
                    flex
                    flex-col
                    gap-2
                    min-w-55
                  "
                >
                  <Link
                    to="/books"
                    onClick={closeMenus}
                    className="hover:text-sky-600"
                  >
                    Всі книги
                  </Link>

                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/books?category=${category.id}`}
                      onClick={closeMenus}
                      className="hover:text-sky-600"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about-us"
              onClick={() => setCategoriesOpen(false)}
              className="hover:text-sky-400 transition"
            >
              Про нас
            </Link>

            <Link
              to="/contacts"
              onClick={() => setCategoriesOpen(false)}
              className="hover:text-sky-400 transition"
            >
              Контакти
            </Link>

            {/* User */}
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setCategoriesOpen(false)}
                  className="hover:text-sky-400 transition"
                >
                  Твій профіль, {user.first_name}!
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    px-5
                    py-2
                    rounded-xl
                    font-semibold
                    transition
                    shadow-lg
                  "
                >
                  Вийти
                </button>
              </>
            ) : (
              <Link
                to="/login/"
                onClick={closeMenus}
                className="
                  bg-sky-500
                  hover:bg-sky-600
                  text-white
                  px-5
                  py-2
                  rounded-xl
                  font-semibold
                  transition
                  shadow-lg
                "
              >
                Увійти
              </Link>
            )}
          </div>

          {/* ================= BURGER ================= */}

          <button
            type="button"
            onClick={() => {
              setMobileOpen((prev) => !prev);
              setCategoriesOpen(false);
            }}
            className="
              md:hidden
              relative
              w-8
              h-8
              flex
              items-center
              justify-center
            "
            aria-label={
              mobileOpen
                ? "Закрити меню"
                : "Відкрити меню"
            }
            aria-expanded={mobileOpen}
          >
            <div className="relative w-7 h-5">

              {/* Верхня лінія */}
              <span
                className={`
                  absolute
                  left-0
                  w-full
                  h-0.5
                  bg-white
                  rounded
                  transition-all
                  duration-300
                  ${
                    mobileOpen
                      ? "top-2 rotate-45"
                      : "top-0"
                  }
                `}
              />

              {/* Середня лінія */}
              <span
                className={`
                  absolute
                  left-0
                  top-2
                  w-full
                  h-0.5
                  bg-white
                  rounded
                  transition-all
                  duration-300
                  ${
                    mobileOpen
                      ? "opacity-0"
                      : "opacity-100"
                  }
                `}
              />

              {/* Нижня лінія */}
              <span
                className={`
                  absolute
                  left-0
                  w-full
                  h-0.5
                  bg-white
                  rounded
                  transition-all
                  duration-300
                  ${
                    mobileOpen
                      ? "top-2 -rotate-45"
                      : "top-4"
                  }
                `}
              />
            </div>
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}

        <div
          className={`
            md:hidden
            grid
            transition-all
            duration-300
            ease-in-out
            ${
              mobileOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0 pointer-events-none"
            }
          `}
        >
          <div className="overflow-hidden">

            <div className="border-t border-slate-700 pb-5">

              <div className="flex flex-col pt-4 gap-2">

                {/* ================= MOBILE CATEGORIES ================= */}

                <div ref={mobileCategoriesRef}>

                  <button
                    type="button"
                    onClick={() =>
                      setCategoriesOpen(
                        (prev) => !prev
                      )
                    }
                    className="
                      flex
                      justify-between
                      items-center
                      w-full
                      py-2
                      text-left
                      hover:text-sky-400
                      transition
                    "
                  >
                    <span>Категорії</span>

                    <span
                      className={`
                        transition-transform
                        duration-300
                        ${
                          categoriesOpen
                            ? "rotate-180"
                            : "rotate-0"
                        }
                      `}
                    >
                      ▾
                    </span>
                  </button>

                  {/* Список категорій */}

                  <div
                    className={`
                      grid
                      transition-all
                      duration-300
                      ease-in-out
                      ${
                        categoriesOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0 pointer-events-none"
                      }
                    `}
                  >
                    <div className="overflow-hidden">

                      <div
                        className="
                          ml-4
                          mt-1
                          bg-slate-800
                          rounded-xl
                          p-3
                          flex
                          flex-col
                          gap-3
                        "
                      >
                        <Link
                          to="/books"
                          onClick={closeMenus}
                          className="
                            hover:text-sky-400
                            transition
                          "
                        >
                          Всі книги
                        </Link>

                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            to={`/books?category=${category.id}`}
                            onClick={closeMenus}
                            className="
                              hover:text-sky-400
                              transition
                            "
                          >
                            {category.name}
                          </Link>
                        ))}

                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= LINKS ================= */}

                <Link
                  to="/about-us"
                  onClick={closeMenus}
                  className="
                    py-2
                    hover:text-sky-400
                    transition
                  "
                >
                  Про нас
                </Link>

                <Link
                  to="/contacts"
                  onClick={closeMenus}
                  className="
                    py-2
                    hover:text-sky-400
                    transition
                  "
                >
                  Контакти
                </Link>

                {/* ================= USER ================= */}

                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={closeMenus}
                      className="
                        py-2
                        hover:text-sky-400
                        transition
                      "
                    >
                      Твій профіль, {user.first_name}!
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        mt-2
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-5
                        py-2.5
                        rounded-xl
                        font-semibold
                        transition
                        shadow-lg
                      "
                    >
                      Вийти
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login/"
                    onClick={closeMenus}
                    className="
                      mt-2
                      text-center
                      bg-sky-500
                      hover:bg-sky-600
                      text-white
                      px-5
                      py-2.5
                      rounded-xl
                      font-semibold
                      transition
                      shadow-lg
                    "
                  >
                    Увійти
                  </Link>
                )}

              </div>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;