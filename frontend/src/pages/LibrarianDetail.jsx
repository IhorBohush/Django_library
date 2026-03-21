import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { AcademicCapIcon, CalendarIcon, CheckIcon } from "@heroicons/react/24/solid";

function ReaderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [librarian, setLibrarian] = useState(null);
  const [loading, setLoading] = useState(true);

  const [eMail, setEmail] = useState();
  const [passWord, setPassWord] = useState();
  
  const [modalType, setModalType] = useState(null);


  useEffect(() => {
    fetchLibrarian();
  }, [id]);

  const fetchLibrarian = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/users/librarians/${id}/`);
      setLibrarian(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (librarian) {
      setEmail(librarian.email);
      setPassWord("");
    }
  }, [librarian]);

  const handleCredent = async () => {
    try {
      const payload = { email: eMail };
      if (passWord) {
        payload.password = passWord;
      }

      const res = await axiosInstance.patch(
        `/users/update-librarian-credentials/${librarian.id}/`,
        payload
      );

      setEmail(eMail);
      setPassWord(""); // очистити після відправки

      setModalType(null);

      if (!passWord) {
        alert(
          "Поле пароль пусте — лист для встановлення пароля надіслано читачу ✅"
        );
      }

    // Оновлюємо статус читача після відповіді бекенду
    if (res.data.is_active !== undefined) {
      setIsActive(res.data.is_active);
    }

  } catch (error) {
    console.error(error);
    alert(
      error.response?.data?.detail || "Помилка оновлення емейлу/пароля"
    );
  }
};


  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!reader) return <div className="p-6 text-center text-red-500">Reader not found</div>;


  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Ви впевнені, що хочете видалити цього читача?"
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/users/delete-reader/${id}/`);
      navigate("/readers");
    } catch (error) {
      console.error(error);
      alert("Не вдалося видалити читача");
    }
  };

  return (
  <div className="p-10 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-8">Профіль читача</h1>

    <div className="bg-white shadow-lg rounded-xl p-8 space-y-8">

      {/* Основна інформація */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">ПІБ</p>
          <p className="text-lg font-semibold">
            {reader.last_name} {reader.first_name} {reader.middle_name}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-semibold">{eMail}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Тип читача</p>
          <p className="text-lg font-semibold">{reader.actor_type_display}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Телефон</p>
          <p className="text-lg font-semibold">{reader.phone_number}</p>
        </div>

        {reader.actor_type === "student" && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Професія</p>
            <p className="text-lg font-semibold">
              {reader.profession_name || reader.profession}
            </p>
          </div>
        )}
      </div>

      {/* Дати */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <AcademicCapIcon className="w-6 h-6 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Дата закінчення навчання</p>
            <p className="font-semibold">{reader.graduation_date || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <CheckIcon className="w-6 h-6 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Дата створення</p>
            <p className="font-semibold">{reader.created_at}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Дата оновлення</p>
            <p className="font-semibold">{reader.updated_at}</p>
          </div>
        </div>

        {!isActive && endDate && (
          <div className="flex items-center gap-3 bg-red-50 p-4 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-red-400" />
            <div>
              <p className="text-sm text-red-500">Дата блокування</p>
              <p className="font-semibold">{endDate}</p>
            </div>
          </div>
        )}
      </div>

      {/* Статус */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Статус</p>

        {isActive ? (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
            Активний
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
            Заблокований
          </span>
        )}
      </div>

      {/* Кнопки */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 pt-6 border-t">

        {/* Основні дії */}
        <div className="flex flex-wrap gap-3">

          {/* КНОПКА */}
          {isActive ? (
            <button
              onClick={() => setModalType('block')}
              className="px-5 py-2 bg-red-600 text-white rounded-lg"
            >
              Заблокувати
            </button>
          ) : (
            <button
              onClick={handleUnblock}
              className="px-5 py-2 bg-green-600 text-white rounded-lg cursor-pointer"
            >
              Розблокувати
            </button>
          )}

          <button
            onClick={() => navigate(`/readers/${id}/update`)}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Редагувати
          </button>

          <button
            onClick={() => setModalType('credentials')}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
          >
            Email / Пароль
          </button>

          {/* МОДАЛЬНЕ ВІКНО */}
          {modalType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setModalType(null)}
            >

            <div className="bg-white p-6 rounded-lg w-96"
            onClick={(e) => e.stopPropagation()}
            >

              {/* BLOCK MODAL */}
              {modalType === "block" && (
                <>
                  <h2 className="text-lg font-semibold mb-4">
                    Блокування читача
                  </h2>

                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border px-3 py-2 w-full rounded mb-4"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setModalType(null)}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Скасувати
                    </button>

                    <button
                      onClick={handleBlock}
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      Заблокувати
                    </button>
                  </div>
                </>
              )}

              {/* CREDENTIALS MODAL */}
              {modalType === "credentials" && (
                <>
                  <h2 className="text-lg font-semibold mb-4">
                    Email/пароль читача
                  </h2>

                  <input
                    type="email"
                    value={eMail}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border px-3 py-2 w-full rounded mb-4"
                  />

                  <input
                    type="password"
                    value={passWord}
                    onChange={(e) => setPassWord(e.target.value)}
                    className="border px-3 py-2 w-full rounded mb-4"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setModalType(null)}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Скасувати
                    </button>

                    <button
                      onClick={handleCredent}
                      className="px-4 py-2 bg-indigo-600 text-white rounded"
                    >
                      Зберегти
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        )}

        </div>

        {/* Небезпечна дія */}
        {!isActive && (
          <button
            onClick={handleDelete}
            className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-medium transition"
          >
            Видалити читача
          </button>
        )}

      </div>

    </div>
  </div>
);
}

export default ReaderDetail;