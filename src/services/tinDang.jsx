import request from "../utils/request"

export const createPost = async (values) => {
    const res = await request.post('/createPost', values)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getGoiY = async (danhMucPhuId) => {
    const res = await request.get(`/getGoiY?danhMucPhuId=${danhMucPhuId}`)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const countTrangThaiTin = async () => {
    const res = await request.get(`/countTrangThaiTin`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getTinDang = async (key) => {
    const res = await request.get(`/getTinDang?phanLoai=${key}`);
    if (res.data.status === 'success') return res.data.data
    return []
}