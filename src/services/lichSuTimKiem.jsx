import request from "../utils/request"

export const getLichSuTimKiemByUserId = async (userId) => {
    const res = await request.get(`/lichSuTimKiem/getLichSuTimKiemByUserId?userId=${userId}`)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const createLichSuTimKiem = async (values) => {
    const res = await request.post(`/lichSuTimKiem/createLichSuTimKiem`, values)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const deleteAllSearchHistory = async (userId) => {
    const res = await request.delete(`/lichSuTimKiem/deleteAllLichSuTimKiem?userId=${userId}`)
    if (res.data) return res.data
    return []
}