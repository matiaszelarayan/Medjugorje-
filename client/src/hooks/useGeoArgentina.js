// src/hooks/useGeoArgentina.js

import { useState, useEffect } from "react";


const API_PROVINCIAS = import.meta.env.VITE_API_PROVINCIAS;
const API_LOCALIDADES = import.meta.env.VITE_API_LOCALIDADES;

/**
 * Hook para obtener provincias y localidades de Argentina de forma reutilizable.
 * @param {string} selectedProvincia - Nombre de la provincia seleccionada.
 * @returns objeto { provincias, localidades, loadingProv, loadingLoc, errorProv, errorLoc }
 */
export function useGeoArgentina(selectedProvincia) {
  const [provincias, setProvincias] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [loadingProv, setLoadingProv] = useState(true);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [errorProv, setErrorProv] = useState(null);
  const [errorLoc, setErrorLoc] = useState(null);

  // Cargar provincias de Argentina una sola vez al montar el hook
  useEffect(() => {
    setLoadingProv(true);
    fetch(API_PROVINCIAS)
      .then(res => res.json())
      .then(data => {
        setProvincias((data.provincias || []).slice().sort((a, b) => a.nombre.localeCompare(b.nombre)));
        setLoadingProv(false);
      }).catch(() => {
        setErrorProv("Error cargando provincias");
        setLoadingProv(false);
      });
  }, []);

  // Actualizar listado de localidades cuando cambia la provincia
  useEffect(() => {
    if (!selectedProvincia) {
      setLocalidades([]);
      setErrorLoc(null);
      return;
    }
    setLoadingLoc(true);
    fetch(`${API_LOCALIDADES}&provincia=${encodeURIComponent(selectedProvincia)}`)
      .then(res => res.json())
      .then(data => {
        setLocalidades((data.localidades || []).slice().sort((a, b) => a.nombre.localeCompare(b.nombre)));
        setLoadingLoc(false);
      }).catch(() => {
        setErrorLoc("Error cargando localidades");
        setLoadingLoc(false);
      });
  }, [selectedProvincia]);

  return {
    provincias,
    localidades,
    loadingProv,
    loadingLoc,
    errorProv,
    errorLoc,
  };
}
