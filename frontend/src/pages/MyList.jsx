import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { IMG } from "../api/tmdb";

export default function MyList() {
  const { favorites, loading, backendOk } = useFavorites();

  return (
    <main className="page">
      <h1>My List</h1>
      {!backendOk && (
        <div className="banner banner--warn">
          Backend at <code>localhost:4000</code> is not running — favorites are session-only.
          Start it with <code>cd backend &amp;&amp; npm start</code>.
        </div>
      )}
      {loading && <p>Loading…</p>}
      {!loading && favorites.length === 0 && (
        <p>Your list is empty. Add movies from the home page with “+ My List”.</p>
      )}
      <div className="grid">
        {favorites.map((f) => (
          <Link to={`/movie/${f.tmdbId}`} key={f.id} className="grid__card">
            {f.posterPath ? (
              <img src={IMG(f.posterPath, "w342")} alt={f.title} loading="lazy" />
            ) : (
              <div className="card__placeholder">{f.title}</div>
            )}
            <div className="grid__title">{f.title}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
