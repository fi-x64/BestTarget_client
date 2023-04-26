import request from "../utils/request"
import authHeader from "./auth-header";

export const getLuotXemTinByTinDangId = async (tinDangId) => {
    const res = await request.get(`/luotXemTin/getLuotXemTinByTinDangId?tinDangId=${tinDangId}`)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const createLuotXemTin = async (values) => {
    const res = await request.post(`/luotXemTin/createLuotXemTin`, values, { headers: authHeader() })
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getAllTinDangRelatedHot = async (values) => {
    const res = await request.post(`/luotXemTin/getAllTinDangRelatedHot`, values)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const deleteAllLuotXemTin = async (tinDangId) => {
    const res = await request.delete(`/luotXemTin/deleteAllLuotXemTin?tinDangId=${tinDangId}`, { headers: authHeader() })
    if (res.data) return res.data
    return []
}

export const statisticsLuotXemTinInWeek = async (tinDangId) => {
    const res = await request.get(`/luotXemTin/statisticsLuotXemTinInWeek`);
    if (res.data) return res.data.data
    return []
}

export const statisticsLuotXemTinByCategory = async (values) => {
    const res = await request.post(`/luotXemTin/statisticsLuotXemTinByCategory`, values);
    if (res.data) return res.data.data
    return []
}