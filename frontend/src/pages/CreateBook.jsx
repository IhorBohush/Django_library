import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function CreateBook() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    published_year: "",
    description: "",
    isbn: "",
    category: ""
  });

  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/categories/")
      .then(res => setCategories(res.data.results || res.data))
      .catch(console.error);
  }, []);

  // 🔹 Зміна полів форми
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Додавання файлів
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const filesWithPreview = selectedFiles.map(file => ({
      file,
      preview: file.type.startsWith("image")
        ? URL.createObjectURL(file)
        : null
    }));

    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  // 🔹 Видалення файлу
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 🔹 Очистка preview (важливо)
  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [files]);

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Створюємо книгу
      const bookRes = await axiosInstance.post("/books/", formData);
      const bookId = bookRes.data.id;

      // 2️⃣ Завантажуємо всі файли
      for (let item of files) {
        const formDataFile = new FormData();
        formDataFile.append("file", item.file);

        const uploadRes = await axiosInstance.post(
          "/uploads/create/",
          formDataFile,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const uploadId = uploadRes.data.id;

        // 🔥 визначаємо тип
        const type = item.file.type.startsWith("image")
          ? "cover"
          : "file";

        // 3️⃣ Attachment
        await axiosInstance.post("/attachments/", {
          upload_id: uploadId,
          book: bookId,
          type: type,
        });
      }

      alert("Книгу створено ✅");
      navigate("/books");

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Помилка");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-bold">Створити книгу</h2>

        <input
          name="title"
          placeholder="Назва"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="author"
          placeholder="Автор"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="published_year"
          placeholder="Рік видання"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Опис"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="isbn"
          placeholder="ISBN"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="category"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Оберіть категорію</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* 🔥 Upload */}
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full border p-2 rounded"
        />

        {/* 🔥 Preview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((item, index) => (
            <div key={index} className="relative border rounded-lg p-2 shadow-sm">

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
              >
                ✕
              </button>

              {item.preview ? (
                <img
                  src={item.preview}
                  alt="preview"
                  className="w-full h-32 object-cover rounded"
                />
              ) : (
                <div className="h-32 flex items-center justify-center bg-gray-100 text-sm text-gray-500 rounded">
                  📄 {item.file.name}
                </div>
              )}

              <p className="text-xs mt-2 truncate">
                {item.file.name}
              </p>
            </div>
          ))}
        </div>

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Створити
        </button>
      </form>
    </div>
  );
}

export default CreateBook;