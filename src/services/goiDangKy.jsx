import request from "../utils/request"

export const getAllGoiDangKy = async () => {
    const res = await request.get('/goiDangKy/getAllGoiDangKy')
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getOneGoiDangKy = async (goiDangKyId) => {
    const res = await request.get(`/goiDangKy/getOneGoiDangKy?goiDangKyId=${goiDangKyId}`);
    if (res.data.status === 'success') return res.data.data
    return []
}