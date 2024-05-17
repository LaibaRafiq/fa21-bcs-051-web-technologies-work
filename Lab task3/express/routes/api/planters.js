let express = require("express");
let req = require("express/lib/request");
let router = express.Router();
let Planter = require("../../models/planter"); 

router.get("/api/planters/:id", async (req, res) => {
  let planter = await Planter.findById(req.params.id);
  return res.send(planter);
});

router.put("/api/planters/:id", async (req, res) => {
  let planter = await Planter.findById(req.params.id);
  planter.name = req.body.name;
  planter.material = req.body.material;
  planter.price = req.body.price;
  planter.description = req.body.description;
  await planter.save();
  return res.send(planter);
});

router.delete("/api/planters/:id", async (req, res) => {
  let planter = await Planter.findByIdAndDelete(req.params.id);
  return res.send(planter);
});

router.post("/api/planters", async (req, res) => {
  let data = req.body;
  let record = new Planter(data);
  await record.save();
  return res.send(record);
});

router.get("/api/planters", async function (req, res) {
  let planters = await Planter.find();
  return res.send(planters);
});

router.get("/api/planters/:page?", async (req, res) => {
  try {
    const page = Number(req.params.page) || 1;
    const pageSize = 3;
    const planters = await Planter.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const total = await Plant.countDocuments();
    const totalPages = Math.ceil(total / pageSize);
    res.send({
      planters,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
