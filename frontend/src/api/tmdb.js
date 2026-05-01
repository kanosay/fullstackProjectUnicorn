import axios from "axios";

const TMDB_KEY = "499ff6fd08e5dc3b85fb481bb6c51db3";
const BASE = "https://api.themoviedb.org/3";

export const IMG = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

const tmdb = axios.create({
  baseURL: BASE,
  params: { api_key: TMDB_KEY, language: "en-US" },
});

export const endpoints = {
  trending: "/trending/movie/week",
  popular: "/movie/popular",
  topRated: "/movie/top_rated",
  upcoming: "/movie/upcoming",
  nowPlaying: "/movie/now_playing",
  action: "/discover/movie?with_genres=28",
  comedy: "/discover/movie?with_genres=35",
  horror: "/discover/movie?with_genres=27",
  romance: "/discover/movie?with_genres=10749",
  documentary: "/discover/movie?with_genres=99",
};

export async function fetchList(endpoint) {
  const [path, query] = endpoint.split("?");
  const params = {};
  if (query) query.split("&").forEach((p) => {
    const [k, v] = p.split("=");
    params[k] = v;
  });
  const { data } = await tmdb.get(path, { params });
  return data.results || [];
}

export async function fetchMovie(id) {
  const { data } = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: "videos,credits" },
  });
  return data;
}

export async function searchMovies(query) {
  if (!query) return [];
  const { data } = await tmdb.get("/search/movie", { params: { query } });
  return data.results || [];
}
