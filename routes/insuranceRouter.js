const express = require("express");
const router = express.Router();
const connection = require("../database/database");

// get all insurance
router.get("/", async (req, res) => {
  connection.query("select * from insurance", (error, rows, field) => {
    if (!!error) {
      console.error("Error while executing get all query " + error);
      return res.status(500).send("Error Occured");
    } else {
      return res.status(200).json({ data: rows });
    }
  });
});

// get all insurance by pagination
router.get("/page/:id", async (req, res) => {
  let pageId = req.params.id;
  if (pageId < 1 || pageId > 25) {
    return res.status(400).send("Invalid request with wrong page Id");
  } else {
    connection.query(
      "select count(*) as count from insurance",
      (error, rows) => {
        let count = parseInt(rows[0].count);

        if (!!error) {
          console.error(
            "Error while executing get count query " + error
          );
          return res.status(500).send("Error Occured");
        } else {
          let skip = (pageId - 1) * 50;
          connection.query(
            `select * from insurance limit 50 offset ${skip}`,
            (error1, rows) => {
              if (!!error1) {
                console.error(
                  "Error while executing get page query " + error
                );
                return res.status(500).send("Error Occured");
              } else {
                return res.status(200).json({ count: count/50, data: rows });
              }
            }
          );
        }
      }
    );
  }
});

// get insurance by id
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  if (id.length < 2) {
    return res.status(400).send("Please send valid Policy Id");
  } else {
    connection.query(
      `select * from insurance where Policy_id=${id}`,
      (error, rows) => {
        if (!!error) {
          console.error(
            "Error while executing get by id query " + error
          );
          return res.status(500).send("Error Occured");
        } else {
          return res.status(200).json({ data: rows[0] });
        }
      }
    );
  }
});

// update insurance by id
router.put("/:id", async (req, res) => {
  let id = req.params.id;
  if (id.length < 2 || !req.body) {
    return res.status(400).send("Please send valid Policy Id");
  } else {
    connection.query(
      `select * from insurance where Policy_id=${id}`,
      (error, rows, field) => {
        if (!!error) {
          console.error(
            "Error while executing get by id query " + error
          );
          return res.status(500).send("Error Occured");
        } else {
          if (rows.length > 0) {
            let Fuel = req.body.Fuel;
            let VEHICLE_SEGMENT = req.body.VEHICLE_SEGMENT;
            let Premium = req.body.Premium;
            let Customer_Marital_status = req.body.Customer_Marital_status;
            let Customer_Region = req.body.Customer_Region;
            let Customer_Income_Group = req.body.Customer_Income_Group;
            //console.log(Fuel, VEHICLE_SEGMENT, Premium, Customer_Region, Customer_Income_Group, Customer_Marital_status);

            if (
              !Fuel ||
              !VEHICLE_SEGMENT ||
              !Premium ||
              !Customer_Region ||
              !Customer_Income_Group
            ) {
              return res.status(400).send("Invalid Request");
            } else {
              connection.query(
                `UPDATE insurance SET Fuel='${Fuel}', VEHICLE_SEGMENT='${VEHICLE_SEGMENT}',
                      Premium=${Premium}, Customer_Marital_status=${Customer_Marital_status}, 
                      Customer_Region='${Customer_Region}', Customer_Income_Group='${Customer_Income_Group}' WHERE Policy_id=${id}`,
                (error1, rows1) => {
                  if (!!error1) {
                    console.error(
                      "Error while executing update by id query " +
                        error1
                    );
                    return res.status(500).send("Error Occured");
                  } else {
                    return res.status(200).send("updated successfully");
                  }
                }
              );
            }
          } else {
            return res.status(400).send("Please send valid Policy Id");
          }
        }
      }
    );
  }
});

// search insurance by policy ID or customer ID
router.get("/search/:id", async (req, res) => {
  let id = req.params.id;
  if (id.length < 1) {
    return res.status(400).send("Please send valid Policy Id");
  } else {
    connection.query(
      `select * from insurance where Policy_id=${id} or Customer_id=${id}`,
      (error, rows) => {
        if (!!error) {
          console.error(
            "Error while executing serch by id query " + error
          );
          return res.status(500).send("Error Occured");
        } else {
          return res.status(200).json({ data: rows });
        }
      }
    );
  }
});

setInterval(()=>{connection.query("select * from insurance", (error, rows, field) => {
    if (!!error) {
      console.error("Error while executing auto query " + error);
    } else {
      console.log("Auto query executed succesfully");
    }})},300000);

module.exports = router;
