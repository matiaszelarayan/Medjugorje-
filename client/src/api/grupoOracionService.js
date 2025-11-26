import axiosClient from "./axiosClient";

const BASE_URL = "/api/grupo-oracion/";

export async function getGrupos() {
  const res = await axiosClient.get(`${BASE_URL}`);
  return res.data;
}

export async function crearGrupo(grupo) {
  const res = await axiosClient.post(`${BASE_URL}`, grupo);
  return res.data;
}

export async function eliminarGrupo(id) {
  const res = await axiosClient.delete(`${BASE_URL}${id}/`);
  return res.data;
}

export async function editarGrupo(grupo) {
  const res = await axiosClient.patch(`${BASE_URL}${grupo.id}/`, grupo);
  return res.data;
}

