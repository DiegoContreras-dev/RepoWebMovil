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

  // TODO: validar nombre
  // TODO: validar precio numérico y mayor que 0
  // TODO: validar que ingredientes exista y sea un arreglo
  // TODO: validar que ingredientes no esté vacío
  // TODO: validar que cada item tenga ingredienteId
  // TODO: validar que cada ingredienteId exista
  // TODO: validar que cada cantidad sea numérica y mayor que 0

  const nuevoPlato = {
    id: store.nextPlatoId++,
    nombre: nombre,
    precio: Number(precio),
    ingredientes: normalizarIngredientesPlato(ingredientes)
  };

  store.platos.push(nuevoPlato);


  // TODO: Devolver el detalle de nuevoPlato usando la función detallePlato(), un 201 y un mensaje de éxito.
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
