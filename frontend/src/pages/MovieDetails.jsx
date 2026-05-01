import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMovie, IMG } from "../api/tmdb";
import { useFavorites } from "../context/FavoritesContext";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    setMovie(null);
    fetchMovie(id).then(setMovie).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="page"><p>Error: {error}</p></div>;
  if (!movie) return <div className="page"><p>Loading…</p></div>;

  const trailer = (movie.videos?.results || []).find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  return (
    <main className="details">
      <div
        className="details__backdrop"
        style={{ backgroundImage: `url(${IMG(movie.backdrop_path, "original")})` }}
      >
        <div className="details__overlay" />
      </div>
      <div className="details__body">
        <div className="details__poster">
          {movie.poster_path && <img src={IMG(movie.poster_path, "w500")} alt={movie.title} />}
        </div>
        <div className="details__info">
          <h1>{movie.title}</h1>
          <p className="details__meta">
            ★ {movie.vote_average?.toFixed(1)} · {(movie.release_date || "").slice(0, 4)} · {movie.runtime} min
          </p>
          <p className="details__genres">
            {(movie.genres || []).map((g) => g.name).join(" · ")}
          </p>
          <p className="details__overview">{movie.overview}</p>
          <div className="details__actions">
            {trailer && (
              <a
                className="btn btn--primary"
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
              >▶ Play Trailer</a>
            )}
            <button className="btn btn--secondary" onClick={() => toggle(movie)}>
              {isFavorite(movie.id) ? "✓ In My List" : "+ My List"}
            </button>
            <Link to="/" className="btn btn--ghost">← Back</Link>
          </div>

          {movie.credits?.cast?.length > 0 && (
            <div className="details__cast">
              <h3>Cast</h3>
              <div className="details__cast-list">
                {movie.credits.cast.slice(0, 10).map((c) => (
                  <div key={c.id} className="cast">
                    {c.profile_path ? (
                      <img src={IMG(c.profile_path, "w185")} alt={c.name} />
                    ) : (
                      <div className="cast__placeholder">{c.name[0]}</div>
                    )}
                    <div className="cast__name">{c.name}</div>
                    <div className="cast__char">{c.character}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
