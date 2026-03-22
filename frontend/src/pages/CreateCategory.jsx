import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function CreateCategory() {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/categories/", formData);
      alert("Категорію створено ✅");
      navigate("/categories");
    } catch (err) {
      console.error(err);
      alert("Помилка створення");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">Створити категорію</h2>

        <input
          name="name"
          placeholder="Назва"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Опис"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-green-600 text-white py-2 rounded cursor-pointer">
          Створити
        </button>
      </form>
    </div>
  );
}

export default CreateCategory;