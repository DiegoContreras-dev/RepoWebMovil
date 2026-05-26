import { obtenerDatos, enviarDatos, eliminarDatos } from "./api.js";

let platos = [];
let pedidos = [];

const platosParaPedido = document.getElementById("platosParaPedido");
const listaPedidos = document.getElementById("listaPedidos");
const mensaje = document.getElementById("mensajePedido");
const crearPedidoBtn = document.getElementById("crearPedidoBtn");

function obtenerPlatos() {
  return obtenerDatos("/platos");
}

function obtenerPedidos() {
  return obtenerDatos("/pedidos");
}

function crearPedido(payload) {
  return enviarDatos("/pedidos", "POST", payload);
}

function eliminarPedido(id) {
  return eliminarDatos(`/pedidos/${id}`);
}

function mostrarMensaje(texto, tipo = "ok") {
  mensaje.textContent = texto;
  mensaje.className = tipo;
}

function limpiarMensaje() {
  mensaje.textContent = "";
  mensaje.className = "";
}

function renderFormularioPedido() {
  platosParaPedido.innerHTML = "";

  platos.forEach((plato) => {
    platosParaPedido.innerHTML += `
      <label>
        ${plato.nombre} ($${plato.precio})
        <input type="number" min="0" value="0" id="pedido-plato-${plato.id}">
      </label><br>
    `;
  });
}

function renderPedidos() {
  listaPedidos.innerHTML = "";

  pedidos.forEach((pedido) => {
    // TODO: usar pedido.itemsDetalle para construir el detalle visual
    // Cada item debe mostrar:
    // nombre del plato, cantidad y subtotal

    const detalle = ""; // TODO: reemplazar por el HTML de los items

    listaPedidos.innerHTML += `
      <div class="card">
        <strong>Pedido #${pedido.id}</strong><br>
        Fecha: ${pedido.fecha}<br>

        Items:
        <ul>
          ${detalle}
        </ul>

        Total: $//TODO: mostrar total

        <button type="button" class="eliminar-pedido" data-id="${pedido.id}">
          Eliminar historial
        </button>
      </div>
    `;
  });

  document.querySelectorAll(".eliminar-pedido").forEach((button) => {
    button.addEventListener("click", async () => {
      await eliminarPedidoUI(Number(button.dataset.id));
    });
  });
}

function obtenerItemsPedido() {
  return platos
    .map((plato) => ({
      platoId: plato.id,
      cantidad: Number(document.getElementById(`pedido-plato-${plato.id}`).value)
    }))
    .filter((item) => item.cantidad > 0);
}

async function eliminarPedidoUI(id) {
  limpiarMensaje();

  try {
    await eliminarPedido(id);
    mostrarMensaje("Pedido eliminado del historial", "ok");
    await cargarDatos();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

async function cargarDatos() {
  try {
    platos = await obtenerPlatos();
    pedidos = await obtenerPedidos();
    renderFormularioPedido();
    renderPedidos();
  } catch (error) {
    platosParaPedido.innerHTML = "";
    listaPedidos.innerHTML = "";
    mostrarMensaje(error.message, "error");
  }
}

crearPedidoBtn.addEventListener("click", async () => {
  limpiarMensaje();

  const items = obtenerItemsPedido();

  if (items.length === 0) {
    mostrarMensaje("Debe seleccionar al menos un plato", "error");
    return;
  }

  try {
    const response = await crearPedido({ items });
    mostrarMensaje(response.mensaje, "ok");
    await cargarDatos();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
});

cargarDatos();
