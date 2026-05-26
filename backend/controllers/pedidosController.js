const store = require("../data/store");
const { buscarPlato } = require("../helpers/platosHelper");
const {
  normalizarItemsPedido,
  calcularIngredientesNecesarios,
  validarStock,
  descontarStock
} = require("../helpers/pedidosHelper");

function obtenerPedidos(req, res) {
  const pedidosConDetalle = store.pedidos.map((pedido) => {
    // TODO: completar itemsDetalle

    const itemsDetalle = pedido.items.map((item) => {
      const plato = {}; // = Obtener plato con buscarPlato

      return {

        //nombre: plato ? plato.nombre : "Plato eliminado",
        cantidad: item.cantidad,
        subtotal: 0 // TODO: calcular precio del plato * cantidad
      };
    });

    // TODO: calcular el total sumando los subtotales
    const total = 0;

    return {
      id: pedido.id,
      fecha: pedido.fecha,
      cantidadItems: pedido.items.length,
      total: total,
      itemsDetalle: itemsDetalle
    };
  });

  res.json(pedidosConDetalle);
}


function crearPedido(req, res) {
  const items = normalizarItemsPedido(req.body.items);

  const resultado = calcularIngredientesNecesarios(items);

  if (resultado.error) {
    return res.status(400).json({ mensaje: resultado.error });
  }

  const validacion = validarStock(resultado.necesarios);

  if (!validacion.ok) {
    return res.status(400).json({ mensaje: validacion.mensaje });
  }

  descontarStock(resultado.necesarios);

  const total = items.reduce((suma, item) => {
    const plato = buscarPlato(item.platoId);
    return suma + plato.precio * item.cantidad;
  }, 0);

  const pedido = {
    id: store.nextPedidoId++,
    fecha: new Date().toISOString(),
    items,
    total
  };

  store.pedidos.push(pedido);

  return res.status(201).json({
    mensaje: "Pedido creado correctamente",
    pedido
  });
}

function eliminarPedido(req, res) {
  store.pedidos = store.pedidos.filter((pedido) => pedido.id !== Number(req.params.id));
  res.json({ mensaje: "Pedido eliminado del historial" });
}

module.exports = {
  obtenerPedidos,
  crearPedido,
  eliminarPedido
};
