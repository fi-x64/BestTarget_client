import request from "../utils/request"

export const getAllStaion = async () => {
    const res = await request.get('/station/get-all')
    if (res.data.success) return res.data.data
    return []
}

export const getStationById = async ({ stationId }) => {
    const res = await request.get(`/station/${stationId}`)
    if (res.data.success) return res.data.data
    return []
}

export const deleteImage = async ({ stationId, imagePublicId }) => {
    const res = await request.patch(`/station/${stationId}`, { imagePublicId })
    if (res.data.success) return res.data.data
    return []
}

export const addStation = async (values) => {
    const res = await request.post('/station', values)
    return res
}

export const updateStation = async (values) => {
    const res = await request.put(`/station/${values._id}`, values)
    return res
}