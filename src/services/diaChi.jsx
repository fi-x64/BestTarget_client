import request from "../utils/request";

export const getAllTinhThanh = async () => {
    const res = await request.get('/getAllTinhThanh');
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getQuanHuyen = async (tinhTPCode) => {
    const res = await request.get(`/getQuanHuyen?tinhTPCode=${tinhTPCode}`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getPhuongXa = async (quanHuyenCode) => {
    const res = await request.get(`/getPhuongXa?quanHuyenCode=${quanHuyenCode}`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getOneTinhTP = async (tinhTPCode) => {
    const res = await request.get(`/getOneTinhTP?tinhTPCode=${tinhTPCode}`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getOneQuanHuyen = async (quanHuyenCode) => {
    const res = await request.get(`/getOneQuanHuyen?quanHuyenCode=${quanHuyenCode}`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getOnePhuongXa = async (phuongXaCode) => {
    const res = await request.get(`/getOnePhuongXa?phuongXaCode=${phuongXaCode}`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getOneDiaChi = async (tinhTPCode, quanHuyenCode, phuongXaCode) => {
    const res = await request.get(`/getOnePhuongXa?tinhTPCode=${tinhTPCode}&quanHuyenCode=${quanHuyenCode}&phuongXaCode=${phuongXaCode}`);
    if (res.data.status === 'success') return res.data.data
    return []
}