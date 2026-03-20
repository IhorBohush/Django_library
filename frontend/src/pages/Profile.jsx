import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { Link } from "react-router-dom";

function Profile() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/users/profile/`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
      <p><span className="font-semibold">Ім'я:</span> {user.first_name}</p>
      <p><span className="font-semibold">Прізвище:</span> {user.last_name}</p>
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
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-green-700">
          Меню бібліотекаря
        </h3>

        <Link to="/create-reader">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            Створити читача
          </button>
        </Link>
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