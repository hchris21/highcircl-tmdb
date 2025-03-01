import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Clock, Globe, ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/error-message";
import { formatDate, formatRuntime, cn } from "@/lib/utils";
import {
  getMovieDetails,
  getPosterUrl,
  getBackdropUrl,
  getRatingColor,
} from "@/lib/tmdb";

type Params = Promise<{ id: string }>;

interface MoviePageProps {
  params: Params;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = Number.parseInt((await params).id);

  try {
    if (isNaN(movieId)) {
      return notFound();
    }

    const movie = await getMovieDetails(movieId);

    return (
      <>
        <Header />

        <div className="relative">
          <div className="absolute inset-0 h-[50vh] overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-background z-10" />
            <Image
              src={getBackdropUrl(movie.backdrop_path) || "/placeholder.svg"}
              alt=""
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>

          <div className="container relative z-20 pt-24 pb-12">
            <Link href="/" className="inline-flex items-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <div className="grid gap-6 md:grid-cols-[300px_1fr] lg:gap-12">
              <div className="relative aspect-2/3 overflow-hidden rounded-lg border shadow-md">
                <Image
                  src={
                    getPosterUrl(movie.poster_path, "w500") ||
                    "/placeholder.svg"
                  }
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                  priority
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {movie.title}
                  </h1>

                  {movie.release_date && (
                    <p className="text-muted-foreground mt-1">
                      {formatDate(movie.release_date)}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "flex items-center rounded-md px-2.5 py-0.5 text-sm font-semibold",
                        getRatingColor(movie.vote_average),
                      )}
                    >
                      <Star className="h-4 w-4 fill-current mr-1" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>

                  {movie.runtime && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}

                  {movie.original_language && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Globe className="h-4 w-4" />
                      <span>
                        {new Intl.DisplayNames(["en"], { type: "language" }).of(
                          movie.original_language,
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-semibold mb-2">Overview</h2>
                  <p className="text-muted-foreground">
                    {movie.overview || "No overview available."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error(`Error in MoviePage for ID ${movieId}:`, error);
    return (
      <>
        <Header />
        <div className="container py-12">
          <Link href="/" className="inline-flex items-center mb-6">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <ErrorMessage message="Failed to load movie details. Please try again later." />
        </div>
      </>
    );
  }
}
