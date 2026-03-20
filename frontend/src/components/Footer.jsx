function Footer() {
  return (
    <footer style={styles.footer}>
      © 2026 Бібліотека ДНЗ "Полонський агропромисловий центр професійної освіти". Всі права захищені.
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