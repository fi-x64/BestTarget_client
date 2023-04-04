import request from "../utils/request"

export const getAllMenhGia = async () => {
    const res = await request.get('/menhGia/getAllMenhGia')
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getOneMenhGia = async (menhGiaId) => {
    const res = await request.get(`/menhGia/getOneMenhGia?menhGiaId=${menhGiaId}`);
    if (res.data.status === 'success') return res.data.data
    return []
}