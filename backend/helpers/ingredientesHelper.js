const store = require("../data/store");

function buscarIngrediente(id) {
  return store.ingredientes.find((ingrediente) => ingrediente.id === Number(id));
}

module.exports = {
  buscarIngrediente
};
