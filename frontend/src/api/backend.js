import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const api = axios.create({ baseURL: BASE });


const USER_ID = "demo-user";

export async function listFavorites() {
  const { data } = await api.get("/favorite/list", { params: { userId: USER_ID, pageSize: 500 } });
  return data.itemList || [];
}

export async function addFavorite(movie) {
  const { data } = await api.post("/favorite/create", {
    userId: USER_ID,
    tmdbId: movie.id,
    title: movie.title || movie.name || "Untitled",
    posterPath: movie.poster_path || "",
  });
  return data;
}

export async function removeFavorite(favId) {
  await api.post("/favorite/delete", { id: favId });
}
