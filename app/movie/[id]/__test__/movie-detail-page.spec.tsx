import { render, screen } from "@testing-library/react";
import MoviePage from "@/app/movie/[id]/page";
import {
  getMovieDetails,
  getPosterUrl,
  getBackdropUrl,
  getRatingColor,
} from "@/lib/tmdb";
import { formatDate, formatRuntime } from "@/lib/utils";
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

// Mock the utility functions
jest.mock("@/lib/utils", () => ({
  formatDate: jest.fn(),
  formatRuntime: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cn: (...classes: any[]) => classes.join(" "),
}));

// Mock the TMDB functions
jest.mock("@/lib/tmdb", () => ({
  getMovieDetails: jest.fn(),
  getPosterUrl: jest.fn(),
  getBackdropUrl: jest.fn(),
  getRatingColor: jest.fn(),
}));

describe("MoviePage", () => {
  const mockMovie = {
    id: 123,
    title: "Test Movie Title",
    poster_path: "/test-poster.jpg",
    backdrop_path: "/test-backdrop.jpg",
    release_date: "2023-05-15",
    vote_average: 8.5,
    overview: "This is a test movie overview.",
    runtime: 120,
    genres: [
      { id: 1, name: "Action" },
      { id: 2, name: "Adventure" },
    ],
    original_language: "en",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);
    (getPosterUrl as jest.Mock).mockReturnValue("/mocked-poster-url.jpg");
    (getBackdropUrl as jest.Mock).mockReturnValue("/mocked-backdrop-url.jpg");
    (getRatingColor as jest.Mock).mockReturnValue("text-green-500");
    (formatDate as jest.Mock).mockReturnValue("May 15, 2023");
    (formatRuntime as jest.Mock).mockReturnValue("2h 0m");
  });

  it("should render movie details correctly", async () => {
    const params = Promise.resolve({ id: "123" });
    render(await MoviePage({ params }));

    // Header elements
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("Back to Home")).toBeInTheDocument();

    // Movie details
    expect(screen.getByText("Test Movie Title")).toBeInTheDocument();
    expect(screen.getByText("8.5")).toBeInTheDocument();
    expect(screen.getByText("2h 0m")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Adventure")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test movie overview."),
    ).toBeInTheDocument();

    // Check that utility functions are called correctly
    expect(getMovieDetails).toHaveBeenCalledWith(123);
    expect(getPosterUrl).toHaveBeenCalledWith("/test-poster.jpg", "w500");
    expect(getBackdropUrl).toHaveBeenCalledWith("/test-backdrop.jpg");
    expect(formatDate).toHaveBeenCalledWith("2023-05-15");
    expect(formatRuntime).toHaveBeenCalledWith(120);
  });

  it("should call notFound when movie ID is not a number", async () => {
    const params = Promise.resolve({ id: "not-a-number" });
    await MoviePage({ params });

    expect(notFound).toHaveBeenCalled();
    expect(getMovieDetails).not.toHaveBeenCalled();
  });

  it("should render error message when API call fails", async () => {
    (getMovieDetails as jest.Mock).mockRejectedValue(new Error("API Error"));

    const params = Promise.resolve({ id: "123" });
    render(await MoviePage({ params }));

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(
      screen.getByText("Failed to load movie details. Please try again later."),
    ).toBeInTheDocument();
  });

  it("should handle missing movie data gracefully", async () => {
    const incompleteMovie = {
      id: 123,
      title: "Incomplete Movie",
      poster_path: null,
      backdrop_path: null,
      release_date: "",
      vote_average: 0,
      overview: "",
      runtime: undefined,
      genres: [],
      original_language: undefined,
    };

    (getMovieDetails as jest.Mock).mockResolvedValue(incompleteMovie);

    const params = Promise.resolve({ id: "123" });
    render(await MoviePage({ params }));

    expect(screen.getByText("Incomplete Movie")).toBeInTheDocument();

    expect(screen.getByText("No overview available.")).toBeInTheDocument();

    expect(screen.queryByTestId("runtime")).not.toBeInTheDocument();

    expect(getPosterUrl).toHaveBeenCalledWith(null, "w500");
    expect(getBackdropUrl).toHaveBeenCalledWith(null);
  });
});
