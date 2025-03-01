const API_KEY = ""; // Add your own TMDB API Key here
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  backdrop_path: string | null;
  runtime?: number;
  genres?: Genre[];
  original_language?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function getPopularMovies(page = 1): Promise<MovieListResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular movies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
}

export async function searchMovies(
  query: string,
  page = 1,
): Promise<MovieListResponse> {
  if (!query) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
    );

    if (!response.ok) {
      throw new Error("Failed to search movies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
}

export async function getMovieDetails(id: number): Promise<Movie> {
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    throw error;
  }
}

export function getPosterUrl(
  path: string | null,
  size: "w185" | "w500" | "original" = "w500",
): string {
  if (!path) {
    return "/placeholder.svg?height=750&width=500";
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: "w300" | "w780" | "w1280" | "original" = "w1280",
): string {
  if (!path) {
    return "/placeholder.svg?height=300&width=780";
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getRatingColor(rating: number): string {
  if (rating >= 7) return "text-green-500";
  if (rating >= 5) return "text-yellow-500";
  return "text-red-500";
}
