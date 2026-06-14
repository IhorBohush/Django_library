import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function ListOrders() {

const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(false);

const [search, setSearch] = useState("");
const [debouncedSearch, setDebouncedSearch] = useState("");

const [activeFilter, setActiveFilter] = useState("");
const [ordering, setOrdering] = useState("-created_at");

const [page, setPage] = useState(1);
const [count, setCount] = useState(0);

const [stats, setStats] = useState({
  active_orders: 0,
  overdue_orders: 0,
  total_orders: 0,
});

const navigate = useNavigate();

const pageSize = 12;

useEffect(() => {
  const timer = setTimeout(() => {
  setDebouncedSearch(search);
  setPage(1);
  }, 500);

  return () => clearTimeout(timer);

  }, [search]);

  useEffect(() => {
  loadOrders();
  }, [debouncedSearch, activeFilter, ordering, page]);

  const loadOrders = async () => {
  try {

    setLoading(true);

    const response = await axiosInstance.get("/orders/", {
      params: {
        search: debouncedSearch,
        is_active: activeFilter,
        ordering,
        page,
      },
    });

    setOrders(response.data.results);
    setCount(response.data.count);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }

  };

  useEffect(() => {
    axiosInstance.get("/orders/stats/")
      .then(res => setStats(res.data));
  }, []);

  const totalPages = Math.ceil(count / pageSize);

  const handleSort = (field) => {
    if (ordering === field) {
    setOrdering("-" + field);
    } else {
    setOrdering(field);
    }
  };

  // const activeOrders = orders.filter(
  //   (o) => o.is_active
  //   ).length;

  // const overdueOrders = orders.filter(
  //   (o) =>
  //   o.is_active &&
  //   o.due_date &&
  //   new Date(o.due_date) < new Date()
  //   ).length;

  return ( <div className="p-10">

    <h1 className="text-2xl font-bold mb-6">
      Список ордерів
    </h1>

    {/* Statistics */}

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <p className="text-gray-500 text-sm">
          Всього ордерів
        </p>

        <p className="text-3xl font-bold">
          {stats.total_orders}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <p className="text-gray-500 text-sm">
          Активні
        </p>

        <p className="text-3xl font-bold text-green-600">
          {stats.active_orders}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <p className="text-gray-500 text-sm">
          Прострочені
        </p>

        <p className="text-3xl font-bold text-red-600">
          {stats.overdue_orders}
        </p>
      </div>

    </div>

    {/* Filters */}

    <div className="flex gap-3 mb-5 flex-wrap">

      <input
        className="border p-2 rounded w-72"
        placeholder="Пошук по книзі або читачу..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="border p-2 rounded"
        value={activeFilter}
        onChange={(e) => {
          setActiveFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="">Усі ордери</option>
        <option value="true">Активні</option>
        <option value="false">Повернені</option>
      </select>

    </div>

    {/* Table */}

    <div className="border rounded-lg overflow-hidden bg-white">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th
              className="p-3 text-left"
            >
              Книга
            </th>

            <th
              className="p-3 text-left"
            >
              Читач
            </th>

            <th
              className="p-3 text-left cursor-pointer"
              onClick={() => handleSort("order_date")}
            >
              Видано
            </th>

            <th
              className="p-3 text-left cursor-pointer"
              onClick={() => handleSort("due_date")}
            >
              Повернути до
            </th>

            <th 
              className="p-3 text-left cursor-pointer"
              onClick={() => handleSort("return_date")}
            >
              Повернено
            </th>

            <th className="p-3 text-left">
              Статус
            </th>

            <th className="p-3 text-left">
            </th>

          </tr>

        </thead>

        <tbody>

          {loading && (
            <tr>
              <td colSpan="7" className="p-6 text-center">
                Завантаження...
              </td>
            </tr>
          )}

          {!loading && orders.length === 0 && (
            <tr>
              <td colSpan="7" className="p-6 text-center text-gray-500">
                Ордерів не знайдено
              </td>
            </tr>
          )}

          {!loading &&
            orders.map((order) => {

              const isOverdue =
                order.is_active &&
                order.due_date &&
                new Date(order.due_date) < new Date();

              return (
                <tr
                  key={order.id}
                  className={`border-t hover:bg-gray-50 ${
                    isOverdue ? "bg-red-50" : ""
                  }`}
                >

                  <td className="p-3">

                    <div className="font-medium">
                      {order.book_title}
                    </div>

                    <div className="text-sm text-gray-500">
                      № {order.book_number}
                    </div>

                  </td>

                  <td className="p-3">
                    {order.user_last_name} {order.user_first_name}
                  </td>

                  <td className="p-3">
                    {new Date(order.order_date).toLocaleDateString("uk-UA")}{" "}
                    {new Date(order.order_date).toLocaleTimeString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="p-3">
                    {order.due_date || "-"}
                  </td>

                  <td className="p-3">
                    {order.return_date ? (
                      <>
                        {new Date(order.return_date).toLocaleDateString("uk-UA")}{" "}
                        {new Date(order.return_date).toLocaleTimeString("uk-UA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-3">

                    {isOverdue ? (
                      <span className="px-2 py-1 rounded-full text-sm bg-red-100 text-red-700">
                        Прострочено
                      </span>
                    ) : order.is_active ? (
                      <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-700">
                        Активний
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                        Повернено
                      </span>
                    )}

                  </td>

                  <td className="p-3">

                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Переглянути
                    </button>

                  </td>

                </tr>
              );
            })}

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
        Сторінка {page} з {totalPages || 1}
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

export default ListOrders;
