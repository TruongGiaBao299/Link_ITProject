require('dotenv').config();
const express = require('express'); //commonjs
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/postOfficRouter');
const connection = require('./config/database');
const cors = require('cors');

//khởi tạo express
// update
const app = express();
const port = process.env.PORT || 6061;

// config cors
app.use(cors());

//config req.body
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data

//config template engine
configViewEngine(app);

//khai báo route
app.use('/postoffice/', apiRoutes);

(async () => {
    try {
        //using mongoose
        await connection();

        app.listen(port, () => {
            console.log(`Post Office Nodejs App listening on port ${port}`)
        })
    } catch (error) {
        console.log(">>> Error connect to DB: ", error)
    }
})()
