const URL_BASE = "http://localhost:3001";

export async function obtenerDatos(ruta) {
  const respuesta = await fetch(`${URL_BASE}${ruta}`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los datos");
  }

  return respuesta.json();
}

export async function enviarDatos(ruta, metodo, datos) {
  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || "No se pudo procesar la solicitud");
  }

  return resultado;
}

export async function eliminarDatos(ruta) {
  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    method: "DELETE"
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || "No se pudo eliminar el registro");
  }

  return resultado;
}
