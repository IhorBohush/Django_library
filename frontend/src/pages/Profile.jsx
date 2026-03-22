import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { Link, Navigate, useNavigate } from "react-router-dom";

function Profile() {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [modalWindow, setModalWindow] = useState(false);
  const [eMail, setEmail] = useState();
  const [passWord, setPassWord] = useState();
  const [oldPassword, setOldPassword] = useState("");

  useEffect(() => {
    axiosInstance.get(`/users/profile/`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setPassWord("");
    }
  }, [user]);

  const handleCredent = async () => {
    try {
      const payload = {
        email: eMail,
        old_password: oldPassword,
        password: passWord,
      };
      if (!oldPassword || !passWord) {
        alert("Введіть старий і новий пароль");
        return;
      }

      const response = await axiosInstance.patch(
        `/users/update-librarian-credentials/${user.id}/`,
        payload
      );

      // оновлюємо локальний стан
      setEmail(eMail);
      setPassWord("");
      setOldPassword("");

      setModalWindow(false);

      alert("Дані успішно оновлено ✅");

    } catch (error) {
      console.error(error);

      const errData = error.response?.data;

      if (errData) {
        if (errData.old_password) {
          alert("Невірний старий пароль ❌");
        } else if (errData.email) {
          alert("Email вже зайнятий ❌");
        } else if (errData.password) {
          alert("Пароль не відповідає вимогам ❌");
        } else {
          alert("Помилка оновлення даних");
        }
      } else {
        alert("Сервер недоступний");
      }
    }
  };

  if (!user) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">

    {/* 🔹 Header */}
    <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center justify-between">

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          {user.last_name} {user.first_name}
        </h2>
        <p className="text-gray-500 text-sm">{user.email}</p>
      </div>

      <div className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
        {user.role}
      </div>

    </div>

    {/* 🔹 Info */}
    <div className="bg-white shadow-lg rounded-2xl p-6 mt-6 space-y-4">

      <h3 className="text-lg font-semibold text-gray-700">
        Особиста інформація
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">

        <div>
          <span className="text-gray-500 text-sm">Прізвище</span>
          <p className="font-medium">{user.last_name || "-"}</p>
        </div>

        <div>
          <span className="text-gray-500 text-sm">Ім'я</span>
          <p className="font-medium">{user.first_name || "-"}</p>
        </div>

        <div>
          <span className="text-gray-500 text-sm">По батькові</span>
          <p className="font-medium">{user.middle_name || "-"}</p>
        </div>

        <div>
          <span className="text-gray-500 text-sm">Телефон</span>
          <p className="font-medium">{user.phone_number || "-"}</p>
        </div>

      </div>
    </div>

    {/* 🔹 System Info */}
    <div className="bg-white shadow-lg rounded-2xl p-6 mt-6 space-y-3">

      <h3 className="text-lg font-semibold text-gray-700">
        Системна інформація
      </h3>

      <div className="text-gray-600 text-sm space-y-1">
        <p>Створено: {new Date(user.created_at).toLocaleDateString()}</p>
        <p>Оновлено: {new Date(user.updated_at).toLocaleDateString()}</p>
      </div>

    </div>

    {/* 🔹 Actions */}
    {user.role === "librarian" && (
      <div className="bg-white shadow-lg rounded-2xl p-6 mt-6">

        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Дії
        </h3>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => navigate(`/librarians/${user.id}/update`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            ✏️ Редагувати профіль
          </button>

          <button
            onClick={() => setModalWindow(true)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg transition"
          >
            🔐 Змінити email / пароль
          </button>

        </div>

      </div>
    )}

    {/* тільки суперюзер */}
    {user.role === "superuser" && (
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-blue-700">
          Адміністрування
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <Link to="/create-librarian">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition cursor-pointer">
              Створити бібліотекаря
            </button>
          </Link>

          <Link to="/create-reader">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer">
              Створити читача
            </button>
          </Link>

          <Link to="/librarians">
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer">
              Список бібліотекарів
            </button>
          </Link>

          <Link to="/readers">
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer">
              Список читачів
            </button>
          </Link>

        </div>
      </div>
    )}

    {/* бібліотекар */}
    {user.role === "librarian" && (
      <div className="space-y-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Панель бібліотекаря
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 📚 Читачі */}
          <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-3 text-green-700">
              Читачі
            </h3>

            <div className="space-y-2">
              <Link to="/create-reader">
                <div className="p-3 bg-green-50 hover:bg-green-100 rounded-lg cursor-pointer transition">
                  ➕ Створити читача
                </div>
              </Link>

              <Link to="/readers">
                <div className="p-3 bg-green-50 hover:bg-green-100 rounded-lg cursor-pointer transition">
                  📋 Список читачів
                </div>
              </Link>
            </div>
          </div>

          {/* 🧑‍💼 Професії */}
          <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Професії
            </h3>

            <div className="space-y-2">
              <Link to="/create-profession">
                <div className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition">
                  ➕ Створити професію
                </div>
              </Link>

              <Link to="/professions">
                <div className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition">
                  📋 Список професій
                </div>
              </Link>
            </div>
          </div>

          {/* 🗂 Категорії */}
          <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-3 text-pink-700">
              Категорії
            </h3>

            <div className="space-y-2">
              <Link to="/create-category">
                <div className="p-3 bg-pink-50 hover:bg-pink-100 rounded-lg cursor-pointer transition">
                  ➕ Створити категорію
                </div>
              </Link>

              <Link to="/categories">
                <div className="p-3 bg-pink-50 hover:bg-pink-100 rounded-lg cursor-pointer transition">
                  📋 Список категорій
                </div>
              </Link>
            </div>
          </div>

          {/* 📚 Книги */}
          <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-3 text-orange-700">
              Книги
            </h3>

            <div className="space-y-2">
              <Link to="/create-book">
                <div className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg cursor-pointer transition">
                  ➕ Створити книгу
                </div>
              </Link>

              <Link to="/books">
                <div className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg cursor-pointer transition">
                  📋 Список книг
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    )}

    {/* МОДАЛЬНЕ ВІКНО */}
    {modalWindow && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={() => setModalWindow(false)}
      >

      <div className="bg-white p-6 rounded-lg w-96"
      onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          Email/пароль читача
        </h2>

        <input
          type="email"
          value={eMail}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 w-full rounded mb-4"
        />

        <input
          type="password"
          placeholder="Старий пароль"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="border px-3 py-2 w-full rounded mb-4"
        />

        <input
          type="password"
          placeholder="Новий пароль"
          value={passWord}
          onChange={(e) => setPassWord(e.target.value)}
          className="border px-3 py-2 w-full rounded mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setModalWindow(false)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Скасувати
          </button>

          <button
            onClick={handleCredent}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
    )}

    {/* читач */}
    {user.role === "reader" && (
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-purple-700">
          Меню читача
        </h3>

        <p className="text-gray-600">
          Тут будуть взяті книги
        </p>
      </div>
    )}

  </div>
);
}

export default Profile;