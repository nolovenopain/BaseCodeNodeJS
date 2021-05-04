module.exports = {
    success: (res, data, message) => {
        res.send({
            code: 200,
            data,
            message: message ? message : 'Successful'
        })
    },
    emptyData: (res, data, message) => res.send({
        code: 204,
        data,
        message: message ? message : 'Data is empty'
    })
}