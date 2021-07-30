require("module-alias/register");
globalThis.rovel = require("rovel.js");
globalThis.path = require("path");
console.log(rovel.text.green("[INFO]") + "Starting devproject!");
const v = process.version.slice(1, 3);
if (v < 16 && process.platform != "android") {
  console.error("[ERROR] Node.js v16 or above is required.");
  process.exit(1);
}
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr) {
    // If a regex pattern
    if (
      Object.prototype.toString.call(str).toLowerCase() === "[object regexp]"
    ) {
      return this.replace(str, newStr);
    }
    // If a string
    return this.replace(new RegExp(str, "g"), newStr);
  };
}
rovel.env.config();

if (!process.env.DOMAIN) {
  console.error("[ERROR] No Domain Given!");
  process.exit(0);
}
if (process.env.DOMAIN.endsWith("/")) {
  process.env.DOMAIN = process.env.DOMAIN.slice(0, -1);
}

const mongoose = require("mongoose");
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
globalThis.shell = require("shelljs");

globalThis.db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("[DB] We're connected to database!");
  //require("./cache.js");
  //gonna work on it afterwards
});
if (process.env.SENTRY) {
  const Sentry = require("@sentry/node");
  const Tracing = require("@sentry/tracing");
  Sentry.init({
    dsn: process.env.SENTRY,
    tracesSampleRate: 1.0,
  });
  console.log(
    "[SENTRY] Initialized!\nAll issues and performance are being sent!"
  );
  process.on("unhandledRejection", (error) => {
    console.warn("An Error Occurred!\n" + error);
  });
} else console.log(rovel.text.yellow("[WARN]") + "Sentry is not being set up.");

var app = require("@server/app.js");
var port = process.env.PORT || 3000;
globalThis.server = app.listen(port, () => {
  console.log(`[SERVER] Started on port: ${port}`);
});

process.on("SIGINT", () => {
  console.log("SIGINT Recieved!");
  console.log("Closing http server.");
  server.close(() => {
    console.log("Http server closed.");
    // boolean means [force], see in mongoose doc
    db.close(false, () => {
      console.log("MongoDb connection closed.");
      process.exit(0);
    });
  }, 3000);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM Recieved!");
  console.log("Closing http server.");
  server.close(() => {
    console.log("Http server closed.");
    // boolean means [force], see in mongoose doc
    db.close(false, () => {
      console.log("MongoDb connection closed.");
      process.exit(0);
    });
  }, 3000);
});
