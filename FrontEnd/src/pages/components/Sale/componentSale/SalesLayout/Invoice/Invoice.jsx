import axios from "axios";

export const createInvoice = async () => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/invoices`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
