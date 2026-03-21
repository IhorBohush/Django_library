import { useState } from "react";
import axiosInstance from "../api/axios";
import { Navigate, useNavigate } from "react-router-dom";

function CreateLibrarian() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    phone_number: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/users/create-librarian/", formData);
      alert("Бібліотекаря створено");

      setFormData({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        phone_number: ""
      });
      navigate("/librarians")

    } catch (error) {
      console.error(error);
      alert("Помилка створення бібліотекаря");
    }
  };

  return (
    <div className="flex justify-center items-start pt-12 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
          Створити бібліотекаря
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
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

          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition cursor-pointer"
          >
            Створити
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateLibrarian;