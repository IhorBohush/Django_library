import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { Navigate, useNavigate } from "react-router-dom";


function LibrariansList() {
  const navigate = useNavigate();
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get("/users/librarians/")
      .then(res => setLibrarians(Array.isArray(res.data) ? res.data : res.data.results || []))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Ви впевнені, що хочете видалити цього бібліотекаря?"
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/users/delete-librarian/${id}/`);
      setLibrarians(prev => prev.filter(lib => lib.id !== id));
      navigate("/librarians");
    } catch (error) {
      console.error(error);
      alert("Не вдалося видалити бібліотекаря");
    }
  };

  return (
    <div className="p-12">
      <h1 className="text-2xl font-bold mb-6">Список бібліотекарів</h1>
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {loading ? (
          <p className="p-4 text-gray-500">Завантаження...</p>
        ) : error ? (
          <p className="p-4 text-red-500">Помилка: {error.message}</p>
        ) : librarians.length === 0 ? (
          <p className="p-4 text-gray-600">Ще немає бібліотекарів.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Прізвище</th>
                <th className="p-3">Ім'я</th>
                <th className="p-3">По батькові</th>
                <th className="p-3">Email</th>
                <th className="p-3">Телефон</th>
                <th className="p-3">Створений</th>
                <th className="p-3">Оновлений</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {librarians.map((lib) => (
                <tr key={lib.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{lib.last_name || "-"}</td>
                  <td className="p-3">{lib.first_name || "-"}</td>
                  <td className="p-3">{lib.middle_name || "-"}</td>
                  <td className="p-3">{lib.email || "-"}</td>
                  <td className="p-3">{lib.phone_number || "-"}</td>
                  <td className="p-3">{new Date(lib.created_at).toLocaleDateString() || "-"}</td>
                  <td className="p-3">{new Date(lib.updated_at).toLocaleDateString() || "-"}</td>
                  <td>
                    {/* Небезпечна дія */}
                    <button
                      onClick={() => handleDelete(lib.id)}
                      className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-medium transition"
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LibrariansList;