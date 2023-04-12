import request from "../utils/request"

export const getAllKhuyenMai = async () => {
    const res = await request.get(`/khuyenMai/getAllKhuyenMai`)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getOneKhuyenMai = async (khuyenMaiId) => {
    const res = await request.get(`/khuyenMai/getOneKhuyenMai?khuyenMaiId=${khuyenMaiId}`)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getAppliedKhuyenMai = async () => {
    const res = await request.get(`/khuyenMai/getAppliedKhuyenMai`)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const createKhuyenMai = async (values) => {
    const res = await request.post(`/khuyenMai/createKhuyenMai`, values)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const editKhuyenMai = async (khuyenMaiId, values) => {
    const res = await request.post(`/khuyenMai/editKhuyenMai?khuyenMaiId=${khuyenMaiId}`, values)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const deleteKhuyenMai = async (khuyenMaiId) => {
    const res = await request.delete(`/khuyenMai/deleteKhuyenMai?khuyenMaiId=${khuyenMaiId}`)
    if (res.data.status === 'success') return res.data.data
    return []
}