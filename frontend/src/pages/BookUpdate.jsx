import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axios";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    published_date: "",
    description: "",
    isbn: "",
    category: ""
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Завантаження книги
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axiosInstance.get(`/books/${id}/`);

        setFormData({
          title: res.data.title || "",
          author: res.data.author || "",
          published_date: res.data.published_date || "",
          description: res.data.description || "",
          isbn: res.data.isbn || "",
          category: res.data.category || ""
        });

      } catch (err) {
        console.error(err);
        alert("Помилка завантаження книги");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // 🔹 Завантаження категорій
  useEffect(() => {
    axiosInstance.get("/categories/")
      .then(res => setCategories(res.data.results || res.data))
      .catch(console.error);
  }, []);

  // 🔹 Зміна полів
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...formData };

      // очищення пустих полів
      if (!payload.description) delete payload.description;
      if (!payload.isbn) delete payload.isbn;
      if (!payload.category) delete payload.category;

      await axiosInstance.patch(`/books/${id}/`, payload);

      alert("Книгу оновлено ✅");
      navigate(`/books/${id}`);

    } catch (err) {
      console.log(err.response?.data);

      const data = err.response?.data;

      if (data?.isbn) {
        alert("ISBN вже існує");
      } else {
        alert("Помилка оновлення");
      }
    }
  };

  if (loading) return <div className="p-6">Завантаження...</div>;

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded w-full max-w-lg space-y-4"
      >

        <h2 className="text-xl font-bold">Редагувати книгу</h2>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Назва"
          className="w-full border p-2 rounded"
        />

        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Автор"
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="published_date"
          value={formData.published_date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Опис"
          className="w-full border p-2 rounded"
        />

        <input
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          placeholder="ISBN"
          className="w-full border p-2 rounded"
        />

        <select
          name="category"
          value={formData.category || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Оберіть категорію</option>

          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/books/${id}`)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Скасувати
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded"
          >
            Зберегти
          </button>
        </div>

      </form>
    </div>
  );
}

export default EditBook;