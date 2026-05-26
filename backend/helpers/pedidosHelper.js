const { buscarIngrediente } = require("./ingredientesHelper");
const { buscarPlato } = require("./platosHelper");

function normalizarItemsPedido(items = []) {
  return items.map((item) => ({
    platoId: Number(item.platoId),
    cantidad: Number(item.cantidad)
  }));
}

function calcularIngredientesNecesarios(itemsPedido) {
  const necesarios = {};

  for (const item of itemsPedido) {
    const plato = buscarPlato(item.platoId);

    if (!plato) {
      return { error: `No existe el plato con id ${item.platoId}` };
    }

    for (const ingrediente of plato.ingredientes) {
      if (!necesarios[ingrediente.ingredienteId]) {
        necesarios[ingrediente.ingredienteId] = 0;
      }

      necesarios[ingrediente.ingredienteId] += ingrediente.cantidad * item.cantidad;
    }
  }

  return { necesarios };
}

function validarStock(necesarios) {
  for (const ingredienteId in necesarios) {
    const ingrediente = buscarIngrediente(ingredienteId);
    const cantidadNecesaria = necesarios[ingredienteId];

    if (!ingrediente) {
      return {
        ok: false,
        mensaje: `Falta el ingrediente con id ${ingredienteId}`
      };
    }

    if (ingrediente.stock < cantidadNecesaria) {
      return {
        ok: false,
        mensaje: `Stock insuficiente de ${ingrediente.nombre}. Necesita ${cantidadNecesaria}, hay ${ingrediente.stock}`
      };
    }
  }

  return { ok: true };
}

function descontarStock(necesarios) {
  for (const ingredienteId in necesarios) {
    const ingrediente = buscarIngrediente(ingredienteId);
    ingrediente.stock -= necesarios[ingredienteId];
  }
}

module.exports = {
  normalizarItemsPedido,
  calcularIngredientesNecesarios,
  validarStock,
  descontarStock
};
