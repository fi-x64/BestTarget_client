import request from "../utils/request"
import authHeader from "./auth-header";

export const getAllHoaDon = async () => {
    const res = await request.get('/hoaDon/getAllHoaDon', { headers: authHeader() })
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getHoaDonByUserId = async (userId) => {
    const res = await request.get(`/hoaDon/getHoaDonByUserId`, { headers: authHeader() });
    if (res.data.status === 'success') return res.data.data
    return []
}