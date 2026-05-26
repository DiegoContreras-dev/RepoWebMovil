import { obtenerDatos, enviarDatos, eliminarDatos } from "./api.js";

let ingredientes = [];

const form = document.getElementById("formIngrediente");
const lista = document.getElementById("listaIngredientes");
const mensaje = document.getElementById("mensajeIngrediente");

function obtenerIngredientes() {
  return obtenerDatos("/ingredientes");
}

function crearIngrediente(payload) {
  return enviarDatos("/ingredientes", "POST", payload);
}

function actualizarIngrediente(id, payload) {
  return enviarDatos(`/ingredientes/${id}`, "PUT", payload);
}

function eliminarIngrediente(id) {
  return eliminarDatos(`/ingredientes/${id}`);
}

function mostrarMensaje(texto, tipo = "ok") {
  mensaje.textContent = texto;
  mensaje.className = tipo;
}

function limpiarMensaje() {
  mensaje.textContent = "";
  mensaje.className = "";
}

function renderIngredientes() {
  lista.innerHTML = "";

  ingredientes.forEach((ingrediente) => {
    lista.innerHTML += `
      <div class="card">
        <strong>${ingrediente.nombre}</strong><br>
        Stock: ${ingrediente.stock}<br>
        <button type="button" class="editar-ingrediente" data-id="${ingrediente.id}">Editar</button>
        <button type="button" class="eliminar-ingrediente" data-id="${ingrediente.id}">Eliminar</button>
      </div>
    `;
  });

  document.querySelectorAll(".editar-ingrediente").forEach((button) => {
    button.addEventListener("click", () => {
      editarIngrediente(Number(button.dataset.id));
    });
  });

  document.querySelectorAll(".eliminar-ingrediente").forEach((button) => {
    button.addEventListener("click", async () => {
      await eliminarIngredienteUI(Number(button.dataset.id));
    });
  });
}

function editarIngrediente(id) {
  const ingrediente = ingredientes.find((item) => item.id === id);

  if (!ingrediente) {
    return;
  }

  document.getElementById("ingredienteId").value = ingrediente.id;
  document.getElementById("ingredienteNombre").value = ingrediente.nombre;
  document.getElementById("ingredienteStock").value = ingrediente.stock;
  mostrarMensaje("Editando ingrediente seleccionado", "ok");
}

async function eliminarIngredienteUI(id) {
  limpiarMensaje();

  try {
    await eliminarIngrediente(id);
    mostrarMensaje("Ingrediente eliminado correctamente", "ok");
    await cargarIngredientes();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

async function cargarIngredientes() {
  try {
    ingredientes = await obtenerIngredientes();
    renderIngredientes();
  } catch (error) {
    lista.innerHTML = "";
    mostrarMensaje(error.message, "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  limpiarMensaje();

  const id = document.getElementById("ingredienteId").value;
  const nombre = document.getElementById("ingredienteNombre").value;
  const stock = document.getElementById("ingredienteStock").value;

  // TODO: validar nombre
  // TODO: validar stock numérico
  // TODO: validar stock >= 0

  // Si hay error → mostrarMensaje("...", "error") y hacer return;

  const payload = {
    nombre: nombre,
    stock: Number(stock)
  };

  try {
    if (id) { //Si hay id, se actualiza. Si no, se crea uno nuevo, use await
      //TODO: Actualizar
      mostrarMensaje("Ingrediente actualizado correctamente", "ok");
    } else {
      //TODO: Crear
      mostrarMensaje("Ingrediente creado correctamente", "ok");
    }

    //TODO: limpiar formulario, llamando al método reset() del objeto form o limpiando cada campo manualmente
    document.getElementById("ingredienteId").value = "";

    //TODO: recargar ingredientes
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
});

cargarIngredientes();
