import axiosClient from "./axiosClient";

const BASE_URL = "api/correos/";

export async function getCorreos() {
  const res = await axiosClient.get(`${BASE_URL}`);
  return res.data;
}

export async function getCorreo(id) {
  const res = await axiosClient.get(`${BASE_URL}${id}/`);
  return res.data;
}

export async function crearCorreo(correo) {
  const res = await axiosClient.post(`${BASE_URL}`, correo);
  return res.data;
}

export async function eliminarCorreo(id) {
  const res = await axiosClient.delete(`${BASE_URL}${id}/`);
  return res.data;
}

export async function editarCorreo(correo) {
  const res = await axiosClient.patch(`${BASE_URL}${correo.id}/`, correo);
  return res.data;
}

export async function enviarCorreo(id) {
  const res = await axiosClient.post(`${BASE_URL}${id}/enviar/`);
  return res.data;
}