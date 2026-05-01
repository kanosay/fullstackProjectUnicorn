import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchList, endpoints, IMG } from "../api/tmdb";
import { useFavorites } from "../context/FavoritesContext";

export default function Hero() {
  const [movie, setMovie] = useState(null);
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    fetchList(endpoints.trending).then((list) => {
      const withBackdrop = list.filter((m) => m.backdrop_path);
      setMovie(withBackdrop[Math.floor(Math.random() * Math.min(5, withBackdrop.length))]);
    }).catch(() => {});
  }, []);

  if (!movie) return <div className="hero hero--skeleton" />;

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${IMG(movie.backdrop_path, "original")})` }}
    >
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__title">{movie.title || movie.name}</h1>
        <p className="hero__meta">
          <span className="hero__match">★ {movie.vote_average?.toFixed(1)}</span>
          <span>{(movie.release_date || "").slice(0, 4)}</span>
        </p>
        <p className="hero__overview">{movie.overview}</p>
        <div className="hero__actions">
          <Link to={`/movie/${movie.id}`} className="btn btn--primary">▶ Play</Link>
          <button className="btn btn--secondary" onClick={() => toggle(movie)}>
            {isFavorite(movie.id) ? "✓ In My List" : "+ My List"}
          </button>
        </div>
      </div>
    </section>
  );
}
