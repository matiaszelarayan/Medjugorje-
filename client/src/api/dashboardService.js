import axiosClient from "./axiosClient";

const BASE_URL = "api/dashboard/";

export async function getDashboard() {
  const res = await axiosClient.get(`${BASE_URL}`);
  return res.data;
}
