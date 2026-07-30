import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import CountUp from "react-countup";
import SEO from "../components/SEO";

import {
  BookOpenIcon,
  UsersIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

function About() {
  const [stats, setStats] = useState({
    total_books: 0,
    not_available: 0,
    total_categories: 0,
    total_readers: 0,
    active_readers: 0,
    students: 0,
    staff: 0,
  });
  const [about, setAbout] = useState({
    about_librarian: "",
    librarian_photo: null,
    librarian_first_name: "",
    librarian_last_name: "",
    institution_name: "",
  });

  useEffect(() => {
    Promise.all([
      axiosInstance.get("books-stats/"),
      axiosInstance.get("categories-stats/"),
      axiosInstance.get("users/readers-stats/"),
    ])
      .then(([books, categories, readers]) => {
        setStats({
          ...books.data,
          ...categories.data,
          ...readers.data,
        });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/about/")
      .then((res) => {
        const data = res.data.results || res.data;
        if (data.length > 0) {
        const about = data[0];
        setAbout(about);}
      })
      .catch(console.error);
  }, []);


  return (
    <>
    <SEO
      title="Про нас"
      description={`Інформація про бібліотеку ${about.institution_name}`}
    />
    <div className="bg-gray-50">

      {/* Hero */}

      <section className="bg-linear-to-r from-sky-700 to-sky-500 text-white py-24">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Електронна бібліотека
          </h1>

          <p className="max-w-3xl mx-auto text-xl leading-9 text-sky-100">
            Сучасна інформаційна система для швидкого пошуку книг,
            ведення електронного обліку літератури та комфортного
            користування бібліотечним фондом.
          </p>

        </div>

      </section>

      {/* Statistics */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-4xl font-bold text-center mb-14">
          Статистика бібліотеки
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

          <StatCard
            icon={<BookOpenIcon className="w-12 h-12 text-sky-600" />}
            value={stats.total_books}
            label="Книг"
          />

          <StatCard
            icon={<ClipboardDocumentListIcon className="w-12 h-12 text-red-500" />}
            value={stats.not_available}
            label="Видано"
          />

          <StatCard
            icon={<UsersIcon className="w-12 h-12 text-green-600" />}
            value={stats.total_readers}
            label="Читачів"
          />

          <StatCard
            icon={<FolderIcon className="w-12 h-12 text-indigo-600" />}
            value={stats.total_categories}
            label="Категорій"
          />

          <StatCard
            icon={<ShieldCheckIcon className="w-12 h-12 text-emerald-600" />}
            value={stats.active_readers}
            label="Активних читачів"
          />

          <StatCard
            icon={<AcademicCapIcon className="w-12 h-12 text-orange-500" />}
            value={stats.students}
            label="Студентів"
          />

          <StatCard
            icon={<UserGroupIcon className="w-12 h-12 text-purple-600" />}
            value={stats.staff}
            label="Працівників"
          />

          <div className="rounded-2xl shadow-lg bg-linear-to-br from-sky-600 to-sky-500 text-white flex flex-col items-center justify-center p-6">

            <BookOpenIcon className="w-14 h-14 mb-3"/>

            <h3 className="text-2xl font-bold">
              Бібліотека працює
            </h3>

            <p className="mt-2 text-center text-sky-100">
              Для студентів та працівників навчального закладу
            </p>

          </div>

        </div>

      </section>

      {/* Advantages */}

      <section className="bg-white py-20">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-14">
            Чому обирають нас?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            <Advantage
              icon={<BookOpenIcon className="w-10 h-10 text-sky-600"/>}
              title="Великий фонд"
              text="Тисячі книг різних напрямків та категорій."
            />

            <Advantage
              icon={<MagnifyingGlassIcon className="w-10 h-10 text-sky-600"/>}
              title="Швидкий пошук"
              text="Пошук за назвою, автором та категоріями."
            />

            <Advantage
              icon={<ClipboardDocumentListIcon className="w-10 h-10 text-sky-600"/>}
              title="Електронний облік"
              text="Автоматичний контроль видачі та повернення книг."
            />

            <Advantage
              icon={<ShieldCheckIcon className="w-10 h-10 text-sky-600"/>}
              title="Зручність"
              text="Простий та зрозумілий інтерфейс для читачів."
            />

          </div>

        </div>

      </section>

      {/* Timeline */}

      <section className="py-20 bg-gray-50">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-16">
            Як користуватися бібліотекою
          </h2>

          <div className="grid md:grid-cols-5 gap-8">

            {[
              ["1", "Авторизація", "Увійдіть у власний акаунт."],
              ["2", "Пошук", "Знайдіть необхідну книгу."],
              ["3", "Замовлення", "Зверніться до бібліотекаря."],
              ["4", "Читання", "Користуйтеся літературою."],
              ["5", "Повернення", "Поверніть книгу вчасно."],
            ].map((item) => (

              <div
                key={item[0]}
                className="text-center bg-white rounded-xl shadow-lg p-8 hover:-translate-y-2 transition"
              >

                <div className="w-16 h-16 rounded-full bg-sky-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item[0]}
                </div>

                <h3 className="font-bold text-xl mb-3">
                  {item[1]}
                </h3>

                <p className="text-gray-600">
                  {item[2]}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Librarian */}

      <section className="py-20">

        <div className="max-w-5xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-12">
            Наш бібліотекар
          </h2>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            <div className="grid md:grid-cols-2">

              <div className="bg-gray-200 min-h-105 flex items-center justify-center">

                <span className="text-gray-500 text-xl">
                  {about.librarian_photo ? (
                    <img
                      src={about.librarian_photo.file}
                      alt="Бібліотекар"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>Фото не завантажено</span>
                  )}
                </span>

              </div>

              <div className="p-12 flex flex-col justify-center">

                <h3 className="text-3xl font-bold mb-6">
                  {about.librarian_first_name} {about.librarian_last_name}
                </h3>

                <p className="text-gray-600 leading-8 text-lg">

                  {about.about_librarian || "Інформація про бібліотекаря відсутня."}

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  </>);
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:-translate-y-2 transition duration-300">

      <div className="flex justify-center mb-4">
        {icon}
      </div>

      <h2 className="text-5xl font-bold text-sky-600">

        <CountUp
          end={value}
          duration={2}
        />

      </h2>

      <p className="mt-3 text-gray-600">
        {label}
      </p>

    </div>
  );
}

function Advantage({ icon, title, text }) {
  return (
    <div className="bg-gray-50 rounded-2xl shadow p-8 hover:shadow-xl transition">

      <div className="mb-5">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-3">
        {title}
      </h3>

      <p className="text-gray-600 leading-7">
        {text}
      </p>

    </div>
  );
}

export default About;