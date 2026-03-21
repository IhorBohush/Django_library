import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function EditLibrarian() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [librarian, setLibrarian] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    phone_number: ""
  });

  // 🔹 Завантаження даних
  useEffect(() => {
    const fetchLibrarian = async () => {
      try {
        const res = await axiosInstance.get(`/users/profile/`);
        setLibrarian(res.data);

        setFormData({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          middle_name: res.data.middle_name || "",
          phone_number: res.data.phone_number || ""
        });

      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити дані");
      } finally {
        setLoading(false);
      }
    };

    fetchLibrarian();
  }, [id]);

  // 🔹 Обробка змін
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // 🔹 Відправка
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.patch(`/users/update-librarian/${id}/`, formData);

      alert("Дані успішно збережено ✅");
      navigate("/profile");

    } catch (err) {
      console.error(err.response?.data);

      const data = err.response?.data;

      if (data?.phone_number) {
        alert("Некоректний номер телефону");
      } else {
        alert("Помилка при збереженні");
      }
    }
  };

  // 🔹 Loading
  if (loading) {
    return <div className="p-6">Завантаження...</div>;
  }

  // 🔹 Error
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Редагування бібліотекаря
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Ім'я</label>
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Прізвище</label>
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">По батькові</label>
            <input
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Телефон</label>
            <input
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-4">

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Скасувати
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Зберегти
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default EditLibrarian;