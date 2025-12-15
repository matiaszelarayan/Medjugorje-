import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL;

export async function login(email, password) {
  const res = await axios.post(`${API_URL}/auth/token/`, {
    email,
    password,
  });

  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}
