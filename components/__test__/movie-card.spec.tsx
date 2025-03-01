import { render, screen } from "@testing-library/react";
import { MovieCard } from "@/components/movie-card";
import { getPosterUrl, getRatingColor } from "@/lib/tmdb";
import { formatDate } from "@/lib/utils";

jest.mock("@/lib/tmdb", () => ({
  getPosterUrl: jest.fn(),
  getRatingColor: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  formatDate: jest.fn(),
  cn: (...inputs: never[]) => inputs.join(" "),
}));

describe("MovieCard Component", () => {
  const mockMovie = {
    id: 123,
    title: "Test Movie Title",
    poster_path: "/test-poster.jpg",
    release_date: "2023-05-15",
    vote_average: 8.5,
    overview: "This is a test movie overview with some description.",
    backdrop_path: "/test-backdrop.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getPosterUrl as jest.Mock).mockReturnValue("/mocked-poster-url.jpg");
    (getRatingColor as jest.Mock).mockReturnValue("text-green-500");
    (formatDate as jest.Mock).mockReturnValue("May 15, 2023");
  });

  it("should render the movie card with correct data", () => {
    render(<MovieCard movie={mockMovie} />);

    // Check if the link points to the correct movie detail page
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/movie/123");

    // Check if the title is rendered
    expect(screen.getByText("Test Movie Title")).toBeInTheDocument();

    // Check if the poster image is rendered with correct props
    const posterImage = screen.getByAltText("Test Movie Title");
    expect(posterImage).toHaveAttribute(
      "src",
      "/_next/image?url=%2Fmocked-poster-url.jpg&w=3840&q=75",
    );

    // Check if the rating is rendered
    expect(screen.getByText("8.5")).toBeInTheDocument();

    // Check if the overview is rendered
    expect(
      screen.getByText("This is a test movie overview with some description."),
    ).toBeInTheDocument();

    // Verify that the utility functions were called with correct arguments
    expect(getPosterUrl).toHaveBeenCalledWith("/test-poster.jpg", "w185");
    expect(getRatingColor).toHaveBeenCalledWith(8.5);
    expect(formatDate).toHaveBeenCalledWith("2023-05-15");
  });

  it('should display "No overview available" when overview is empty', () => {
    const movieWithoutOverview = {
      ...mockMovie,
      overview: "",
    };

    render(<MovieCard movie={movieWithoutOverview} />);

    expect(screen.getByText("No overview available.")).toBeInTheDocument();
  });

  it("should not show release date when it is not available", () => {
    const movieWithoutReleaseDate = {
      ...mockMovie,
      release_date: "",
    };

    render(<MovieCard movie={movieWithoutReleaseDate} />);

    // formatDate should not be called
    expect(formatDate).not.toHaveBeenCalled();
  });

  it("should use placeholder when poster_path is null", () => {
    const movieWithoutPoster = {
      ...mockMovie,
      poster_path: null,
    };

    (getPosterUrl as jest.Mock).mockReturnValue("/placeholder.svg");

    render(<MovieCard movie={movieWithoutPoster} />);

    const posterImage = screen.getByAltText("Test Movie Title");
    expect(posterImage).toHaveAttribute("src", "/placeholder.svg");
  });
});
