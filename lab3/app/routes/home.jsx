import { useState } from "react";
import BookList from "../components/BookList";

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <h1>Wyszukiwarka książek</h1>
      <input
        type="text"
        placeholder="Szukaj po tytule lub autorze..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        autoFocus
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />
      <BookList query={query} />
    </div>
  );
}
