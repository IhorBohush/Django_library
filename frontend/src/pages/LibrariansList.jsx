import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

function LibrariansList() {
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/users/librarians/")
      .then(res => setLibrarians(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-12">

      <h1 className="text-2xl font-bold mb-6">
        Список бібліотекарів
      </h1>

      <div className="bg-white shadow rounded-lg">

        {loading ? (
          <p className="p-4 text-gray-500">Завантаження...</p>
        ) : librarians.length === 0 ? (
          <p className="p-4 text-gray-600">Ще немає бібліотекарів.</p>
        ) : (

          <table className="w-full text-left">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Ім'я</th>
                <th className="p-3">Прізвище</th>
                <th className="p-3">По батькові</th>
              </tr>
            </thead>

            <tbody>
              {librarians.map((lib) => (
                <tr key={lib.id} className="border-t">
                  <td className="p-3">{lib.first_name}</td>
                  <td className="p-3">{lib.last_name}</td>
                  <td className="p-3">{lib.middle_name}</td>
                </tr>
              ))}
            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default LibrariansList;