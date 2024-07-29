const mongoose = require("mongoose")
const {DB_CONNECTION} = process.env
mongoose.connect(DB_CONNECTION)
.then(()=> {
    console.log("connected to DB server")
})
.catch(()=> {
    console.log("Cannot connect to DB server")
})