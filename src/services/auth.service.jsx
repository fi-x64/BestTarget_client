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

export const register = async (values) => {
  const res = await request.post('/users/signup', values)
  if (res.data.status === 'success') return res.data;
  if (res.data.status === 'fail') return res.data;
  return [];
};

export const createOTP = async (email) => {
  const res = await request.post('/users/createOTP', { email })
  if (res.data.status === 'success') return res.data;
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

export const googleLogin = async (values) => {
  const res = await request.post('/users/googleLogin', values)
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
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await request.post(`/users/forgotPassword`, { email })
  if (res.data) {
    return res.data;
  }
  return [];
};

export const validateToken = async (token) => {
  const res = await request.get(`/users/validateToken?token=${token}`)
  if (res.data) {
    return res.data;
  }
  return [];
};

export const resetPassword = async (values) => {
  const res = await request.patch(`/users/resetPassword`, values)
  if (res.data) {
    return res.data;
  }
  return [];
};

export const activeAccount = async (email, otp) => {
  const res = await request.post('/users/activeAccount', { email, otp })
  if (res.data.status === 'success') return res.data;
  return [];
};

export const logout = () => {
  localStorage.removeItem("user");
};