import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { getPosterUrl, getRatingColor, type Movie } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
    >
      <div className="relative shrink-0 h-32 w-24 overflow-hidden rounded-md">
        <Image
          src={getPosterUrl(movie.poster_path, "w185") || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100px, 150px"
        />
      </div>

      <div className="flex flex-col grow">
        <h3 className="font-semibold text-lg line-clamp-2">{movie.title}</h3>

        <div className="flex items-center gap-2 mt-1">
          <div
            className={cn(
              "flex items-center",
              getRatingColor(movie.vote_average),
            )}
          >
            <Star className="h-4 w-4 fill-current mr-1" />
            <span className="text-sm font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>

          {movie.release_date && (
            <span className="text-sm text-muted-foreground">
              {formatDate(movie.release_date)}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {movie.overview || "No overview available."}
        </p>
      </div>
    </Link>
  );
}
