import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function SetupPassword() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
        setError("Паролі не співпадають");
        return;
    }

    try {
        await axiosInstance.patch(
        `/users/setup-password/${uidb64}/${token}/`,
        { password },
        { skipAuth: true }
        );

        setSuccess("Пароль успішно встановлено ✅");

        setTimeout(() => {
        navigate("/login");
        }, 2000);

    } catch (err) {
        setError(
        err.response?.data?.detail || "Недійсне або прострочене посилання"
        );
    }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          Встановлення пароля
        </h2>

        <input
          type="password"
          placeholder="Новий пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 w-full rounded"
          required
        />

        <input
          type="password"
          placeholder="Підтвердження пароля"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border px-3 py-2 w-full rounded"
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
          Встановити пароль
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm text-center">{success}</p>
        )}
      </form>

    </div>
  );
}

export default SetupPassword;