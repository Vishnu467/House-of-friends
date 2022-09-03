require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const app = express();
const configs = require('./common/common')

/**
 * imports for routes
 */
const authRoutes = require('./module/Auth/auth_route');
const commonRoutes = require('./module/common/common.route');
const houseRoutes = require('./module/house/house.route');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// app.use(cookieParser());

app.use(cors());
// app.use(helmet());


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *");
    if (req.method === "OPTIONS") {
        res.header(
            "Access-Control-Allow-Methods",
            "GET, PUT, POST, PATCH, DELETE, OPTIONS"
        );
        res.setHeader("Access-Control-Allow-Credentials", true);
        return res.status(200).json({});
    }
    next();
});

app.use("/auth", authRoutes);
app.use("/common", commonRoutes);
app.use("/house",houseRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "hellooo!!!",
        url: `${req.protocol}://${req.get("host")}`,
    });
});

mongoose
    .connect(
        configs.mongoUrl.NEW, { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        console.log("DB Connected!!!")

        app.listen(process.env.PORT || 8000, () =>
            console.log("Server started!!!")
        );
    })
    .catch((err) => {
        console.log(err);
    });