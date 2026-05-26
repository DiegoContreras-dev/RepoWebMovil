const store = require("../data/store");
const {
  buscarPlato,
  normalizarIngredientesPlato,
  detallePlato
} = require("../helpers/platosHelper");

const { buscarIngrediente } = require("../helpers/ingredientesHelper");

function obtenerPlatos(req, res) {
  res.json(store.platos.map(detallePlato));
}

function crearPlato(req, res) {
  const { nombre, precio, ingredientes } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({ mensaje: "El nombre no puede estar vacío" });
  }

  if (precio === undefined || precio === null || precio === "" || isNaN(Number(precio)) || Number(precio) <= 0) {
    return res.status(400).json({ mensaje: "El precio debe ser un número mayor que 0" });
  }

  if (!ingredientes || !Array.isArray(ingredientes)) {
    return res.status(400).json({ mensaje: "El campo ingredientes debe existir y ser un arreglo" });
  }

  if (ingredientes.length === 0) {
    return res.status(400).json({ mensaje: "El arreglo de ingredientes no puede estar vacío" });
  }

  for (const item of ingredientes) {
    if (item.ingredienteId === undefined || item.ingredienteId === null) {
      return res.status(400).json({ mensaje: "Cada elemento debe tener ingredienteId" });
    }

    const ingredienteExiste = buscarIngrediente(item.ingredienteId);
    if (!ingredienteExiste) {
      return res.status(400).json({ mensaje: `El ingrediente con id ${item.ingredienteId} no existe en el sistema` });
    }

    if (item.cantidad === undefined || isNaN(Number(item.cantidad)) || Number(item.cantidad) <= 0) {
      return res.status(400).json({ mensaje: "Cada cantidad debe ser numérica y mayor que 0" });
    }
  }

  const nuevoPlato = {
    id: store.nextPlatoId++,
    nombre: nombre.trim(),
    precio: Number(precio),
    ingredientes: normalizarIngredientesPlato(ingredientes)
  };

  store.platos.push(nuevoPlato);

  return res.status(201).json({
    mensaje: "Plato creado correctamente",
    plato: detallePlato(nuevoPlato)
  });
}

function actualizarPlato(req, res) {
  const plato = buscarPlato(req.params.id);

  if (!plato) {
    return res.status(404).json({ mensaje: "Plato no encontrado" });
  }

  plato.nombre = req.body.nombre;
  plato.precio = Number(req.body.precio);
  plato.ingredientes = normalizarIngredientesPlato(req.body.ingredientes);

  return res.json(detallePlato(plato));
}

function eliminarPlato(req, res) {
  store.platos = store.platos.filter((plato) => plato.id !== Number(req.params.id));
  res.json({ mensaje: "Plato eliminado" });
}

module.exports = {
  obtenerPlatos,
  crearPlato,
  actualizarPlato,
  eliminarPlato
};
