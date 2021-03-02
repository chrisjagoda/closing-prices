import App from "./app";

/**
 * Start express server.
 */
const server = new App();
server.app.listen(server.app.get("port"), async () => {
  console.log(
    "Server is running at http://localhost:%d in %s mode",
    server.app.get("port"),
    server.app.get("env")
  );
  console.log("Press CTRL-C to stop\n");
});
