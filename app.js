let express = require("express");
const morgan = require("morgan");
const app = express();
require("dotenv").config();
const connection = require("./database/database");
const cors = require("cors");
const insuranceRoutes = require("./routes/insuranceRouter.js");
const chartRoutes = require("./routes/chartRouter.js");

// cors enable
app.use(cors());
app.options("*", cors());

//logging perspective
app.use(morgan("tiny"));

// parse json body request
app.use(express.json());

//router links
app.use("/api/v1/chart", chartRoutes);
app.use("/api/v1", insuranceRoutes);

//database connection
connection.connect((error) => {
  if (error) {
    console.error("Error while connecting to database due to " + error);
  } else {
    //server starting
    app.listen(process.env.PORT);
    console.log(`server is started on PORT ${process.env.PORT}`);
  }
});
