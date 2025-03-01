import { MovieCard } from "@/components/movie-card";
import type { Movie } from "@/lib/tmdb";

interface MovieListProps {
  movies: Movie[];
  title: string;
}

export function MovieList({ movies, title }: MovieListProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-muted-foreground">No movies found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
