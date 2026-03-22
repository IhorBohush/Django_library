import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axios";

function BookDetail() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/books/${id}/`)
      .then(res => {
        setBook(res.data);

        const cover = res.data.attachments?.find(a => a.type === "cover");
        setActiveImage(cover?.file_url || null);
      })
      .catch(console.error);
  }, [id]);

  if (!book) return <div className="p-10">Завантаження...</div>;

  return (
    <div className="p-10 max-w-6xl mx-auto">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* 🔹 Images */}
        <div>

          {/* 🔸 Main image */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden h-100 flex items-center justify-center">

            {activeImage ? (
              <img
                src={activeImage}
                alt={book.title}
                className="h-full object-contain"
              />
            ) : (
              <span className="text-gray-400">Немає зображення</span>
            )}

          </div>

          {/* 🔸 Thumbnails */}
          <div className="flex gap-3 mt-4 flex-wrap">

            {book.attachments?.map(att => (
              <img
                key={att.id}
                src={att.file_url}
                alt=""
                onClick={() => setActiveImage(att.file_url)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  activeImage === att.file_url
                    ? "border-blue-500"
                    : "border-transparent"
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
            Опубліковано: {book.published_date}
          </div>

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

        </div>

      </div>

    </div>
  );
}

export default BookDetail;