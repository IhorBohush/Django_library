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
  <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">

    <h2 className="text-2xl font-bold mb-6 text-gray-800">
      Мій профіль
    </h2>

    <div className="space-y-2 text-gray-700">
      <p><span className="font-semibold">Email:</span> {user.email}</p>
      <p><span className="font-semibold">Прізвище:</span> {user.last_name}</p>
      <p><span className="font-semibold">Ім'я:</span> {user.first_name}</p>
      <p><span className="font-semibold">По батькові:</span> {user.middle_name}</p>
      <p><span className="font-semibold">Телефон:</span> {user.phone_number}</p>
      <p><span className="font-semibold">Створено:</span> {new Date(user.created_at).toLocaleDateString()}</p>
      <p><span className="font-semibold">Оновлено:</span> {new Date(user.updated_at).toLocaleDateString()}</p>
      {user.role === "librarian" && (
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => navigate(`/librarians/${user.id}/update`)} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition cursor-pointer">
              Редагувати
          </button>

          <button 
            onClick={() => setModalWindow(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer">
              Email / Пароль
          </button>
        </div>
      )}
    </div>


    <hr className="my-6" />

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
      <div className="space-y-2 text-gray-700">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-green-700">
            Меню бібліотекаря
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <Link to="/create-reader">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                Створити читача
              </button>
            </Link>

            <Link to="/readers">
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                Список читачів
              </button>
            </Link>
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