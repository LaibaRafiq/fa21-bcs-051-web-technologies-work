let express = require("express");
let router = express.Router();
const req = require("express/lib/request");
let Plant = require("../../models/plant"); 




router.get("/plants/new", async (req, res) => {
 res.render("plants/new");
});
router.post("/plants/new", async (req, res) => {
  try {
    let record = new Plant(req.body);
    await record.save();
    // res.send(record);
    res.redirect("/plants")
  } catch (error) {
    console.error("Error saving plant:", error);
    res.status(500).send("Error saving plant");
  }
});
router.post("/plants/:id/edit", async (req, res) => {
  try {
    let plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).send("Plant not found");
    }

    plant.name = req.body.name;
    plant.species = req.body.species;
    plant.price = req.body.price;
    plant.description = req.body.description;
    await plant.save();
    return res.redirect("/plants"); 
  } catch (error) {
    console.error("Error updating plant:", error);
    res.status(500).send("An error occurred while updating the plant.");
  }
});


router.delete("/plants/:id", async (req, res) => {
  let plant = await Plant.findByIdAndDelete(req.params.id);
  return res.send(plant);
});


router.get("/plants/:id/delete", async (req, res) => {
  let plant = await Plant.findByIdAndDelete(req.params.id);
  if (!plant) {
    return res.status(404).send("Plant not found");
  }
  return res.redirect("/plants"); 
});


router.get("/plants/:id/edit", async (req, res) => {
  let plant = await Plant.findById(req.params.id);
  return res.render("edit", { plant });
});

router.get("/plants/:page?", async (req, res) => {
  let page = Number(req.params.page) ? Number(req.params.page) : 1;
  let pageSize = 4;
  let plants = await Plant.find()
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  let total = await Plant.countDocuments();
  let totalPages = Math.ceil(total / pageSize);
  res.render("list", {
    pageTitle: "List All plants",
     plants:plants,
    total:total,
    page,
    pageSize,
    totalPages,
  });
});
module.exports = router;
