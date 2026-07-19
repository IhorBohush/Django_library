import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function BooksList() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cat, setCat] = useState("");
  const navigate = useNavigate();
  const category = searchParams.get("category");
  // const search = searchParams.get("search") || "";


  useEffect(() => {
    setLoading(true);

    const query = `?page=${page}${
      search ? `&search=${search}` : ""
    }${
      category ? `&category=${category}` : ""
    }`;

    axiosInstance
      .get(`/books/${query}`)
      .then((res) => {
        const data = res.data;

        setBooks(data.results || []);
        setTotalPages(Math.ceil(data.count / 12));
      })
      .catch(err => {
        console.error(err.response?.status, err.response?.data);
      })
      .finally(() => setLoading(false));

  }, [search, page, category]);

    {loading && (
      <div className="text-sm text-gray-500 mb-2">
        Пошук...
      </div>
    )}

  useEffect(() => {
    if (category) {
      axiosInstance.get(`/categories/${category}/`)
        .then((response) => {
          setCat(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      setCat("");
    }
  }, [category]);


  return (
  <div className="p-10">

    {/* 🔹 Header */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Книги {cat ? `з категорії: ${cat.name}` : ""}
      </h1>

      {user?.role === 'librarian' && (
      <button
        onClick={() => navigate("/create-book")}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
      >
        + Додати книгу
      </button>
      )}
    </div>
    <div>
      <input
        type="text"
        placeholder="Пошук за назвою або автором..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // 👈 важливо
        }}
        className="w-full md:w-1/3 mb-6 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* 🔹 Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  
      {books.map(book => {
        const cover = book.cover;

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
                  src={cover}
                  loading="lazy"
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
    <div className="flex justify-center mt-8 gap-2">

      <button
        disabled={page === 1}
        onClick={() => setPage(prev => prev - 1)}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Назад
      </button>

      <span className="px-4 py-2">
        Сторінка {page} з {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(prev => prev + 1)}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Вперед
      </button>

    </div>

  </div>
);
}

export default BooksList;