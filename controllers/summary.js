let rankModel = require("../models/rankModel");

exports.getSummary = (req, res, next) => {
  let score = req.query.score;
  res.render("summary", { score: score, summaryCSS: true });
};

exports.addNewScore = (req, res, next) => {
  const { score, name } = req.body;
  console.log("add..." + JSON.stringify(req.body));

  rankModel.addNew({ name, score });

  res.redirect(301, `/ranks?name=${name}&score=${score}`);
};

exports.getTopFive = (req, res, next) => {
  rankModel.getTopFive().then(docs => {
    console.log("docs " + JSON.stringify(docs));
    const { name, score } = req.query;
    // res.json({ query: req.query, data: docs });
    res.render("ranks", {
      self: { name, score },
      ranks: docs,
      ranksCSS: true
    });
  });
};
