import { useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { getUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // 1. Отримуємо токени
    const response = await axiosInstance.post("login/", { email, password });
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    // 2. Отримуємо профіль користувача
    const userRes = await axiosInstance.get("users/profile/", {
      headers: { Authorization: `Bearer ${response.data.access}` },
    });
    localStorage.setItem("user", JSON.stringify(userRes.data));

    navigate("/profile");
  } catch (err) {
    alert("Невірний email або пароль");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Вхід до системи
        </h2>

        <input
          type="text"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Увійти
        </button>
      </form>

    </div>
  );
}

export default Login;