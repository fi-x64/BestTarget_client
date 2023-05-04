import request from "../utils/request"
import authHeader from "./auth-header"

export const getAllPost = async () => {
    const res = await request.get('/tinDang/getAllPosts', { headers: authHeader() })
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getAllPostsNewest = async (amount) => {
    const res = await request.get(`/tinDang/getAllPostsNewest?amount=${amount}`,)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getAllTinDangByUserId = async (userId, postId) => {
    const res = await request.get(`/tinDang/getAllTinDangByUserId?userId=${userId}&postId=${postId}`)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getAllTinDangRelated = async (values) => {
    const res = await request.post(`/tinDang/getAllTinDangRelated`, values)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const createPost = async (values) => {
    const res = await request.post('/tinDang/createPost', values)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const editPost = async (postId, values) => {
    const res = await request.patch(`/tinDang/editPost?postId=${postId}`, values)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getGoiY = async (danhMucPhuId) => {
    const res = await request.get(`/tinDang/getGoiY?danhMucPhuId=${danhMucPhuId}`)
    if (res.data.status === 'success') return res.data.data
    return []
}

export const countTrangThaiTin = async (userId) => {
    const res = await request.get(`/tinDang/countTrangThaiTin?userId=${userId}`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getTinDang = async (userId, key) => {
    const res = await request.post(`/tinDang/getTinDang`, { userId, phanLoai: key });
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getTinDangId = async (id) => {
    const res = await request.get(`/tinDang/getTinDangId?id=${id}`);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getTinDangByValue = async (values) => {
    const res = await request.post(`/tinDang/getTinDangByValue`, values);
    if (res.data.status === 'success') return res.data.data
    return []
}

export const getTinDangIdRestrict = async (id) => {
    const res = await request.get(`/tinDang/getTinDangIdRestrict?id=${id}`, { headers: authHeader() });
    if (res.data.status === 'success') return res.data.data
    return []
}

export const deleteImage = async ({ postId, imagePublicId }) => {
    const res = await request.patch(`/tinDang/deleteImage?postId=${postId}`, { imagePublicId });
    if (res.data.status === 'success') return res.data
    return []
}

export const deleteVideo = async ({ postId, videoPublicId }) => {
    console.log("Check postId, videoPulicId: ", postId, videoPublicId);
    const res = await request.patch(`/tinDang/deleteVideo?postId=${postId}`, { videoPublicId });
    if (res.data.status === 'success') return res.data
    return []
}

export const getStatisticsPostInWeek = async () => {
    const res = await request.get(`/tinDang/statisticsPostInWeek`, { headers: authHeader() });

    if (res.data.status === 'success') return res.data.data
    return []
}

export const getStatisticsPostInWeekByUserId = async () => {
    const res = await request.get(`/tinDang/statisticsPostInWeekByUserId`, { headers: authHeader() });

    if (res.data.status === 'success') return res.data.data
    return []
}

export const getStatisticsPostInProvince = async () => {
    const res = await request.get(`/tinDang/statisticsPostInProvince`, { headers: authHeader() });

    if (res.data.status === 'success') return res.data.data
    return []
}

export const updateTinHetHan = async () => {
    const res = await request.get(`/tinDang/updateTinHetHan`, { headers: authHeader() });

    if (res.data.status === 'success') return res.data.data
    return []
}