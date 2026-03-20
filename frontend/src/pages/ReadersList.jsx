import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

function ReadersList() {

  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [actorChoices, setActorChoices] = useState([]);
  const [actorType, setActorType] = useState("");
  const [isActive, setIsActive] = useState("");

  const [professions, setProfessions] = useState([]);
  const [profession, setProfession] = useState("");

  const [graduationFrom, setGraduationFrom] = useState("");
  const [graduationTo, setGraduationTo] = useState("");

  const [ordering, setOrdering] = useState("-created_at");

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();

  const pageSize = 10;

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchProfessions();
  }, []);

  const fetchProfessions = async () => {
    try {
      const res = await axiosInstance.get("/professions/");
      setProfessions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
  const fetchChoices = async () => {
    try {
      const response = await axiosInstance.get("/users/actors-choices/");
      setActorChoices(response.data.actor_types);
    } catch (error) {
      console.error("Помилка отримання actor choices", error);
    }
  };

  fetchChoices();
}, []);

  useEffect(() => {
    fetchReaders();
  }, [debouncedSearch, actorType, isActive, profession, graduationFrom, graduationTo, ordering, page]);

  const fetchReaders = async () => {
    try {

      setLoading(true);

      const res = await axiosInstance.get("/users/readers/", {
        params: {
          search: debouncedSearch,
          actor_type: actorType,
          profession: profession,
          graduation_from: graduationFrom,
          graduation_to: graduationTo,
          is_active: isActive,
          ordering: ordering,
          page: page
        }
      });

      setReaders(res.data.results);
      setCount(res.data.count);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(count / pageSize);

  // sorting by column
  const handleSort = (field) => {
    if (ordering === field) {
      setOrdering("-" + field);
    } else {
      setOrdering(field);
    }
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Читачі бібліотеки
      </h1>

      {/* Filters */}

      <div className="flex gap-3 mb-4 flex-wrap">

        <input
          className="border p-2 rounded w-64"
          placeholder="Пошук по імені або email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => {
            setActorType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Всі типи</option>

          {actorChoices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => {
            setProfession(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Всі професії</option>

          {professions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}

        </select>

        <div className="flex gap-2 items-center">

          <div className="flex flex-col relative">
            <label className="text-sm font-medium">Graduation From</label>
            <input
              type="date"
              className="border p-2 pl-10 h-10 rounded w-48"
              value={graduationFrom}
              onChange={(e) => setGraduationFrom(e.target.value)}
            />
            <AcademicCapIcon className="w-5 h-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex flex-col relative">
            <label className="text-sm font-medium">Graduation To</label>
            <input
              type="date"
              className="border p-2 pl-10 h-10 rounded w-48"
              value={graduationTo}
              onChange={(e) => setGraduationTo(e.target.value)}
            />
            <AcademicCapIcon className="w-5 h-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

        </div>

        <select
          className="border p-2 rounded"
          onChange={(e) => {
            setIsActive(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Всі статуси</option>
          <option value="true">Активний</option>
          <option value="false">Заблокований</option>
        </select>

      </div>

      {/* Table */}

      <div className="border rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>

              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort("last_name")}
              >
                Прізвище
              </th>
              
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort("first_name")}
              >
                Ім'я
              </th>

              <th className="p-3 text-left">
                Професія
              </th>

              <th className="p-3 text-left">
                Тип читача
              </th>

              <th className="p-3 text-left">
                Дата закінчення
              </th>

              <th className="p-3 text-left">
                Активність
              </th>

              <th className="p-3 text-left">
              </th>

            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && readers.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No readers found
                </td>
              </tr>
            )}

            {!loading && readers.map((reader) => (

              <tr key={reader.id} className="border-t hover:bg-gray-50">

                <td className="p-3">
                  {reader.last_name}
                </td>

                <td className="p-3">
                  {reader.first_name}
                </td>

                <td className="p-3">
                  {reader.profession}
                </td>

                <td className="p-3">
                  {reader.actor_type_display}
                </td>

                <td className="p-3">
                  {reader.graduation_date}
                </td>

                <td className="p-3">
                  {reader.is_active ? "✅" : "❌"}
                </td>

                <td>
                <button
                  onClick={() => navigate(`/readers/${reader.id}`)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Переглянути
                </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex items-center gap-3 mt-5">

        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Попередня
        </button>

        <span>
          Сторінка {page} з {totalPages}
        </span>

        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Наступна
        </button>

      </div>

    </div>
  );
}

export default ReadersList;