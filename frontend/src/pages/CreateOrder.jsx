import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function CreateOrder() {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [copy, setCopy] = useState(null);

  const [book, setBook] = useState(null);

  const [selectedUser, setSelectedUser] = useState("");

  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [dueDate, setDueDate] = useState("");

  // 📌 отримуємо copyId з URL
  const query = new URLSearchParams(location.search);
  const copyId = query.get("copy");

  useEffect(() => {
    // 🔹 отримати користувачів
    axiosInstance.get("/users/readers/")
      .then(res => setUsers(res.data.results || res.data))
      .catch(console.error);

    // 🔹 отримати копію книги
    if (copyId) {
      axiosInstance.get(`/book-copies/${copyId}/`)
        .then(res => setCopy(res.data))
        .catch(console.error);
    }
  }, [copyId]);

  useEffect(() => {
    // отримати книгу для відображення інфи про копію
    if (copy) {
      axiosInstance.get(`/books/${copy.book}/`)
        .then(res => setBook(res.data))
        .catch(console.error);
    }
  }, [copy]);


  useEffect(() => {
    if (!search) {
        setFilteredUsers([]);
        return;
    }

    const timeout = setTimeout(() => {
        axiosInstance
        .get(`/users/readers/?search=${search}`)
        .then(res => {
            setFilteredUsers(res.data.results || res.data);
        })
        .catch(console.error);
    }, 400); // debounce

    return () => clearTimeout(timeout);
    }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      return alert("Обери користувача");
    }

    try {
      await axiosInstance.post("/orders/create/", {
        user: selectedUser.id,
        book: copyId,
        due_date: dueDate,
      });

      alert("Книгу видано ✅");
      navigate("/orders");

    } catch (err) {
      console.error(err.response?.data);
      alert("Помилка створення ордера");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">

      <div className="bg-white shadow-xl rounded-3xl p-6 md:p-10">

        <h1 className="text-2xl font-bold mb-6">
          📖 Видати книгу
        </h1>

        {/* 🔹 Інфа про копію */}
        {copy && (
          <div className="mb-6 p-4 bg-gray-100 rounded-xl">
            <p className="font-semibold">
              {book?.title || "Завантаження..."}
            </p>
            <p className="text-sm text-gray-600">
              Копія № {copy.number}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* 🔹 User search */}
          <div>
            <label className="block mb-1 font-medium">
                Пошук читача (прізвище)
            </label>

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Введи прізвище..."
                className="w-full border p-2 rounded-lg"
            />

            {/* 🔹 результати */}
            {filteredUsers.length > 0 && !selectedUser && (
            <div className="border rounded-lg mt-2 max-h-48 overflow-y-auto bg-white shadow">
                {filteredUsers.map(u => (
                    <div
                    key={u.id}
                    onClick={() => {
                        setSelectedUser(u);
                        setSearch(`${u.last_name} ${u.first_name}`);
                        setFilteredUsers([]);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                    {u.last_name} {u.first_name}
                    </div>
                ))}
                </div>
            )}
            {selectedUser && (
            <div className="mt-4 p-4 bg-gray-50 border rounded-xl shadow-sm">

                <div className="flex justify-between items-start">

                <div>
                    <p className="font-semibold text-lg">
                    {selectedUser.last_name} {selectedUser.first_name}
                    </p>

                    <p className="text-sm text-gray-600">
                    📧 {selectedUser.email || "Немає email"}
                    </p>

                    <p className="text-sm text-gray-600">
                    📱 {selectedUser.phone_number || "Немає телефону"}
                    </p>
                </div>

                {/* 🔄 змінити */}
                <button
                    onClick={() => {
                    setSelectedUser(null);
                    setSearch("");
                    }}
                    className="text-sm text-blue-500 hover:underline"
                >
                    Змінити
                </button>

                </div>

            </div>
            )}
            </div>

          <div>
            <label className="block mb-1 font-medium">
              Дата повернення
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          {/* 🔹 Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition"
          >
            ✅ Видати книгу
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateOrder;