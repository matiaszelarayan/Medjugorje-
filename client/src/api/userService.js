import axiosClient from "./axiosClient";

const BASE_URL = "api/accounts";

export async function getPerfil() {
  const res = await axiosClient.get(`${BASE_URL}/perfil/`);
  return res.data.data;
}

export async function getUsers() {
  const res = await axiosClient.get(`${BASE_URL}/lista/`);
  return res.data.data;
}

export async function crearUser(user) {
  const res = await axiosClient.post(`${BASE_URL}/crear/`, user);
  return res.data.data;
}

export async function eliminarUser(id) {
  const res = await axiosClient.delete(`${BASE_URL}/eliminar/${id}/`);
  return res.data.data;
}

export async function editarUser(user) {
  const res = await axiosClient.patch(`${BASE_URL}/editar/${user.id}/`, user);
  return res.data.data;
}

export async function editarColaborador (user) {
  const res = await axiosClient.patch(`${BASE_URL}/editar-mi-perfil/`, user);
  return res.data.data;
}