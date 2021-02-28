import App from "./app";
import { connect } from "./database/database";
import ApiController from "./controllers/api.controller";

/**
 * Connect to database and start express server.
 */
const server = new App(new ApiController());
server.app.listen(server.app.get("port"), async () => {
  try {
    await connect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(
    "Server is running at http://localhost:%d in %s mode",
    server.app.get("port"),
    server.app.get("env")
  );
  console.log("Press CTRL-C to stop\n");
});
