
module.exports = async (req, res, next) => {
    try {
        const {role} = req.user 

        if(role !== "Admin") {
            throw {
                name: "Unauthorized",
                errors: [
                  {
                    message: "Unauthorized role",
                  },
                ],
              };
        }
        next()
    } catch (error) {
        next(error)
    }
}