import { render, screen } from "@testing-library/react";
import { MovieList } from "@/components/movie-list";
import type { Movie } from "@/lib/tmdb";

describe("MovieList Component", () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: "Test Movie 1",
      poster_path: "/test1.jpg",
      release_date: "2023-01-01",
      vote_average: 8.5,
      overview: "Test overview 1",
      backdrop_path: "/backdrop1.jpg",
    },
    {
      id: 2,
      title: "Test Movie 2",
      poster_path: "/test2.jpg",
      release_date: "2023-02-02",
      vote_average: 7.0,
      overview: "Test overview 2",
      backdrop_path: "/backdrop2.jpg",
    },
  ];

  it("should render the title and list of movies", () => {
    render(<MovieList movies={mockMovies} title="Test Movies" />);

    expect(screen.getByText("Test Movies")).toBeInTheDocument();
    expect(screen.getByText("Test Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Test Movie 2")).toBeInTheDocument();
  });

  it("should render a message when no movies are found", () => {
    render(<MovieList movies={[]} title="No Movies" />);

    expect(screen.getByText("No Movies")).toBeInTheDocument();
    expect(screen.getByText("No movies found.")).toBeInTheDocument();
  });
});
