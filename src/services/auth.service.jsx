import { useSelector } from "react-redux";
import request from "../utils/request"
import authHeader from "./auth-header";

export const protect = async () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  if (user.data) {
    if (user.data.quyen === 'admin') {
      return
    }
  }
}

export const register = async (email, password) => {
  const res = await request.post('/auth/signup', { email, password })
  if (res.data.success) return res.data.data;
  return [];
};

export const login = async (email, password) => {
  const res = await request.post('/users/login', { email, matKhau: password })
  if (res.data.status === 'success') {
    if (res.data.token) {
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    }
  }
  return [];
};

export const updatePassword = async (values) => {
  const res = await request.patch('/users/updateMyPassword', values, { headers: authHeader() })
  if (res.data.status === 'success') {
    if (res.data.token) {
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    }
  }
  return [];
};

export const logout = () => {
  localStorage.removeItem("user");
};