import request from "../utils/request"
import authHeader from "./auth-header"

export const getAllPost = async () => {
    const res = await request.get('/getAllPosts', { headers: authHeader() })
    if (res.data.status === 'success') return res.data.data
    return []
}

export const createPost = async (values) => {
    const res = await request.post('/createPost', values)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const editPost = async (postId, values) => {
    const res = await request.patch(`/editPost?postId=${postId}`, values)
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

export const getTinDangId = async (id) => {
    const res = await request.get(`/getTinDangId?id=${id}`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const deleteImage = async ({ postId, imagePublicId }) => {
    const res = await request.patch(`/deleteImage?postId=${postId}`, { imagePublicId });
    if (res.data.status === 'success') return res.data
    return []
}

export const deleteVideo = async ({ postId, videoPublicId }) => {
    console.log("Check postId, videoPulicId: ", postId, videoPublicId);
    const res = await request.patch(`/deleteVideo?postId=${postId}`, { videoPublicId });
    if (res.data.status === 'success') return res.data
    return []
}