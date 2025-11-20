import axiosClient from "./axiosClient";

export async function getPerfil() {
  const res = await axiosClient.get("/auth/perfil/");
  return res.data;
}
