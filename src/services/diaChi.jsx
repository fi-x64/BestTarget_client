import request from "../utils/request";

export const getAllTinhThanh = async () => {
    const res = await request.get('/diaChi/getAllTinhThanh');
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getQuanHuyen = async (tinhTPCode) => {
    const res = await request.get(`/diaChi/getQuanHuyen?tinhTPCode=${tinhTPCode}`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getPhuongXa = async (quanHuyenCode) => {
    const res = await request.get(`/diaChi/getPhuongXa?quanHuyenCode=${quanHuyenCode}`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getOneTinhTP = async (tinhTPCode) => {
    const res = await request.get(`/diaChi/getOneTinhTP?tinhTPCode=${tinhTPCode}`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getOneQuanHuyen = async (quanHuyenCode) => {
    const res = await request.get(`/diaChi/getOneQuanHuyen?quanHuyenCode=${quanHuyenCode}`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getOnePhuongXa = async (phuongXaCode) => {
    const res = await request.get(`/diaChi/getOnePhuongXa?phuongXaCode=${phuongXaCode}`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getOneDiaChi = async (tinhTPCode, quanHuyenCode, phuongXaCode) => {
    const res = await request.get(`/diaChi/getOnePhuongXa?tinhTPCode=${tinhTPCode}&quanHuyenCode=${quanHuyenCode}&phuongXaCode=${phuongXaCode}`);
    if (res.data.status === 'success') return res.data.data
    return []
}