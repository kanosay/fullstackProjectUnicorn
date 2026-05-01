import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { listFavorites, addFavorite, removeFavorite } from "../api/backend";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendOk, setBackendOk] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const items = await listFavorites();
      setFavorites(items);
      setBackendOk(true);
    } catch (e) {
      console.warn("Backend not reachable — favorites will be local only.", e.message);
      setBackendOk(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const isFavorite = (tmdbId) => favorites.some((f) => Number(f.tmdbId) === Number(tmdbId));

  const toggle = async (movie) => {
    const existing = favorites.find((f) => Number(f.tmdbId) === Number(movie.id));
    if (existing) {
      setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
      if (backendOk) {
        try { await removeFavorite(existing.id); } catch {}
      }
    } else {
      const optimistic = {
        id: `temp-${Date.now()}`,
        tmdbId: movie.id,
        title: movie.title || movie.name,
        posterPath: movie.poster_path || "",
      };
      setFavorites((prev) => [...prev, optimistic]);
      if (backendOk) {
        try {
          const saved = await addFavorite(movie);
          setFavorites((prev) => prev.map((f) => (f.id === optimistic.id ? saved : f)));
        } catch {}
      }
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, loading, backendOk, isFavorite, toggle, refresh }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
