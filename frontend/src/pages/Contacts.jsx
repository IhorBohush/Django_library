import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import SEO from "../components/SEO";

import {
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

import {
    FaFacebook,
    FaInstagram,
    FaYoutube,
    FaGlobe,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
} from "react-icons/fa";

function Contacts() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/about/")
      .then((res) => {
        const data = res.data.results || res.data;

        if (data.length > 0) {
            setAbout(data[0]);
        }
    })
      .catch(console.error);
  }, []);

  if (!about) {
    return (
      <div className="text-center py-20 text-xl">
        Завантаження...
      </div>
    );
  }

  return (
    <>
    <SEO
      title="Контакти"
      description={`Контакти бібліотеки ${about.institution_name}`}
    />
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}

      <section className="bg-linear-to-r from-sky-700 to-sky-500 text-white py-20">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold mb-6">
            Контакти
          </h1>

          <p className="text-xl text-sky-100">
            Зв'яжіться з нами будь-яким зручним способом.
          </p>

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Контакти */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-3xl font-bold mb-8 text-sky-700">
              Контактна інформація
            </h2>

            <div className="space-y-6">

              <ContactItem
                  icon={<FaMapMarkerAlt className="text-red-600 text-2xl" />}
                  title="Адреса"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${about.region}, ${about.district}, ${about.town}, ${about.street} ${about.building_number}`
                  )}`}
              >
                  <div className="text-gray-600 space-y-1">
                    <p><strong>Індекс:</strong> {about.postal_code}</p>
                    <p><strong>Область:</strong> {about.region}</p>
                    <p><strong>Район:</strong> {about.district}</p>
                    <p><strong>Населений пункт:</strong> {about.town}</p>
                    <p><strong>Адреса:</strong> вул. {about.street}, {about.building_number}</p>
                  </div>
              </ContactItem>

              <ContactItem
                  icon={<FaPhoneAlt className="text-green-600 text-2xl" />}
                  title="Телефон"
                  href={`tel:${about.phone_number_1}`}
              >
                  {about.phone_number_1}
              </ContactItem>

              {about.phone_number_2 && (
                <ContactItem
                  icon={<FaPhoneAlt className="text-green-600 text-2xl" />}
                  title="Додатковий телефон"
                  href={`tel:${about.phone_number_2}`}
              >
                  {about.phone_number_2}
              </ContactItem>
              )}

              <ContactItem
                icon={<FaEnvelope className="text-red-500 text-2xl" />}
                title="Email"
                href={`mailto:${about.email}`}
            >
                {about.email}
            </ContactItem>

              {about.website && (
                <ContactItem
                  icon={<FaGlobe className="text-sky-600 text-2xl" />}
                  title="Офіційний сайт"
                  href={about.website}
              >
                  {about.website}
              </ContactItem>
              )}

              {about.working_hours && (
                <ContactItem
                  icon={<ClockIcon className="w-7 h-7 text-orange-500" />}
                  title="Графік роботи"
                  value={about.working_hours}
              >
                {about.working_hours}
              </ContactItem>
              )}

            </div>

          </div>

          {/* Соціальні мережі */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-3xl font-bold mb-8 text-sky-700">
              Ми у соціальних мережах
            </h2>

            <div className="grid gap-5">

              {about.facebook && (

                  <SocialCard
                      color="bg-blue-600"
                      icon={<FaFacebook size={28} />}
                      title="Facebook"
                      href={about.facebook}
                  />

              )}

              {about.instagram && (

                  <SocialCard
                      color="bg-pink-600"
                      icon={<FaInstagram size={28} />}
                      title="Instagram"
                      href={about.instagram}
                  />

              )}

              {about.youtube && (

                  <SocialCard
                      color="bg-red-600"
                      icon={<FaYoutube size={28} />}
                      title="YouTube"
                      href={about.youtube}
                  />

              )}

          </div>

          </div>

        </div>

      </section>

      {/* Карта */}

      {about.map && (
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-6">

            <h2 className="text-4xl font-bold text-center mb-10">
              Як нас знайти
            </h2>

            <div className="flex justify-center">
              <div
                className="map-container rounded-2xl overflow-hidden shadow-xl"
                dangerouslySetInnerHTML={{ __html: about.map }}
              />
            </div>
          </div>
        </section>
      )}

    </div>
  </>);
}

function ContactItem({
    icon,
    title,
    children,
    href
}) {

    return (

        <div className="flex gap-5 items-start">

            <div className="mt-1">
                {icon}
            </div>

            <div>

                <h3 className="font-semibold text-lg mb-1">
                    {title}
                </h3>

                {href ? (

                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 hover:underline break-all"
                    >
                        {children}
                    </a>

                ) : (

                    <p className="text-gray-600">
                        {children}
                    </p>

                )}

            </div>

        </div>

    );

}

function SocialCard({ icon, title, href, color }) {

    return (

        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${color}
            text-white
            rounded-xl
            p-5
            flex
            items-center
            gap-5
            hover:scale-105
            transition`}
        >

            {icon}

            <div>

                <h3 className="font-bold">
                    {title}
                </h3>

                <p className="text-sm opacity-80">
                    Перейти →
                </p>

            </div>

        </a>

    );

}

export default Contacts;