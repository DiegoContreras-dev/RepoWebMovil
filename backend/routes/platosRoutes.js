const express = require("express");
const {
  obtenerPlatos,
  crearPlato,
  actualizarPlato,
  eliminarPlato
} = require("../controllers/platosController");

const router = express.Router();

router.get("/", obtenerPlatos);
router.post("/", crearPlato);
router.put("/:id", actualizarPlato);
router.delete("/:id", eliminarPlato);

module.exports = router;
