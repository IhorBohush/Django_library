import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/books/")
      .then(res => {
        setBooks(
          Array.isArray(res.data)
            ? res.data
            : res.data.results || []
        );
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Завантаження...</div>;

  return (
  <div className="p-10">

    {/* 🔹 Header */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Книги
      </h1>

      <button
        onClick={() => navigate("/create-book")}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
      >
        + Додати книгу
      </button>
    </div>

    {/* 🔹 Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      {books.map(book => {
        const cover = book.attachments?.find(a => a.type === "cover");

        return (
          <div
            key={book.id}
            onClick={() => navigate(`/books/${book.id}`)}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden group"
          >

            {/* 📕 Cover */}
            <div className="h-52 bg-gray-100 flex items-center justify-center overflow-hidden">

              {cover ? (
                <img
                  src={cover.file_url}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              ) : (
                <div className="text-gray-400 text-sm">
                  Немає обкладинки
                </div>
              )}

            </div>

            {/* 📘 Info */}
            <div className="p-4 space-y-2">

              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                {book.title}
              </h3>

              <p className="text-gray-600 text-sm">
                {book.author}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-500 pt-2">

                <span className="bg-gray-100 px-2 py-1 rounded">
                  {book.category_name || "Без категорії"}
                </span>

                {book.isbn && (
                  <span className="text-xs">
                    ISBN
                  </span>
                )}

              </div>

            </div>

          </div>
        );
      })}

    </div>

  </div>
);
}

export default BooksList;