import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Hero() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center">
  {/* Фонове зображення зафіксоване */}
  <div
    className="absolute inset-0 bg-[url(/images/a_digital_illustration_of_a_modern_library_feature.png)] bg-cover bg-center bg-no-repeat bg-fixed"
  ></div>

  {/* Темний overlay для контрасту */}
  <div className="absolute inset-2 bg-black/50 rounded-2xl"></div>

  {/* Контент, який скролиться */}
  <div className="relative max-w-6xl mx-auto px-8 text-center py-20">
    <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
      Бібліотека
    </h1>

    <div className="inline-block bg-black/40 px-4 py-2 rounded-2xl">
    <h2 className="text-2xl md:text-3xl font-extrabold text-sky-300 drop-shadow-md mb-6">
      ДНЗ "Полонський агропромисловий центр професійної освіти"
    </h2>
    

    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-200 drop-shadow-sm mb-8">
      Сучасна електронна бібліотека для студентів та викладачів.
      Пошук книг, категорії та доступ до навчальних матеріалів в одному місці.
    </p>
    </div>

    <Link
      to="/categories/fiction"
      className="bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-xl text-lg font-semibold transition shadow-lg"
    >
      Переглянути категорії
    </Link>
  </div>
</section>
  );
}