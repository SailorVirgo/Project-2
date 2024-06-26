const express = require("express");
const multer = require("multer");
const path = require("path");
const { Recipes, Ingredients } = require("../../models");
const router = express.Router();
const withAuth = require("../../utils/auth");

// Set up multer storage
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/uploads/"),
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("recipeImage");

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipes.findAll({
      where: { user_id: req.session.user_id },
      include: [Ingredients],
    });
    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve recipes", error });
  }
});

// Get recipe by ID
router.get("/:id", withAuth, async (req, res) => {
  try {
    const recipeData = await Recipes.findByPk(req.params.id, {
      include: [{ model: Ingredients }],
    });

    if (!recipeData) {
      res.status(404).json({ message: "Recipe not found" });
      return;
    }


    const recipe = recipeData.get({ plain: true });

    req.session.save(() => {
      // We set up a session variable to count the number of times we visit the homepage
      if (req.session.countVisit) {
        // If the 'countVisit' session variable already exists, increment it by 1
        req.session.countVisit++;
      } else {
        // If the 'countVisit' session variable doesn't exist, set it to 1
        req.session.countVisit = 1;
      }
      
    res.render("recipe", {
      recipe,
      logged_in: req.session.logged_in,
      countVisit: req.session.countVisit,

    });
  });
  }catch(err) {

    res.status(500).json(err);
  }
});

// Create a new recipe
router.post("/create-recipe", withAuth, async (req, res) => {
  try {
    const { name, description, instructions, ingredients, has_nuts } = req.body;
    const userId = req.session.user_id;

    const newPost = await Recipes.create({
      name,
      description,
      instructions,
      ingredients,
      has_nuts,
      user_id: userId,
    });

    console.log("New post created:", newPost);
    res.status(200).json(newPost);
  } catch (err) {
    console.error("Failed to create post:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// Update a recipe
router.put("/:id", withAuth, async (req, res) => {
  try {
    const { name, description, instructions, has_nuts } = req.body;

    const recipe = await Recipes.findByPk(req.params.id);
    if (!recipe) {
      res.status(404).json({ message: "Recipe not found" });
      return;
    }
    recipe.name = name;
    recipe.description = description;
    recipe.instructions = instructions;
    recipe.has_nuts = has_nuts === "true";
    await recipe.save();

    res.status(200).json({ message: "Recipe updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update recipe", error });
  }
});

// Delete a recipe
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const result = await Recipes.destroy({ where: { id: req.params.id } });
    if (result) {
      res.status(200).json({ message: "Recipe deleted successfully" });
    } else {
      res.status(404).json({ message: "Recipe not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to delete recipe" });
  }
});

module.exports = router;
