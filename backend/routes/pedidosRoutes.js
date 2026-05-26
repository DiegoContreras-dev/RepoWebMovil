const express = require("express");
const {
  obtenerPedidos,
  crearPedido,
  eliminarPedido
} = require("../controllers/pedidosController");

const router = express.Router();

router.get("/", obtenerPedidos);
router.post("/", crearPedido);
router.delete("/:id", eliminarPedido);

module.exports = router;
