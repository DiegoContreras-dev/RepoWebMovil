const express = require("express");
const cors = require("cors");

const ingredientesRoutes = require("./routes/ingredientesRoutes");
const platosRoutes = require("./routes/platosRoutes");
const pedidosRoutes = require("./routes/pedidosRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/ingredientes", ingredientesRoutes);
app.use("/platos", platosRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/dashboard", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
