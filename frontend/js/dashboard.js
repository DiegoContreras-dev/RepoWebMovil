import { obtenerDatos } from "./api.js";

const contenedor = document.getElementById("dashboard");
const error = document.getElementById("dashboardError");

/**
 * Convierte un objeto con claves y valores en una lista HTML. Si el objeto está vacío, muestra un mensaje indicando que no hay datos.
 * @param {*} objeto 
 * @returns Una cadena HTML representando una lista de los pares clave-valor del objeto, o un mensaje si el objeto está vacío.
 */
function objetoALista(objeto) {
  const claves = Object.keys(objeto || {});

  if (claves.length === 0) {
    return "<p>Sin datos</p>";
  }

  return `<ul>${claves.map((clave) => `<li>${clave}: ${objeto[clave]}</li>`).join("")}</ul>`;
}

async function cargarDashboard() {
  error.textContent = "";

  try {
    const data = await obtenerDatos("/dashboard");

    contenedor.innerHTML = `
      <div class="card">
        <h3>Pedidos realizados</h3>
        <!--TODO: mostrar cantidad de pedidos -->
      </div>

      <div class="card">
        <h3>Platos realizados</h3>
        ${objetoALista(data.platosRealizados)}
      </div>

      <div class="card">
        <h3>Ingredientes consumidos (FALTA)</h3>
        <!--TODO: mostrar ingredientes consumidos usando la función objetoALista() -->
      </div>
    `;
  } catch (errorActual) {
    contenedor.innerHTML = "";
    error.textContent = errorActual.message;
  }
}

cargarDashboard();
