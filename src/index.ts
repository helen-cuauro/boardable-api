import { app } from "./app";

const port = 5000;

app.listen(port, () => {
  console.log("escuchando al port " + port);
});
