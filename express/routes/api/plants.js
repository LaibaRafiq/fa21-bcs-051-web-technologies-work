let express = require("express");
let router = express.Router();
const req = require("express/lib/request");
let Plant = require("../../models/plant"); 

router.get("/plants/new", async (req, res) => {
 res.render("plants/new");
});

router.put("/plants/:id/edit", async (req, res) => {
  let plant = await Plant.findById(req.params.id);
  plant.name = req.body.name;
  plant.species = req.body.species;
  plant.price = req.body.price;
  plant.description = req.body.description;
  await plant.save();
  return res.render("/plants");
});

router.delete("/plants/:id", async (req, res) => {
  let plant = await Plant.findByIdAndDelete(req.params.id);
  return res.send(plant);
});

router.post("/plants/new", async (req, res) => {
  let record = new Plant(req.body);
  await record.save();
  return res.redirect("/plants");
});

router.get("/plants/:id/delete", async (req, res) => {
  await Plant.findByIdAndDelete(req.params.id);
  return res.redirect("/plants");
});

router.get("/plants/:id/edit", async (req, res) => {
  let plant = await Plant.findById(req.params.id);
  return res.render("edit", { plant });
});

router.get("/plants/:page?", async (req, res) => {
  let page = Number(req.params.page) ? Number(req.params.page) : 1;
  let pageSize = 3;
  let plants = await Plant.find()
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  let total = await Plant.countDocuments();
  let totalPages = Math.ceil(total / pageSize);
  res.render("list", {
    pageTitle: "List All plants",
    plants,
    total,
    page,
    pageSize,
    totalPages,
  });
});
module.exports = router;
