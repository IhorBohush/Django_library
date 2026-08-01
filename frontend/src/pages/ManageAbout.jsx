import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function ManageAbout() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [aboutId, setAboutId] = useState(null);

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    institution_name: "",
    description: "",

    region: "",
    district: "",
    town: "",
    street: "",
    building_number: "",
    postal_code: "",

    phone_number_1: "",
    phone_number_2: "",

    email: "",

    website: "",
    facebook: "",
    instagram: "",
    youtube: "",

    working_hours: "",

    librarian_first_name: "",
    librarian_last_name: "",
    about_librarian: "",
    map: "",

    librarian_photo: null,
  });

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const res = await axiosInstance.get("/about/");
      const data = res.data.results || res.data;
      if (data.length > 0) {
        const about = data[0];

        setAboutId(about.id);

        setFormData({
          institution_name: about.institution_name || "",
          description: about.description || "",

          region: about.region || "",
          district: about.district || "",
          town: about.town || "",
          street: about.street || "",
          building_number: about.building_number || "",
          postal_code: about.postal_code || "",

          phone_number_1: about.phone_number_1 || "",
          phone_number_2: about.phone_number_2 || "",

          email: about.email || "",

          website: about.website || "",
          facebook: about.facebook || "",
          instagram: about.instagram || "",
          youtube: about.youtube || "",

          working_hours: about.working_hours || "",

          
          librarian_first_name: about.librarian_first_name || "",
          librarian_last_name: about.librarian_last_name || "",
          about_librarian: about.about_librarian || "",
          map: about.map || "",

          librarian_photo: about.librarian_photo?.id || null,
        });

        if (about.librarian_photo?.file_url) {
          setPreview(about.librarian_photo.file_url);
        } else if (about.librarian_photo?.file) {
          setPreview(about.librarian_photo.file);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let uploadId =
        typeof formData.librarian_photo === "object"
          ? formData.librarian_photo?.id
          : formData.librarian_photo;

      if (photo) {
        const uploadForm = new FormData();
        uploadForm.append("file", photo);

        const uploadRes = await axiosInstance.post(
          "/uploads/create/",
          uploadForm
        );

        uploadId = uploadRes.data.id;
      }

      const payload = {
        ...formData,
        librarian_photo: uploadId || null,
      };

      if (aboutId) {
        await axiosInstance.patch(`/about/${aboutId}/`, payload);
        alert("Інформацію успішно оновлено.");
      } else {
        await axiosInstance.post("/about/", payload);
        alert("Інформацію успішно створено.");
      }

      navigate("/contacts");
    } catch (err) {
      console.error("About save error:", err.response?.data || err);
      alert("Сталася помилка.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Завантаження...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-3xl font-bold mb-8 text-sky-700">

          {aboutId
            ? "Редагування сторінки «Про бібліотеку»"
            : "Створення сторінки «Про бібліотеку»"}

        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-10"
        >
                    {/* Загальна інформація */}

          <Section title="📚 Загальна інформація">

            <Input
              label="Назва навчального закладу"
              name="institution_name"
              value={formData.institution_name}
              onChange={handleChange}
              required
            />

            <Textarea
              label="Опис бібліотеки"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              required
            />

          </Section>

          {/* Адреса */}

          <Section title="📍 Адреса">

            <div className="grid md:grid-cols-2 gap-6">

              <Input
                label="Область"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
              />

              <Input
                label="Район"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              />

              <Input
                label="Місто / Селище"
                name="town"
                value={formData.town}
                onChange={handleChange}
                required
              />

              <Input
                label="Вулиця"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />

              <Input
                label="Будинок"
                name="building_number"
                value={formData.building_number}
                onChange={handleChange}
                required
              />

              <Input
                label="Поштовий індекс"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
              />

            </div>

          </Section>

          {/* Контакти */}

          <Section title="☎ Контактна інформація">

            <div className="grid md:grid-cols-2 gap-6">

              <Input
                label="Телефон №1"
                name="phone_number_1"
                value={formData.phone_number_1}
                onChange={handleChange}
                required
              />

              <Input
                label="Телефон №2"
                name="phone_number_2"
                value={formData.phone_number_2}
                onChange={handleChange}
              />

            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Офіційний сайт"
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://..."
            />

          </Section>

          {/* Соціальні мережі */}

          <Section title="🌐 Соціальні мережі">

            <div className="grid md:grid-cols-3 gap-6">

              <Input
                label="Facebook"
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
              />

              <Input
                label="Instagram"
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
              />

              <Input
                label="YouTube"
                type="url"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
              />

            </div>

          </Section>

          {/* Робочий час */}

          <Section title="🕒 Робочі години">

            <Input
              label="Наприклад: Пн-Пт 08:00 - 17:00"
              name="working_hours"
              value={formData.working_hours}
              onChange={handleChange}
            />

          </Section>

          {/* Бібліотекар */}

          <Section title="👩‍🏫 Бібліотекар">

            <Input
              label="Ім'я бібліотекаря"
              name="librarian_first_name"
              value={formData.librarian_first_name}
              onChange={handleChange}
            />

            <Input
              label="Прізвище бібліотекаря"
              name="librarian_last_name"
              value={formData.librarian_last_name}
              onChange={handleChange}
            />

            <Textarea
              label="Інформація про бібліотекаря"
              name="about_librarian"
              value={formData.about_librarian}
              onChange={handleChange}
              rows={6}
            />

            <div>

              <label className="block font-semibold mb-2">
                Фотографія бібліотекаря
              </label>
              {photo && (
                <p className="text-sm text-gray-500 mt-2">
                  Обрано: {photo.name}
                </p>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="w-full border rounded-lg p-2"
              />

            </div>

            {preview && (

              <div className="mt-5">

                <img
                  src={preview}
                  alt="Бібліотекар"
                  className="w-64 rounded-xl shadow-lg border"
                />

              </div>

            )}

          </Section>

          {/* Google Maps */}

          <Section title="🗺 Google Maps">

            <Textarea
              label="Вставте iframe Google Maps"
              name="map"
              value={formData.map}
              onChange={handleChange}
              rows={8}
            />

          </Section>

          {/* Кнопка */}

          <div className="flex justify-end">

            <button
              type="submit"
              disabled={saving}
              className="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-10 py-3 rounded-xl text-lg font-semibold transition"
            >

              {saving
                ? "Збереження..."
                : aboutId
                ? "Зберегти зміни"
                : "Створити інформацію"}

            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="mr-3 border border-gray-300 px-10 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              Скасувати
            </button>

          </div>
                  </form>

      </div>

    </div>
  );
}

/* ==========================
   Допоміжні компоненти
========================== */

function Section({ title, children }) {
  return (
    <div className="border rounded-2xl p-6 bg-gray-50">

      <h2 className="text-2xl font-bold text-sky-700 mb-6">
        {title}
      </h2>

      <div className="space-y-5">
        {children}
      </div>

    </div>
  );
}

function Input({
  label,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div>

      <label className="block font-semibold text-gray-700 mb-2">

        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}

      </label>

      <input
        {...props}
        className={`w-full border border-gray-300 rounded-xl px-4 py-3
        focus:outline-none focus:ring-2 focus:ring-sky-500
        focus:border-sky-500 transition ${className}`}
      />

    </div>
  );
}

function Textarea({
  label,
  rows = 5,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div>

      <label className="block font-semibold text-gray-700 mb-2">

        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}

      </label>

      <textarea
        rows={rows}
        {...props}
        className={`w-full border border-gray-300 rounded-xl px-4 py-3
        resize-none
        focus:outline-none focus:ring-2 focus:ring-sky-500
        focus:border-sky-500 transition ${className}`}
      />

    </div>
  );
}

export default ManageAbout;