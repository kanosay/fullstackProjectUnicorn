import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__left">
        <Link to="/" className="nav__logo">Abdu FLIX</Link>
        <nav className="nav__links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/my-list">My List</NavLink>
          <NavLink to="/search">Browse</NavLink>
        </nav>
      </div>
      <div className="nav__right">
        <form onSubmit={onSubmit} className="nav__search">
          <input
            type="search"
            placeholder="Titles, people, genres"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        <Link to="/login" className="nav__avatar" title="Profile">A</Link>
      </div>
    </header>
  );
}
