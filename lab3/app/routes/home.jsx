import { useState } from "react";
import BookList from "../components/BookList";

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <h1>Wyszukiwarka książek</h1>
      <input
        type="text"
        placeholder="Szukaj..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <BookList query={query} />
    </div>
  );
}
