const express = require("express");
const {
  obtenerIngredientes,
  crearIngrediente,
  actualizarIngrediente,
  eliminarIngrediente
} = require("../controllers/ingredientesController");

const router = express.Router();

router.get("/", obtenerIngredientes);
router.post("/", crearIngrediente);
router.put("/:id", actualizarIngrediente);
router.delete("/:id", eliminarIngrediente);

module.exports = router;
