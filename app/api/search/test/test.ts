import { useState, useEffect, useRef } from "react";

export function useSearch(query: string) {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query) {
      setSongs([]);
      return;
    }

    const fetchSongs = async () => {
      setLoading(true);
      setError(null);

      // Cancelar la búsqueda anterior si el usuario escribe algo nuevo
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const res = await fetch(`/api/search/streaming?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }

        const data = await res.json();
        setSongs(data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Error fetching songs");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [query]);

  return { songs, loading, error };
}
