const store = {
  ingredientes: [
    { id: 1, nombre: "Pan", stock: 20 },
    { id: 2, nombre: "Carne", stock: 10 },
    { id: 3, nombre: "Queso", stock: 15 },
    { id: 4, nombre: "Lechuga", stock: 12 }
  ],
  platos: [
    {
      id: 1,
      nombre: "Hamburguesa",
      precio: 5000,
      ingredientes: [
        { ingredienteId: 1, cantidad: 2 },
        { ingredienteId: 2, cantidad: 1 },
        { ingredienteId: 3, cantidad: 1 },
        { ingredienteId: 4, cantidad: 1 }
      ]
    },
    {
      id: 2,
      nombre: "Cheeseburger",
      precio: 4500,
      ingredientes: [
        { ingredienteId: 1, cantidad: 2 },
        { ingredienteId: 2, cantidad: 1 },
        { ingredienteId: 3, cantidad: 2 }
      ]
    }
  ],
  pedidos: [],
  nextIngredienteId: 5,
  nextPlatoId: 3,
  nextPedidoId: 1
};

module.exports = store;
