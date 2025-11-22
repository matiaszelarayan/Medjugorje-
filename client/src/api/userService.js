import axiosClient from "./axiosClient";

export async function getPerfil() {
  const res = await axiosClient.get("/accounts/perfil/");
  return res.data;
}

export async function getUsers() {
  const res = await axiosClient.get("/accounts/lista/");
  return res.data;
}

export async function crearUser(user) {
  const res = await axiosClient.post("/accounts/crear/", user);
  return res.data;
}

export async function eliminarUser(id) {
  const res = await axiosClient.delete(`/accounts/eliminar/${id}/`);
  return res.data;
}

export async function editarUser(user) {
  const res = await axiosClient.patch(`/accounts/editar/${user.id}/`, user);
  return res.data;
}

export async function editarColaborador (user) {
  const res = await axiosClient.patch(`/accounts/editar-mi-perfil/`, user);
  return res.data;
}