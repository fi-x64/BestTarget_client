import request from "../utils/request"
import authHeader from "./auth-header";

export const getCurrentUser = async () => {
    // return JSON.parse(localStorage.getItem("user"));
    const res = await request.get('/users/me', { headers: authHeader() });
    if (res.data.status === 'success') {
        return res.data.data;
    }
    return [];
};

export const handleSearchAPI = async (values) => {
    const res = await request.post('/search', values);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const editUser = async (values) => {
    const res = await request.patch(`/users/updateMe`, values, { headers: authHeader() });
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getAllNguoiDung = async () => {
    // return JSON.parse(localStorage.getItem("user"));
    const res = await request.get('/users', { headers: authHeader() });
    if (res.data.status === 'success') {
        return res.data.data;
    }
    return [];
};