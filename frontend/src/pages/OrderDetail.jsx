import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function DetailOrder() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await axiosInstance.get(`/orders/${id}/detail/`);
      setOrder(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Видалити ордер?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/orders/${id}/delete/`);
      navigate("/orders");
    } catch (error) {
      alert(error.response?.data?.detail || "Помилка видалення");
    }
  };

  const handleReturnBook = async () => {
    try {
      await axiosInstance.patch(`/orders/${id}/update/`, {
        is_active: false,
      });

      loadOrder();
    } catch (error) {
      console.error(error);
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

    return (
    <div className="max-w-4xl mx-auto p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Деталі ордера
        </h1>

        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
        >
          Назад
        </button>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {order.book_title}
            </h2>

            <p className="text-sm text-gray-500">
              Примірник № {order.book_number}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.is_active
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {order.is_active ? "Активний" : "Повернено"}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              Читач
            </p>

            <p className="font-medium">
              {order.user_first_name} {order.user_last_name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Дата видачі
            </p>

            <p>
              {new Date(order.order_date).toLocaleString("uk-UA")}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Повернути до
            </p>

            <p>
              {order.due_date
                ? new Date(order.due_date).toLocaleDateString("uk-UA")
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Дата повернення
            </p>

            <p>
              {order.return_date
                ? new Date(order.return_date).toLocaleString("uk-UA")
                : "Книгу ще не повернуто"}
            </p>
          </div>

        </div>

        <div className="px-6 py-4 border-t flex gap-3">

          {order.is_active ? (
            <button
              onClick={handleReturnBook}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Здати книгу
            </button>
          ) : (
            <button
              onClick={handleDelete}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Видалити ордер
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default DetailOrder;