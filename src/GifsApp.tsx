import { useState } from "react";

import { GifList } from "./gifs/components/GifList";
import { PreviousSearches } from "./gifs/components/PreviousSearches";

import { CustomHeader } from "./shared/components/CustomHeader";
import { SearchBar } from "./shared/components/SearchBar";

import { getGifsByQuery } from "./gifs/actions/get-gifs-by-query.action";

import type { Gif } from "./gifs/interfaces/git.interfece";

export const GifsApp = () => {
  const [previousTerms, setPreviousTerms] = useState<string[]>([]);
  const [gifs, setGifs] = useState<Gif[]>([]);

  const handleTermClicked = (term: string) => {
    console.log({ term });
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

    setPreviousTerms([query, ...previousTerms].splice(0,8));

    const gifs = await getGifsByQuery(query);
    
    setGifs(gifs)
    
  };

  return (
    <>
      {/* Header */}
      <CustomHeader
        title="Buscador de gifs"
        description="Descubre y comparte el gif perfecto"
      />

      {/* Search */}
      <SearchBar placeholder="Busca lo que quieras" onQuery={handleSearch} />

      {/* Busqueda previas */}
      <PreviousSearches
        searches={previousTerms}
        onLabelClicked={handleTermClicked}
      />

      {/* Gifs */}
      <GifList gifs={gifs} />
    </>
  );
};
