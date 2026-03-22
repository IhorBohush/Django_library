import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function CreateBook() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    published_date: "",
    description: "",
    isbn: "",
    category: ""
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/categories/")
      .then(res => setCategories(res.data.results || res.data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...formData };

      if (!payload.description) delete payload.description;
      if (!payload.isbn) delete payload.isbn;
      if (!payload.category) delete payload.category;

      await axiosInstance.post("/books/", payload);

      alert("Книгу створено ✅");
      navigate("/books");

    } catch (err) {
      console.log(err.response?.data);
      alert("Помилка створення");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded w-full max-w-lg space-y-4">

        <h2 className="text-xl font-bold">Створити книгу</h2>

        <input name="title" placeholder="Назва" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="author" placeholder="Автор" onChange={handleChange} className="w-full border p-2 rounded" />

        <input type="date" name="published_date" onChange={handleChange} className="w-full border p-2 rounded" />

        <textarea name="description" placeholder="Опис" onChange={handleChange} className="w-full border p-2 rounded" />

        <input name="isbn" placeholder="ISBN" onChange={handleChange} className="w-full border p-2 rounded" />

        <select name="category" onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">Оберіть категорію</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Створити
        </button>

      </form>
    </div>
  );
}

export default CreateBook;