import { Suspense } from "react";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { MovieList } from "@/components/movie-list";
import { Loading } from "@/components/loading";
import { ErrorMessage } from "@/components/error-message";
import { getPopularMovies, searchMovies } from "@/lib/tmdb";

type SearchParams = Promise<{ [key: string]: string }>;

type HomePageProps = {
  searchParams: SearchParams;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const query = (await searchParams).query || "";

  try {
    let movies;
    let title;

    if (query) {
      const searchResults = await searchMovies(query);
      movies = searchResults.results;
      title = `Search Results for "${query}"`;
    } else {
      const popularMovies = await getPopularMovies();
      movies = popularMovies.results;
      title = "Popular Movies";
    }

    return (
      <>
        <Header />
        <div className="container py-6">
          <SearchBar />
          <Suspense fallback={<Loading />}>
            <MovieList movies={movies} title={title} />
          </Suspense>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error in HomePage:", error);
    return (
      <>
        <Header />
        <div className="container py-6">
          <SearchBar />
          <ErrorMessage message="Failed to load movies. Please try again later." />
        </div>
      </>
    );
  }
}
