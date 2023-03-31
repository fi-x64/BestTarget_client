import request from "../utils/request"

export const getAllDanhMuc = async () => {
    const res = await request.get('/getAllDanhMuc')
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getAllDanhMucPhu = async (danhMucId) => {
    const res = await request.get(`/getAllDanhMucPhu?danhMucId=${danhMucId}`)
    if (res.data.status === 'success') return res.data.data
    return []
}