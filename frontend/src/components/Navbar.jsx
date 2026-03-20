import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Закривати dropdown при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-900 bg-opacity-90 text-white shadow-md z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4">

        <h1 className="text-xl font-bold">LIBRARY</h1>

        <div className="flex gap-6 items-center">

          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <span
              className="cursor-pointer hover:text-sky-400 transition"
              onClick={() => setOpen(!open)}
            >
              Категорії ▾
            </span>

            {open && (
              <div className="absolute top-10 left-0 z-50 bg-white text-black rounded-xl shadow-xl p-4 flex flex-col gap-2 min-w-55">
                <Link to="/categories/fiction" className="hover:text-sky-600">
                  Художня література
                </Link>
                <Link to="/categories/education" className="hover:text-sky-600">
                  Навчальна література
                </Link>
                <Link to="/categories/history" className="hover:text-sky-600">
                  Історія
                </Link>
                <Link to="/categories/science" className="hover:text-sky-600">
                  Наука
                </Link>
              </div>
            )}
          </div>

          <Link to="/about" className="hover:text-sky-400 transition">
            Про нас
          </Link>

          <Link to="/contacts" className="hover:text-sky-400 transition">
            Контакти
          </Link>
          
          <div>
            {user ? (
              <>
                <span className="mr-4">
                <Link to="/profile" className="hover:text-sky-400 transition">
                  Твій профіль, {user.first_name}!
                </Link>
                </span>

                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold transition shadow-lg">
                  Вийти
                </button>
              </>
            ) : (
              <Link
                to="/login/"
                className="ml-4 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-xl font-semibold transition shadow-lg">
                Увійти
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}