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
    const itemsDetalle = pedido.items.map((item) => {
      const plato = buscarPlato(item.platoId);
      const nombre = plato ? plato.nombre : "Plato eliminado";
      const precio = plato ? plato.precio : 0;
      const subtotal = precio * item.cantidad;

      return {
        platoId: item.platoId,
        nombre: nombre,
        cantidad: item.cantidad,
        subtotal: subtotal
      };
    });

    const total = itemsDetalle.reduce((suma, item) => suma + item.subtotal, 0);

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
