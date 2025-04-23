import { useBooks } from "../context/BookContext";

export default function BookList({ query }) {
  const { filterBooks } = useBooks();
  const filtered = filterBooks(query);

  return (
    <div>
      <h2>Lista książek</h2>
      <ul>
        {filtered.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> – {book.author}
            <button disabled style={{ marginLeft: "1rem" }}>Edytuj</button>
            <button disabled style={{ marginLeft: "0.5rem" }}>Usuń</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
