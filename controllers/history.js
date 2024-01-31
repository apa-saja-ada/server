const { History} = require('../models')

class HistoryController {
    static async getHistoryList(req,res,next) {
        try {
            const result = await History.findAll({raw: true,
                order: [['createdAt', 'DESC']]})
            const transformResult = result.map((d,k) => {
                const {...body} = d
                return {
                    no: k + 1,
                    ...body
                }
            })

            res.status(200).json({
                status: true,
                message: "Succesfully get all histories",
                statusCode: "OK",
                response: transformResult,
              });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = HistoryController