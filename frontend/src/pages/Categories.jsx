import { useParams } from "react-router-dom";

function Categories() {
  const { categoryName } = useParams();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Категорія: {categoryName}</h1>
      <p>Тут пізніше буде список книг цієї категорії.</p>
    </div>
  );
}

export default Categories;