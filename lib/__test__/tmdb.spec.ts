import fetchMock from "jest-fetch-mock";
import {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getPosterUrl,
  getBackdropUrl,
  getRatingColor,
  type Movie,
  type MovieListResponse,
} from "@/lib/tmdb";

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("TMDB API Functions", () => {
  describe("getPopularMovies", () => {
    it("should fetch popular movies successfully", async () => {
      const mockResponse: MovieListResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Test Movie",
            poster_path: "/test.jpg",
            release_date: "2023-01-01",
            vote_average: 8.5,
            overview: "Test overview",
            backdrop_path: "/backdrop.jpg",
          },
        ],
        total_pages: 10,
        total_results: 100,
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await getPopularMovies();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/movie/popular?api_key="),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when the API call fails", async () => {
      fetchMock.mockRejectOnce(new Error("API Error"));

      await expect(getPopularMovies()).rejects.toThrow();
    });
  });

  describe("searchMovies", () => {
    it("should return empty results when query is empty", async () => {
      const result = await searchMovies("");

      expect(fetchMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      });
    });

    it("should fetch movies based on search query", async () => {
      const mockResponse: MovieListResponse = {
        page: 1,
        results: [
          {
            id: 2,
            title: "Search Result",
            poster_path: "/search.jpg",
            release_date: "2023-02-02",
            vote_average: 7.5,
            overview: "Search overview",
            backdrop_path: "/backdrop.jpg",
          },
        ],
        total_pages: 5,
        total_results: 50,
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await searchMovies("test query");

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/search/movie?api_key="),
      );
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("query=test%20query"),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when the search API call fails", async () => {
      fetchMock.mockRejectOnce(new Error("Search API Error"));

      await expect(searchMovies("test")).rejects.toThrow();
    });
  });

  describe("getMovieDetails", () => {
    it("should fetch movie details by ID", async () => {
      const mockResponse: Movie = {
        id: 3,
        title: "Movie Details",
        poster_path: "/poster.jpg",
        release_date: "2023-03-03",
        vote_average: 9.0,
        overview: "Detailed overview",
        backdrop_path: "/backdrop.jpg",
        runtime: 120,
        genres: [{ id: 1, name: "Action" }],
        original_language: "en",
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await getMovieDetails(3);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/movie/3?api_key="),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when the movie details API call fails", async () => {
      fetchMock.mockRejectOnce(new Error("Movie Details API Error"));

      await expect(getMovieDetails(3)).rejects.toThrow();
    });
  });

  describe("getPosterUrl", () => {
    it("should return a placeholder when path is null", () => {
      const result = getPosterUrl(null);
      expect(result).toBe("/placeholder.svg?height=750&width=500");
    });

    it("should return a valid poster URL when path is provided", () => {
      const result = getPosterUrl("/test.jpg");
      expect(result).toBe("https://image.tmdb.org/t/p/w500/test.jpg");
    });

    it("should use the specified size", () => {
      const result = getPosterUrl("/test.jpg", "w185");
      expect(result).toBe("https://image.tmdb.org/t/p/w185/test.jpg");
    });
  });

  describe("getBackdropUrl", () => {
    it("should return a placeholder when path is null", () => {
      const result = getBackdropUrl(null);
      expect(result).toBe("/placeholder.svg?height=300&width=780");
    });

    it("should return a valid backdrop URL when path is provided", () => {
      const result = getBackdropUrl("/backdrop.jpg");
      expect(result).toBe("https://image.tmdb.org/t/p/w1280/backdrop.jpg");
    });

    it("should use the specified size", () => {
      const result = getBackdropUrl("/backdrop.jpg", "w780");
      expect(result).toBe("https://image.tmdb.org/t/p/w780/backdrop.jpg");
    });
  });

  describe("getRatingColor", () => {
    it("should return green for ratings >= 7", () => {
      expect(getRatingColor(7)).toBe("text-green-500");
      expect(getRatingColor(8.5)).toBe("text-green-500");
    });

    it("should return yellow for ratings >= 5 and < 7", () => {
      expect(getRatingColor(5)).toBe("text-yellow-500");
      expect(getRatingColor(6.9)).toBe("text-yellow-500");
    });

    it("should return red for ratings < 5", () => {
      expect(getRatingColor(4.9)).toBe("text-red-500");
      expect(getRatingColor(2)).toBe("text-red-500");
    });
  });
});
