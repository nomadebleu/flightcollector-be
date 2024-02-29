require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const badgesRouter = require("./routes/badges");
const flightsRouter = require("./routes/flights");
const planesRouter = require("./routes/planes");
const airportsRouter = require("./routes/airports");

var app = express();
const cors = require("cors");

app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/airports", airportsRouter);
app.use("/users", usersRouter);
app.use("/badges", badgesRouter);
app.use("/flights", flightsRouter);
app.use("/planes", planesRouter);

module.exports = app;
