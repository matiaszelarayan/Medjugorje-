import axiosClient from "./axiosClient";

const BASE_URL = "api/contactos/";

export async function getContactos(params = {}) {
  const res = await axiosClient.get(`${BASE_URL}`, { params });
  return res.data;
}

export async function crearContacto(contacto) {
  const res = await axiosClient.post(`${BASE_URL}`, contacto);
  return res.data;
}

export async function eliminarContacto(id) {
  const res = await axiosClient.delete(`${BASE_URL}${id}/`);
  return res.data;
}

export async function editarContacto(contacto) {
  const res = await axiosClient.patch(`${BASE_URL}${contacto.id}/`, contacto);
  return res.data;
}

