const store = require("../data/store");
const { buscarIngrediente } = require("../helpers/ingredientesHelper");
const { buscarPlato } = require("../helpers/platosHelper");

function obtenerDashboard(req, res) {
  const platosRealizados = {};
  const ingredientesConsumidos = {};

  for (const pedido of store.pedidos) {
    for (const item of pedido.items) {
      const plato = buscarPlato(item.platoId);

      if (!plato) {
        continue;
      }

      if (!platosRealizados[plato.nombre]) {
        platosRealizados[plato.nombre] = 0;
      }

      platosRealizados[plato.nombre] += item.cantidad;

      for (const ingredientePlato of plato.ingredientes) {
        const ingrediente = buscarIngrediente(ingredientePlato.ingredienteId);
        const nombre = ingrediente
          ? ingrediente.nombre
          : `Ingrediente ${ingredientePlato.ingredienteId}`;

        if (!ingredientesConsumidos[nombre]) {
          ingredientesConsumidos[nombre] = 0;
        }

        //TODO: Sumar la cantidad de ingrediente necesaria para el plato multiplicada por la cantidad del item
      }
    }
  }

  res.json({
    cantidadPedidos: store.pedidos.length,
    platosRealizados,
    ingredientesConsumidos
  });
}

module.exports = {
  obtenerDashboard
};
