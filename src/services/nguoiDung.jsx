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

export const getUser = async (id) => {
    // return JSON.parse(localStorage.getItem("user"));
    const res = await request.get(`/users/${id}`, { headers: authHeader() });
    if (res.data.status === 'success') {
        return res.data.data;
    }
    return [];
};

export const updateUser = async (id, values) => {
    // return JSON.parse(localStorage.getItem("user"));
    const res = await request.patch(`/users/${id}`, values, { headers: authHeader() });
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

export const searchUser = async (values) => {
    // return JSON.parse(localStorage.getItem("user"));
    const res = await request.get(`/users/search?keyWord=${values}`, { headers: authHeader() });
    if (res.data.status === 'success') {
        return res.data.data;
    }
    return [];
};

export const changeAvatar = async (id, values) => {
    // return JSON.parse(localStorage.getItem("user"));
    const res = await request.patch(`/users/changeAvatar/${id}`, values);
    if (res.data.status === 'success') {
        return res.data;
    }
    return [];
};

export const getStatisticsUserInWeek = async () => {
    // return JSON.parse(localStorage.getItem("user"));
    const res = await request.get(`/users/statisticsUserInWeek`, { headers: authHeader() });
    if (res.data.status === 'success') {
        return res.data.data;
    }

    return [];
};