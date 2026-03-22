import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function ProfessionsList() {
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/professions/")
      .then(res => {
        setProfessions(
          Array.isArray(res.data)
            ? res.data
            : res.data.results || []
        );
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Видалити професію?")) return;

    try {
      await axiosInstance.delete(`/professions/${id}/`);
      setProfessions(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Помилка видалення");
    }
  };

  if (loading) return <div className="p-6">Завантаження...</div>;

  return (
    <div className="p-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Професії</h1>

        <button
          onClick={() => navigate("/create-profession")}
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
            {professions.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.description}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/professions/${p.id}/update`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Редагувати
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
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

export default ProfessionsList;