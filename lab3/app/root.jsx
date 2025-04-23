import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { BookProvider } from "./context/BookContext";

export default function Root() {
  return (
    <BookProvider>
      <meta charSet="utf-8" />
      <Navbar />
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </BookProvider>
  );
}

