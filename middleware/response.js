

export const sendResponse = (
    res,
    success,
    data,
    message,
    statusCode,
) => {
    return res.json({
        success: success,
        data: data,
        message: message,
        statusCode: statusCode
    })
}