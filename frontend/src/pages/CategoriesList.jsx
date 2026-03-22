import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/categories/")
      .then(res => {
        setCategories(
          Array.isArray(res.data)
            ? res.data
            : res.data.results || []
        );
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Видалити категорію?")) return;

    try {
      await axiosInstance.delete(`/categories/${id}/`);
      setCategories(prev => prev.filter(с => с.id !== id));
    } catch (err) {
      console.error(err);
      alert("Помилка видалення");
    }
  };

  if (loading) return <div className="p-6">Завантаження...</div>;

  return (
    <div className="p-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Категорії</h1>

        <button
          onClick={() => navigate("/create-category")}
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          + Додати
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Назва</th>
              <th className="p-3 text-left">Опис</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.description}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/categories/${c.id}/update`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Редагувати
                  </button>

                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoriesList;