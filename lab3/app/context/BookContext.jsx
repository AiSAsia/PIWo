import { createContext, useContext, useState } from "react";

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([
    { id: 1, title: "Wiedźmin", author: "Andrzej Sapkowski" },
    { id: 2, title: "Lalka", author: "Bolesław Prus" },
    { id: 3, title: "Quo Vadis", author: "Henryk Sienkiewicz" }
  ]);

  const addBook = (book) => {
    setBooks([...books, { ...book, id: Date.now() }]);
  };

  const filterBooks = (query) => {
    const q = (query || "").toLowerCase().trim();
    if (!q) return books;
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q)
    );
  };

  return (
    <BookContext.Provider value={{ books, addBook, filterBooks }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => useContext(BookContext);
