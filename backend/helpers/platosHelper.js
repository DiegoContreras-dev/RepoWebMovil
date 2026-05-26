const store = require("../data/store");
const { buscarIngrediente } = require("./ingredientesHelper");

function buscarPlato(id) {
  return store.platos.find((plato) => plato.id === Number(id));
}

/**
 * Normaliza el arreglo de ingredientes de un plato, asegurando que los campos sean numéricos
 * y tengan el formato correcto.
 * @param {*} ingredientes 
 * @returns Un arreglo de ingredientes normalizado con campos ingredienteId y cantidad como números.
 */
function normalizarIngredientesPlato(ingredientes = []) {
  return ingredientes.map((ingrediente) => ({
    ingredienteId: Number(ingrediente.ingredienteId),
    cantidad: Number(ingrediente.cantidad)
  }));
}

function detallePlato(plato) {
  return {
    ...plato,
    ingredientesDetalle: plato.ingredientes.map((item) => {
      const ingrediente = buscarIngrediente(item.ingredienteId);

      return {
        ingredienteId: item.ingredienteId,
        nombre: ingrediente ? ingrediente.nombre : "Ingrediente eliminado",
        cantidad: item.cantidad
      };
    })
  };
}

module.exports = {
  buscarPlato,
  normalizarIngredientesPlato,
  detallePlato
};


