import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

function Footer() {

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

  return (
    <footer style={styles.footer}>
      © {new Date().getFullYear()} Бібліотека {about?.institution_name || "закладу"}. Всі права захищені.
    </footer>
  );
}

const styles = {
  footer: {
    textAlign: "center",
    padding: "20px",
    background: "#0f172a",
    color: "white"
  }
};

export default Footer;