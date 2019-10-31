let express = require("express");
let bodyParser = require("body-parser");
let path = require("path");

const expressHbs = require("express-handlebars");

let app = express();
const port = process.env.PORT || 3000;

// view engine configuration
app.engine(
  "hbs",
  expressHbs({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
    helpers: {
      inc: function(value) {
        return parseInt(value) + 1;
      }
    }
  })
);

app.set("view engine", "hbs");

// express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
const summaryRoutes = require("./routes/summary");
app.use(summaryRoutes);

// static file
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("game", { gameCSS: true });
});

app.listen(port, () => console.log("Server is listening on port: " + port));
