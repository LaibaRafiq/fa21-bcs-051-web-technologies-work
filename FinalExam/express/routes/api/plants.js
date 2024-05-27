let express = require("express");
let router = express.Router();
let Plant = require("../../models/plant"); 
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const req = require("express/lib/request");
const isAdmin = require("../../middleware/isAdmin"); 

router.get("/plants/search", async (req, res) => {
  const searchTerm = req.query.query;
  const page = Number(req.query.page) ? Number(req.query.page) : 1;
  const pageSize = 4;

  try {
      const searchQuery = {
          name: { $regex: searchTerm, $options: 'i' } 
      };

      const plants = await Plant.find(searchQuery)
          .skip(pageSize * (page - 1))
          .limit(pageSize);

      const total = await Plant.countDocuments(searchQuery);
      const totalPages = Math.ceil(total / pageSize);

      if (!req.session.searchHistory) {
          req.session.searchHistory = [];
      }
      req.session.searchHistory.push(searchTerm);
      req.session.searchHistory = [...new Set(req.session.searchHistory)].slice(-10);

      let errorMessage = '';
      if (plants.length === 0) {
          errorMessage = 'No plants found matching your search criteria.';
      }

      res.render("searchResults", {
          pageTitle: "Search Results",
          plants: plants,
          total: total,
          page: page,
          pageSize: pageSize,
          totalPages: totalPages,
          searchTerm: searchTerm,
          searchHistory: req.session.searchHistory,
          user: req.session.user,
          errorMessage: errorMessage
      });
  } catch (error) {
      console.error("Error searching plants:", error);
      res.status(500).send("An error occurred while searching for plants.");
  }
});


router.get("/plants/new", isAdmin,async (req, res) => {
 res.render("plants/new");
});
router.post("/plants/new", isAdmin,async (req, res) => {
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
router.post("/plants/:id/edit",isAdmin, async (req, res) => {
  try {
    let plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).send("Plant not found");
    }

    plant.name = req.body.name;
    plant.species = req.body.species;
    plant.price = req.body.price;
    plant.description = req.body.description;
    plant.images = req.body.images.map(image => ({
      url: image.url,
      description: image.description
    }));
    await plant.save();
    return res.redirect("/plants"); 
  } catch (error) {
    console.error("Error updating plant:", error);
    res.status(500).send("An error occurred while updating the plant.");
  }
});


router.delete("/plants/:id",isAdmin, async (req, res) => {
  let plant = await Plant.findByIdAndDelete(req.params.id);
  return res.send(plant);
});


router.get("/plants/:id/delete", isAdmin,async (req, res) => {
  let plant = await Plant.findByIdAndDelete(req.params.id);
  if (!plant) {
    return res.status(404).send("Plant not found");
  }
  return res.redirect("/plants"); 
});


router.get("/plants/:id/edit",isAdmin, async (req, res) => {
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
  console.log(req.session.user,'userr role')
  let totalPages = Math.ceil(total / pageSize);
  res.render("list", {
    pageTitle: "List All plants",
     plants:plants,
    total:total,
    page,
    pageSize,
    totalPages,
    user: req.session.user,
  });
});



router.get("/products/:page?", async (req, res) => {
  let page = Number(req.params.page) ? Number(req.params.page) : 1;
  let pageSize = 4;
  let plants = await Plant.find()
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  let total = await Plant.countDocuments();
  let totalPages = Math.ceil(total / pageSize);
  res.render("products", {
    pageTitle: "List All Plants",
    products: plants,
    total: total,
    page,
    pageSize,
    totalPages,
    user: req.session.user,
  });
});
module.exports = router;




