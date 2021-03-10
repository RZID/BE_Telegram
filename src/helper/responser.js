module.exports = {
    ok (res, data) {
        return res.status(200).json({
            status: 200,
            statusMsg: 'OK',
            message: data
        })
    },
    ise (res, data) {
        return res.status(500).json({
            status: 500,
            statusMsg: 'Internal Server Error',
            message: data
        })
    },
    conflict (res, data) {
        return res.status(409).json({
            status: 409,
            statusMsg: 'Conflict',
            message: data
        })
    },
    noContent (res, data) {
        return res.status(204).json({
            status: 204,
            statusMsg: 'No Content',
            message: data
        })
    },
    unauthorized (res, data) {
        return res.status(401).json({
            status: 401,
            statusMsg: 'Unauthorized',
            message: data
        })
    },
    notFound (res, data) {
        return res.status(404).json({
            status: 404,
            statusMsg: 'Not Found',
            message: data
        })
    }
}