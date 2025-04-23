import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Strona główna</Link>
      <Link to="/new" style={{ marginRight: "1rem" }}>Dodaj książkę</Link>
      <button style={{ float: "right" }}>Login</button>
    </nav>
  );
}
