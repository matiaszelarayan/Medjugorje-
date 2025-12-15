import axiosClient from "./axiosClient";

const BASE_URL = "/api/eventos/";

export async function getEventos() {
  const res = await axiosClient.get(`${BASE_URL}`);
  return res.data;
}

export async function crearEvento(evento) {
  const res = await axiosClient.post(`${BASE_URL}`, evento);
  return res.data;
}

export async function eliminarEvento(id) {
  const res = await axiosClient.delete(`${BASE_URL}${id}/`);
  return res.data;
}

export async function editarEvento(evento) {
  const res = await axiosClient.patch(`${BASE_URL}${evento.id}/`, evento);
  return res.data;
}
