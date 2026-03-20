import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function EditReader() {
  const { id } = useParams();
  const [reader, setReader] = useState(null);
  const [actorChoices, setActorChoices] = useState([]);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    phone_number: "",
    actor_type: "",
    profession: "",
    graduation_date: ""
  });

  // Завантажуємо дані читача
  useEffect(() => {
    const fetchReader = async () => {
      try {
        const res = await axiosInstance.get(`/users/readers/${id}/`);
        setReader(res.data);
        setFormData({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          middle_name: res.data.middle_name || "",
          phone_number: res.data.phone_number || "",
          actor_type: res.data.actor_type || "",
          profession: res.data.profession || "",
          graduation_date: res.data.graduation_date || ""
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchReader();
  }, [id]);

  useEffect(() => {
  const fetchChoices = async () => {
    try {
      const response = await axiosInstance.get("/users/actors-choices/");
      setActorChoices(response.data.actor_types);
    } catch (error) {
      console.error("Помилка отримання actor choices", error);
    }
  };

  fetchChoices();
}, []);

  const sortedChoices = [
  ...actorChoices.filter(c => c.value === formData.actor_type),
  ...actorChoices.filter(c => c.value !== formData.actor_type),
];

  // Обробка зміни полів
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Відправка на бекенд
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/users/update-reader/${id}/`, formData);
      alert("Дані успішно збережено!");
      navigate(`/readers/${id}`);
    } catch (error) {
      console.error(error.response?.data);
      alert("Помилка при збереженні");
    }
  };

  if (!reader) return <div>Loading...</div>;

  return (
  <div className="flex justify-center mt-10">
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">

      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Редагування читача
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Ім'я</label>
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Прізвище</label>
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">По батькові</label>
          <input
            name="middle_name"
            value={formData.middle_name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Телефон</label>
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Тип читача</label>
          <select
            name="actor_type"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.actor_type}
            onChange={handleChange}
          >
            {sortedChoices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Професія</label>
          <input
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="text-sm text-gray-600 mb-1">Дата випуску</label>
          <input
            name="graduation_date"
            type="date"
            value={formData.graduation_date}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2 flex justify-end gap-3 mt-4">

          <button
            type="button"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            onClick={() => navigate(`/readers/${id}`)}
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

export default EditReader;