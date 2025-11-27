export const success = async (res, message, data = null) => {
    return res.json({
        success: true,
        message,
        data
    })
}

export const error = async (res, message, status = 400, errorField) => {
    return res.status(status).json({
        success: true,
        message,
        errorField
    })
}