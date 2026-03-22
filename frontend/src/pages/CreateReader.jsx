import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";

function CreateReader() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    phone_number: "",
    actor_type: "",
    profession: "",
    graduation_date: ""
  });

  const [user, setUser] = useState(null);

  const [professions, setProfessions] = useState([]);
  const [actorChoices, setActorChoices] = useState([]);

  useEffect(() => {
  const fetchProfessions = async () => {
    try {
      const res = await axiosInstance.get("/professions/");
      setProfessions(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (error) {
      console.error("Помилка завантаження професій", error);
    }
  };

  fetchProfessions();
}, []);

  useEffect(() => {
  const fetchChoices = async () => {
    try {
      const response = await axiosInstance.get("/users/actors-choices/");
      setActorChoices(response.data.actor_types);
    } catch (error) {
      console.error("Помилка отримання choices", error);
    }
  };

  fetchChoices();
}, []);

  const [newProfession, setNewProfession] = useState("");
  const [showAddProfession, setShowAddProfession] = useState(false);

  const handleAddProfession = async () => {
    if (!newProfession.trim()) return;

    try {
      const response = await axiosInstance.post("/professions/", { name: newProfession });
      setProfessions([...professions, response.data]); // додаємо нову професію до списку
      setNewProfession(""); // чистимо інпут
      setShowAddProfession(false); // закриваємо модалку
    } catch (error) {
      console.error("Помилка додавання професії", error);
      alert("Не вдалося додати професію");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/users/create-reader/", formData);

      alert("Читача створено");

      setFormData({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        phone_number: "",
        actor_type: "",
        profession: "",
        graduation_date: ""
      });

    } catch (error) {
        console.log("ERROR:", error.response?.data);

        const data = error.response?.data;

        if (data?.email) {
          alert("Email вже існує");
        } else if (data?.password) {
          alert("Некоректний пароль");
        } else if (data?.actor_type) {
          alert("Оберіть тип читача");
        } else {
          alert("Помилка створення");
        }
      }
    };

  return (
    <div className="flex justify-center items-start pt-12 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
          Створити читача
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="last_name"
            placeholder="Прізвище"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="first_name"
            placeholder="Ім'я"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="middle_name"
            placeholder="По батькові"
            value={formData.middle_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="phone_number"
            placeholder="Номер телефону"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="actor_type"
            value={formData.actor_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="">Оберіть тип читача</option>

            {actorChoices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>

            <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Оберіть професію</option>

                {professions.map((profession) => (
                  <option key={profession.id} value={profession.id}>
                    {profession.name}
                  </option>
                ))}
            </select>
            {user.role === "librarian" && (
              <button
                  type="button"
                  onClick={() => setShowAddProfession(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition"
                  >
                  Додати нову професію
              </button>
            )}

              {showAddProfession && (
              <div className="mt-2 flex gap-2">
                  <input
                  type="text"
                  placeholder="Нова професія"
                  value={newProfession}
                  onChange={(e) => setNewProfession(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                  type="button"
                  onClick={handleAddProfession}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition"
                  >
                  Зберегти
                  </button>
                  <button
                  type="button"
                  onClick={() => setShowAddProfession(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-2 rounded-lg transition"
                  >
                  Відмінити
                  </button>
              </div>
              )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
                Дата закінчення навчання
            </label>

            <input
                type="date"
                name="graduation_date"
                value={formData.graduation_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            </div>

          <input
            type="password"
            name="password"
            placeholder="Пароль (необов'язково)"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <p className="text-sm text-gray-500">
            Якщо пароль не вказати — читач отримає email для встановлення пароля.
          </p>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition cursor-pointer"
          >
            Створити читача
          </button>

        </form>

      </div>
    </div>
  );
}

export default CreateReader;