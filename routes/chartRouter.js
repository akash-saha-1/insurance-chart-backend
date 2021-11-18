const express = require("express");
const router = express.Router();
const connection = require("../database/database");

// get all insurance
router.get("/", async (req, res) => {
  let regionArr = ['East', 'West', 'North', 'South'];
  let result = {};
  for(let j = 0; j < 4; j++){
    let region = regionArr[j];
    let count = [];
    for (let i = 1; i <= 12; i++) {
      connection.query(
        `select count(*) as count from insurance where Date_of_Purchase like '${i}/%' and Customer_Region='${region}';`,
        (error, rows) => {
          if (!!error) {
            console.error("Error while executing get all query " + error);
            return res.status(500).send("Error Occured");
          } else {
            count[i - 1] = parseInt(rows[0].count);
            if(i == 12){
              result[region] = count;
              if(j == 3){
                return res.status(200).json({data: result});
              }
            }
          }
        }
      );
    }
  }
});

module.exports = router;
