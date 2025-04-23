import { useState } from "react";
import { useBooks } from "../context/BookContext";
import { useNavigate } from "react-router-dom";

export default function BookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const { addBook } = useBooks();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author) return;
    addBook({ title, author });
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Tytuł:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Autor:</label>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>
      <button type="submit">Dodaj książkę</button>
    </form>
  );
}
