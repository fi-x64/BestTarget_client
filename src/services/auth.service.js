import request from "../utils/request"

export const register = async (email, password) => {
  const res = await request.post('/auth/signup', { email, password })
  if (res.data.success) return res.data.data;
  return [];
};

export const login = async (email, password) => {
  const res = await request.post('/auth/login', { email, password })
  if (res.data.success) {
    if (res.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    }
  }
  return [];
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};