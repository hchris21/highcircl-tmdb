This is a movie explorer app that uses the [TMDB API](https://www.themoviedb.org/documentation/api) to fetch movie data. It is built with [Next.js](https://nextjs.org/)

## Getting Started

First, edit the `lib/tmdb.ts` file by adding your TMDB API key to the `API_KEY` variable. Without this, the app will not work as it won't be able to access any of the TMDB endpoints.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

By default, the app loads the most popular movies. You can search for movies by typing in the search bar. You can also click on a movie to see more details about it.

## Possible improvements

- update search functionality to request data without submitting search form (with debounce/throttling to avoid many requests to the API)
- overall better design
- create shared test utilities, as some are duplicated currently
- fix/investigate jest mocks in certain test suites
