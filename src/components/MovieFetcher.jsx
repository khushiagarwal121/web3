import { useState, useEffect, useRef } from "react";

function MovieFetcher() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCountRef = useRef(0);
  const topRef = useRef(null);
  //   useEffect to fetch movies from the Ghibli API
  //   This hook runs once when the component mounts (empty dependency array [])
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/films");
        console.log("res:", res);
        if (!res.ok) {
          throw new Error("Failed to fetch movies");
        }
        // res is a Response object
        // The body of the response is streamed (especially for large responses), so parsing takes time.
        // Returns a Promise
        // Parses the body as JSON and converts it into a JavaScript object
        const data = await res.json();
        console.log("data:", data);
        setMovies(data);
        fetchCountRef.current += 1;
        console.log("📦 Movies fetched: ", fetchCountRef.current, "times");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    // 👇 Set interval to auto-refresh
    // interval has id
    const interval = setInterval(() => {
      console.log("⏳ Refetching movies...");
      fetchMovies();
    }, 300000); // 300 second
    // console.log("interval:", interval);
    // 👇 Cleanup function
    return () => {
      clearInterval(interval);
      console.log("🛑 Interval cleared on unmount");
    };
  }, []);
  // scroll to where movies are dispalyed
useEffect(() => {
  if (movies.length > 0 && topRef.current) {
    topRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [movies]);

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
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // og window resize events
  useEffect(() => {
    function handleResize() {
      console.log(
        "📐 Window resized:",
        window.innerWidth,
        "x",
        window.innerHeight
      );
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      console.log("🛑 Resize listener removed");
    };
  }, []);
  if (loading) return <p>loading movies...</p>;
  if (error) return <p>Error : {error}</p>;

  return (
    <div>
    <div ref={topRef}></div>
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
