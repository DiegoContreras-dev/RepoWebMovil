const store = require("../data/store");
const { buscarIngrediente } = require("../helpers/ingredientesHelper");

function obtenerIngredientes(req, res) {
  res.json(store.ingredientes);
}

function crearIngrediente(req, res) {

  const { nombre, stock } = req.body;
  
  // TODO: validar nombre
  // TODO: validar stock numérico
  // TODO: validar stock >= 0

  // En caso de error usar:
  // return res.status(400).json({ mensaje: "..." });

  const nuevoIngrediente = {
    id: store.nextIngredienteId++,
    nombre: nombre,
    stock: Number(stock)
  };

  store.ingredientes.push(nuevoIngrediente);
  res.status(201).json({
    ingrediente: nuevoIngrediente,

    
  });
}

function actualizarIngrediente(req, res) {
  const ingrediente = buscarIngrediente(req.params.id);

  if (!ingrediente) {
    return res.status(404).json({ mensaje: "Ingrediente no encontrado" });
  }

  ingrediente.nombre = req.body.nombre;
  ingrediente.stock = Number(req.body.stock);

  return res.json(ingrediente);
}

function eliminarIngrediente(req, res) {
  store.ingredientes = store.ingredientes.filter(
    (ingrediente) => ingrediente.id !== Number(req.params.id)
  );

  res.json({ mensaje: "Ingrediente eliminado" });
}

module.exports = {
  obtenerIngredientes,
  crearIngrediente,
  actualizarIngrediente,
  eliminarIngrediente
};
