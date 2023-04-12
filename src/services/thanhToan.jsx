import request from "../utils/request"
import authHeader from "./auth-header";

export const thanhToanMomo = async (userId, menhGia) => {
    const res = await request.get(`/thanhToan/thanhToanMomo?userId=${userId}&soTien=${menhGia}`)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const thanhToanVNPay = async (menhGia) => {
    const res = await request.post(`/thanhToan/thanhToanVNPay`, { soTien: menhGia })
    if (res.data.status === 'success') return res.data.data
    return []
}

export const saveMomoPayment = async (userId, values) => {
    const res = await request.post(`/thanhToan/saveMomoPayment`, { userId, values })
    if (res.data) return res.data
    return []
}

export const saveVNPayPayment = async (userId, values) => {
    const res = await request.post(`/thanhToan/saveVNPayPayment`, { userId, values })
    if (res.data) return res.data
    return []
}

export const getViTien = async (userId) => {
    const res = await request.get(`/thanhToan/getViTien`, { headers: authHeader() })
    if (res.data.status === 'success') return res.data.data
    return []
}

export const thanhToanCoin = async (values) => {
    const res = await request.post(`/thanhToan/thanhToanCoin`, values)
    if (res.data.status) return res.data
    return []
}