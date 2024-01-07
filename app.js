if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const errorHandler = require('./middlewares/errorHandler')
const cors = require('cors')
const path = require("path");


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use('/api',require('./routes/index'))
app.use(errorHandler)

app.use(
    "/public",
    express.static(path.join(process.cwd(), "public", "uploads", "cars"))
  );

app.listen(port, () => {
    console.log(`example app listening on port ${port}`);
})

module.exports = app