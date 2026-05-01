import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchMovies, IMG } from "../api/tmdb";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [input, setInput] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) { setResults([]); return; }
    setLoading(true);
    searchMovies(q)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  const onSubmit = (e) => {
    e.preventDefault();
    setParams(input ? { q: input } : {});
  };

  return (
    <main className="page">
      <form onSubmit={onSubmit} className="search__form">
        <input
          autoFocus
          type="search"
          placeholder="Search for movies…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn--primary">Search</button>
      </form>

      {loading && <p>Searching…</p>}
      {!loading && q && results.length === 0 && <p>No results for “{q}”.</p>}

      <div className="grid">
        {results.map((m) => (
          <Link to={`/movie/${m.id}`} key={m.id} className="grid__card">
            {m.poster_path ? (
              <img src={IMG(m.poster_path, "w342")} alt={m.title} loading="lazy" />
            ) : (
              <div className="card__placeholder">{m.title}</div>
            )}
            <div className="grid__title">{m.title}</div>
            <div className="grid__meta">★ {m.vote_average?.toFixed(1)} · {(m.release_date || "").slice(0, 4)}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
