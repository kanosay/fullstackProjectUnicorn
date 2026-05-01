import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchList, IMG } from "../api/tmdb";
import { useFavorites } from "../context/FavoritesContext";

export default function Row({ title, endpoint }) {
  const [movies, setMovies] = useState([]);
  const trackRef = useRef(null);
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    fetchList(endpoint).then(setMovies).catch(() => {});
  }, [endpoint]);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="row">
      <h2 className="row__title">{title}</h2>
      <div className="row__wrap">
        <button className="row__arrow row__arrow--left" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
        <div className="row__track" ref={trackRef}>
          {movies.map((m) => (
            <div key={m.id} className="card">
              <Link to={`/movie/${m.id}`}>
                {m.poster_path ? (
                  <img src={IMG(m.poster_path, "w342")} alt={m.title || m.name} loading="lazy" />
                ) : (
                  <div className="card__placeholder">{m.title || m.name}</div>
                )}
              </Link>
              <div className="card__hover">
                <div className="card__title">{m.title || m.name}</div>
                <div className="card__meta">
                  ★ {m.vote_average?.toFixed(1)} · {(m.release_date || "").slice(0, 4)}
                </div>
                <div className="card__buttons">
                  <Link to={`/movie/${m.id}`} className="btn btn--small btn--primary">▶ Play</Link>
                  <button
                    className="btn btn--small btn--icon"
                    onClick={() => toggle(m)}
                    title={isFavorite(m.id) ? "Remove from My List" : "Add to My List"}
                  >
                    {isFavorite(m.id) ? "✓" : "+"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="row__arrow row__arrow--right" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
      </div>
    </section>
  );
}
