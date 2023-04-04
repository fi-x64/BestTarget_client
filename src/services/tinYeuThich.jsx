import request from "../utils/request"
import authHeader from "./auth-header"

export const xoaTinYeuThich = async (tinDangId) => {
    const res = await request.get(`/tinYeuThich/xoaTinYeuThich?tinDangId=${tinDangId}`, { headers: authHeader() })
    if (res.data.status === 'success') return res.data
    return []
}

export const themTinYeuThich = async (tinDangId) => {
    const res = await request.get(`/tinYeuThich/themTinYeuThich?tinDangId=${tinDangId}`, { headers: authHeader() })
    if (res.data.status === 'success') return res.data
    return []
}

export const getListTinYeuThich = async () => {
    const res = await request.get(`/tinYeuThich/getListTinYeuThich`, { headers: authHeader() })
    if (res.data.status === 'success') return res.data.data
    return []
}