import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axios";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    published_year: "",
    description: "",
    isbn: "",
    category: ""
  });

  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]); // нові файли
  const [existingFiles, setExistingFiles] = useState([]); // вже завантажені
  const [loading, setLoading] = useState(true);

  // 🔹 Завантаження книги
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/books/${id}/`);

        setFormData({
          title: res.data.title || "",
          author: res.data.author || "",
          published_year: res.data.published_year || "",
          description: res.data.description || "",
          isbn: res.data.isbn || "",
          category: res.data.category || ""
        });

        setExistingFiles(res.data.attachments || []);

      } catch (err) {
        console.error(err);
        alert("Помилка завантаження");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔹 Категорії
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

  // 🔹 Нові файли
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);

    const mapped = selected.map(file => ({
      file,
      preview: file.type.startsWith("image")
        ? URL.createObjectURL(file)
        : null
    }));

    setFiles(prev => [...prev, ...mapped]);
  };

  const removeNewFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 🔹 Видалення існуючого файлу
  const removeExistingFile = async (attId) => {
    if (!window.confirm("Видалити файл?")) return;

    try {
      await axiosInstance.delete(`/attachments/${attId}/`);
      setExistingFiles(prev => prev.filter(f => f.id !== attId));
    } catch (err) {
      console.error(err);
      alert("Помилка видалення файлу");
    }
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ оновлюємо книгу
      await axiosInstance.patch(`/books/${id}/`, formData);

      // 2️⃣ додаємо нові файли
      for (let item of files) {
        const fd = new FormData();
        fd.append("file", item.file);

        const uploadRes = await axiosInstance.post(
          "/uploads/create/",
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const uploadId = uploadRes.data.id;

        const type = item.file.type.startsWith("image")
          ? "cover"
          : "file";

        await axiosInstance.post("/attachments/", {
          upload_id: uploadId,
          book: id,
          type
        });
      }

      alert("Оновлено ✅");
      navigate(`/books/${id}`);

    } catch (err) {
      console.error(err.response?.data);
      alert("Помилка оновлення");
    }
  };

  if (loading) return <div className="p-6">Завантаження...</div>;

  return (
    <div className="flex justify-center mt-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-xl rounded-2xl w-full max-w-2xl space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">
          ✏️ Редагування книги
        </h2>

        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Назва книги
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Автор
            </label>
            <input
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Рік видання
            </label>
            <input
              name="published_year"
              value={formData.published_year}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категорія
            </label>
            <select
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Оберіть категорію</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Опис
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* 🔥 Існуючі файли */}
        <div>
          <h3 className="font-semibold text-gray-700 mt-4">
            Поточні файли
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {existingFiles.map(att => (
              <div key={att.id} className="relative border p-2 rounded">

                <button
                  type="button"
                  onClick={() => removeExistingFile(att.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
                >
                  ✕
                </button>

                {att.type === "cover" ? (
                  <img
                    src={att.upload.file_url}
                    alt=""
                    className="w-full h-28 object-cover rounded"
                  />
                ) : (
                  <div className="h-28 flex items-center justify-center bg-gray-100 text-sm">
                    📄 файл
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* 🔥 Нові файли */}
        <h3 className="font-semibold text-gray-700 mt-4">
          Додати нові файли
        </h3>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full border p-2 rounded"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {files.map((item, i) => (
            <div key={i} className="relative border p-2 rounded">

              <button
                type="button"
                onClick={() => removeNewFile(i)}
                className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
              >
                ✕
              </button>

              {item.preview ? (
                <img
                  src={item.preview}
                  alt=""
                  className="w-full h-28 object-cover rounded"
                />
              ) : (
                <div className="h-28 flex items-center justify-center bg-gray-100 text-sm">
                  📄 {item.file.name}
                </div>
              )}

            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/books/${id}`)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Скасувати
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            Зберегти
          </button>
        </div>

      </form>
    </div>
  );
}

export default EditBook;