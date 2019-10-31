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

exports.getTopFive = async (req, res, next) => {
  let topFive = await rankModel.getTopFive();
  console.log("topFive => " + JSON.stringify(topFive));

  const { name, score } = req.query;
  let all = await rankModel.getRank(name);

  let rank = 0;
  all.forEach((value, index) => {
    if (value.name == name) {
      rank = index;
    }
  });
  let self = { rank, name, score };

  res.render("ranks", {
    self: self,
    ranks: topFive,
    ranksCSS: true
  });
};
