import { useRef, useState } from "react";
import type { Gif } from "../interfaces/git.interfece";
import { getGifsByQuery } from "../actions/get-gifs-by-query.action";

// const gifsCache: Record<string, Gif[]> = {};

export const useGifs = () => {
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [previousTerms, setPreviousTerms] = useState<string[]>([]);

    const gifsCache = useRef<Record<string, Gif[]>>({});

  const handleTermClicked = async (term: string) => {
    if (gifsCache.current[term]) {
        setGifs(gifsCache.current[term]);
        return;
    }

    const gifs = await getGifsByQuery(term);
    setGifs(gifs);
  };

  const handleSearch = async (query: string) => {
    // Validar que el query no esté vacío
    // Convertir el query a minúsculas y eliminar espacios en blanco
    // Evitar búsquedas duplicadas verificando si el término ya existe
    // en previousTerms ( si existe, no hacer nada )
    // Actualizar previousTerms agregando el nuevo término al inicio y limitando
    // a 8 elementos máximo, es decir no puede ser un arreglo de más de 8.
    query = query.trim().toLowerCase();

    if (query.length === 0) return;

    if (previousTerms.includes(query)) return;

    setPreviousTerms([query, ...previousTerms].splice(0, 8));

    const gifs = await getGifsByQuery(query);

    setGifs(gifs);

    gifsCache.current[query] = gifs;
  };

  return {
    // Props / Values
    gifs,
    previousTerms,
    // Methods / Actions
    handleSearch,
    handleTermClicked,
  };
};
