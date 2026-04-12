import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [user, setUser] = useState(null);
  const [copies, setCopies] = useState([]);
  const [copyNumber, setCopyNumber] = useState("");
  const [activeCopyId, setActiveCopyId] = useState(null);

  useEffect(() => {
    // отримати користувача
    axiosInstance.get("/users/profile/")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));

    // отримати книгу
    axiosInstance.get(`/books/${id}/`)
      .then(res => {
        setBook(res.data);

        const cover = res.data.attachments?.find(a => a.type === "cover");
        setActiveImage(cover?.upload?.file_url || null);
      })
      .catch(console.error);

    // отримати копії книги
    axiosInstance.get(`/book-copies/?book=${id}`)
      .then(res => setCopies(res.data.results || res.data))
      .catch(console.error);
      }, [id]);

  const handleDelete = () => {
    if (!window.confirm("Ти впевнений, що хочеш видалити книгу?")) return;

    axiosInstance.delete(`/books/${id}/`)
      .then(() => {
        navigate("/books");
      })
      .catch(console.error);
  };

  const handleCreateCopy = async () => {
    if (!copyNumber) return alert("Введи номер копії");

    try {
      const res = await axiosInstance.post("/book-copies/", {
        number: copyNumber,
        book: id,
        is_available: true
      });

      setCopies(prev => [...prev, res.data]);
      setCopyNumber("");

    } catch (err) {
      console.error(err.response?.data);
      alert("Помилка створення копії");
    }
  };

  const handleCopyClick = (copyId) => {
    setActiveCopyId(prev => (prev === copyId ? null : copyId));
  };

  const deleteCopy = async (copyId) => {
    if (!window.confirm("Видалити копію?")) return;

    try {
      await axiosInstance.delete(`/book-copies/${copyId}/`);
      setCopies(prev => prev.filter(c => c.id !== copyId));
      setActiveCopyId(null);
    } catch (err) {
      console.error(err);
      alert("Помилка видалення");
    }
  };

  if (!book) return <div className="p-10">Завантаження...</div>;

  const fileAttachment = book.attachments?.find(a => a.type === "file");
  const isLibrarian = user?.role === "librarian";

  const availableCopies = copies.filter(c => c.is_available);
  const unavailableCopies = copies.filter(c => !c.is_available);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">

      <div className="bg-white shadow-xl rounded-3xl p-6 md:p-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* 🔹 Images */}
          <div>

            {/* 🔸 Main image */}
            <div className="bg-gray-100 rounded-2xl overflow-hidden h-96 flex items-center justify-center shadow-inner">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={book.title}
                  className="h-full object-contain transition-all duration-300"
                />
              ) : (
                <span className="text-gray-400">Немає зображення</span>
              )}
            </div>

            {/* 🔸 Thumbnails */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {book.attachments
                ?.filter(att => att?.type === "cover")
                .map(att => (
                  <img
                    key={att.id}
                    src={att?.upload?.file_url}
                    alt=""
                    onClick={() => setActiveImage(att?.upload?.file_url)}
                    className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition ${
                      activeImage === att?.upload?.file_url
                        ? "border-blue-500 scale-105"
                        : "border-transparent hover:scale-105"
                    }`}
                  />
                ))}
            </div>

          </div>

          {/* 🔹 Info */}
          <div className="space-y-5">

            <h1 className="text-3xl font-bold text-gray-800">
              {book.title}
            </h1>

            <p className="text-lg text-gray-600">
              {book.author}
            </p>

            <div className="flex gap-2 flex-wrap">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {book.category_name || "Без категорії"}
              </span>

              {book.isbn && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  ISBN: {book.isbn}
                </span>
              )}
            </div>

            <div className="text-sm text-gray-500">
              Рік видання: {book.published_year}
            </div>

            {/* 🔹 File link */}
            {fileAttachment && (
              <div className="pt-4">
                <a
                  href={fileAttachment.upload.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
                >
                  📄 Відкрити файл
                </a>
              </div>
            )}

            {/* 🔹 Description */}
            {book.description && (
              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Опис
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}

            {/* 🔹 Book Copies */}
            <div className="pt-6">

              <h3 className="text-lg font-semibold mb-3">
                📚 Копії книги
              </h3>

              {/* 🔹 Create (тільки librarian) */}
              {isLibrarian && (
                <div className="flex gap-2 mb-4">
                  <input
                    value={copyNumber}
                    onChange={(e) => setCopyNumber(e.target.value)}
                    placeholder="Номер копії"
                    className="border p-2 rounded-lg flex-1"
                  />

                  <button
                    onClick={handleCreateCopy}
                    className="bg-green-500 text-white px-4 rounded-lg hover:bg-green-600"
                  >
                    ➕ Додати
                  </button>
                </div>
              )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 🔹 Available */}
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">
                    Доступні
                  </h4>

                  <div className="space-y-2">
                    {availableCopies.map(copy => (
                      <div
                        key={copy.id}
                        onClick={() => isLibrarian && handleCopyClick(copy.id)}
                        className={`p-3 rounded-lg border transition cursor-pointer ${
                          activeCopyId === copy.id
                            ? "bg-green-100 border-green-400"
                            : "bg-green-50 border-green-200 hover:bg-green-100"
                        }`}
                      >

                        <div className="flex justify-between items-center">
                          <span>№ {copy.number}</span>
                          <span className="text-sm text-green-600">✔ В наявності</span>
                        </div>

                        {/* 🔥 Actions */}
                        {isLibrarian && activeCopyId === copy.id && (
                          <div className="flex gap-2 mt-3">

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCopy(copy.id);
                              }}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              🗑 Видалити
                            </button>

                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                </div>

                {/* 🔴 Unavailable */}
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">
                    Видані
                  </h4>

                  <div className="space-y-2">
                    {unavailableCopies.map(copy => (

                      <div className="flex justify-between items-center">
                        <span>№ {copy.number}</span>
                        <span className="text-sm text-red-600">✖ Видано</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            {/* 🔹 Actions (тільки librarian) */}
            {isLibrarian && (
              <div className="flex gap-3 pt-6">

                <button
                  onClick={() => navigate(`/books/${id}/update`)}
                  className="bg-blue-500 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-600 transition"
                >
                  ✏️ Оновити
                </button>

                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-5 py-2 rounded-xl shadow hover:bg-red-600 transition"
                >
                  🗑 Видалити
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default BookDetail;