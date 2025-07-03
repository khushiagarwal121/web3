import { useState, useEffect } from "react";

function MovieFetcher() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //   useEffect to fetch movies from the Ghibli API
  //   This hook runs once when the component mounts (empty dependency array [])
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://ghibliapi.vercel.app/films");
        if (!res.ok) {
          throw new Error("Failed to fetch movies");
        }
        // res is a Response object
        // The body of the response is streamed (especially for large responses), so parsing takes time.
        // Returns a Promise
        // Parses the body as JSON and converts it into a JavaScript object
        const data = await res.json();
        console.log("data:", data);
        console.log("r4s", res);
        setMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // useEffect to update the document title when movies are fetched
  useEffect(() => {
    if (movies.length > 0) {
      document.title = `fetched ${movies.length} Movies`;
    }
  }, [movies]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.toLowerCase() === "m") {
        setShowAll((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return ()=>window.removeEventListener("keydown",handleKey)
  }, []);
  if (loading) return <p>loading movies...</p>;
  if (error) return <p>Error : {error}</p>;
  
  return (
    <div>
      <h1>Movies</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <img
              src={movie.image}
              alt={movie.title}
              style={{ width: "150px", borderRadius: "8px" }}
            />
            <strong>{movie.title}</strong>({movie.release_date})
          </li>
        ))}
      </ul>
    </div>
  );
}
export default MovieFetcher;
