import { obtenerDatos, enviarDatos, eliminarDatos } from "./api.js";

let ingredientes = [];
let platos = [];

const form = document.getElementById("formPlato");
const lista = document.getElementById("listaPlatos");
const ingredientesParaPlato = document.getElementById("ingredientesParaPlato");
const mensaje = document.getElementById("mensajePlato");

function obtenerIngredientes() {
  return obtenerDatos("/ingredientes");
}

function obtenerPlatos() {
  return obtenerDatos("/platos");
}

function crearPlato(payload) {
  return enviarDatos("/platos", "POST", payload);
}

function actualizarPlato(id, payload) {
  return enviarDatos(`/platos/${id}`, "PUT", payload);
}

function eliminarPlato(id) {
  return eliminarDatos(`/platos/${id}`);
}

function mostrarMensaje(texto, tipo = "ok") {
  mensaje.textContent = texto;
  mensaje.className = tipo;
}

function limpiarMensaje() {
  mensaje.textContent = "";
  mensaje.className = "";
}

function renderFormularioIngredientes() {
  ingredientesParaPlato.innerHTML = "";

  ingredientes.forEach((ingrediente) => {
    ingredientesParaPlato.innerHTML += `
      <label>
        ${ingrediente.nombre}
        <input type="number" min="0" value="0" id="ing-plato-${ingrediente.id}">
      </label><br>
    `;
  });
}

function renderPlatos() {
  lista.innerHTML = "";

  platos.forEach((plato) => {
    const detalle = plato.ingredientesDetalle
      .map((ingrediente) => `${ingrediente.nombre}: ${ingrediente.cantidad}`)
      .join(", ");

    lista.innerHTML += `
      <div class="card">
        <strong>${plato.nombre}</strong><br>
        Precio: $${plato.precio}<br>
        Ingredientes: ${detalle}<br>
        <button type="button" class="editar-plato" data-id="${plato.id}">Editar</button>
        <button type="button" class="eliminar-plato" data-id="${plato.id}">Eliminar</button>
      </div>
    `;
  });

  document.querySelectorAll(".editar-plato").forEach((button) => {
    button.addEventListener("click", () => {
      editarPlato(Number(button.dataset.id));
    });
  });

  document.querySelectorAll(".eliminar-plato").forEach((button) => {
    button.addEventListener("click", async () => {
      await eliminarPlatoUI(Number(button.dataset.id));
    });
  });
}

function obtenerIngredientesSeleccionados() {
  return ingredientes
    .map((ingrediente) => ({
      ingredienteId: ingrediente.id,
      cantidad: Number(document.getElementById(`ing-plato-${ingrediente.id}`).value)
    }))
    .filter((ingrediente) => ingrediente.cantidad > 0);
}

function editarPlato(id) {
  const plato = platos.find((item) => item.id === id);

  if (!plato) {
    return;
  }

  document.getElementById("platoId").value = plato.id;
  document.getElementById("platoNombre").value = plato.nombre;
  document.getElementById("platoPrecio").value = plato.precio;

  ingredientes.forEach((ingrediente) => {
    const relacion = plato.ingredientes.find((item) => item.ingredienteId === ingrediente.id);
    document.getElementById(`ing-plato-${ingrediente.id}`).value = relacion ? relacion.cantidad : 0;
  });

  mostrarMensaje("Editando plato seleccionado", "ok");
}

async function eliminarPlatoUI(id) {
  limpiarMensaje();

  try {
    await eliminarPlato(id);
    mostrarMensaje("Plato eliminado correctamente", "ok");
    await cargarDatos();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

async function cargarDatos() {
  try {
    ingredientes = await obtenerIngredientes();
    platos = await obtenerPlatos();
    renderFormularioIngredientes();
    renderPlatos();
  } catch (error) {
    lista.innerHTML = "";
    ingredientesParaPlato.innerHTML = "";
    mostrarMensaje(error.message, "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  limpiarMensaje();

  const id = document.getElementById("platoId").value;
  const payload = {
    nombre: document.getElementById("platoNombre").value,
    precio: Number(document.getElementById("platoPrecio").value),
    ingredientes: obtenerIngredientesSeleccionados()
  };

  try {
    if (id) {
      await actualizarPlato(id, payload);
      mostrarMensaje("Plato actualizado correctamente", "ok");
    } else {
      await crearPlato(payload);
      mostrarMensaje("Plato creado correctamente", "ok");
    }

    form.reset();
    document.getElementById("platoId").value = "";
    await cargarDatos();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
});

cargarDatos();
