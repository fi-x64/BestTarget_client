import request from "../utils/request"

export const thanhToanMomo = async (userId, menhGia) => {
    const res = await request.get(`/thanhToanMomo?userId=${userId}&soTien=${menhGia}`)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const thanhToanVNPay = async (menhGia) => {
    const res = await request.post(`/thanhToanVNPay`, { soTien: menhGia })
    if (res.data.status === 'success') return res.data.data
    return []
}

export const saveMomoPayment = async (userId, values) => {
    const res = await request.post(`/saveMomoPayment`, { userId, values })
    if (res.data.status === 'success') return res.data.data
    return []
}