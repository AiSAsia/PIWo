// import { Outlet } from "react-router-dom"; boolshit xD
import Navbar from "./components/Navbar";
import { BookProvider } from "./context/BookContext";
import {
  Outlet,
  Scripts,
} from "react-router";
export default function Root() {
  return (
    <BookProvider>
      <meta charSet="utf-8" />
      <Navbar />
      <main style={{ padding: "1rem" }}>
        <Outlet />
        <Scripts />

      </main>
    </BookProvider>
  );
}
