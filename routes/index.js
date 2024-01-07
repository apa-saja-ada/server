const router = require('express').Router()
const admin = require('./admin')
router.get('/', async(req, res)=> {
    res.status(200).json({message: "oke"})
})

router.use('/admin', admin)


module.exports = router