import request from "../utils/request"

export const getAllThongBao = async (userId) => {
    const res = await request.get(`/thongBao/getAllThongBao?userId=${userId}`)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const createAllThongBao = async (values) => {
    const res = await request.post(`/thongBao/createAllThongBao`, values)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const createThongBao = async (userId, values) => {
    const res = await request.post(`/thongBao/createThongBao?userId=${userId}`, values)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const editReadThongBao = async (thongBaoId) => {
    const res = await request.get(`/thongBao/editReadThongBao?thongBaoId=${thongBaoId}`)
    if (res.data.status === 'success') return res.data.data
    return []
}