globalThis.express = require("express");
var app = express();
const minifyhtml = require("html-minifier").minify;
var Purgecss = require("purgecss").PurgeCSS;

var fs = require("fs");
var css = fs.readFileSync(
  `${__dirname.replace("/server", "")}/public/css/style.css`,
  { encoding: "utf8", flag: "r" }
);

//lemme hack renderer!
express.response.render = function render(view, options, callback) {
  var tapp = this.req.app;
  var done = callback;
  var opts = options || {};
  var req = this.req;
  var self = this;

  // support callback function as second arg
  if (typeof options === "function") {
    done = options;
    opts = {};
  }

  // merge res.locals
  opts._locals = self.locals;

  // default callback to respond
  done =
    done ||
    async function (err, str) {
      if (err) return req.next(err);
      var htmlrendered = minifyhtml(str, {
        caseSensitive: true,
        continueOnParseError: true,
        keepClosingSlash: true,
        minifyCSS: true,
        minifyJS: true,
        collapseWhiteSpace: true,
      });
      var pp = await new Purgecss().purge({css:[{raw:css}],content:[{raw:htmlrendered}]});
        htmlrendered = htmlrendered.replace(
          `<style id="tailwind"></style>`,
          `<style id="tailwind">${pp[0].css}</style>`
        );
        self.send(htmlrendered);
      
    };

  // render
  tapp.render(view, opts, done);
};

app.set("view engine", "ejs");
app.set("views", path.resolve("src/views"));

app.use("/assets", express.static(path.resolve("src/public")));

app.use("*", require("./mw/cache.js"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

module.exports = app;
