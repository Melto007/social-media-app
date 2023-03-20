function asyncHandler(fun) {
    return async function(req, res, next) {
        try {
            await fun(req, res, next)
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}
export default asyncHandler