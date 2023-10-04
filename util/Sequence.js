const { Sequence } = require("../models/SequenceSchema");

const getLastSequenceToday = async () => {
  const d = new Date().toISOString().slice(0, 10);
  var date = d.replace(/-/g, "/");
  let result = await Sequence.findOne({
    date: { $gte: date, $lte: date },
  });

  if (result == null) {
    const sequence = new Sequence({
      sequence: 1,
      date: date,
    });
    await sequence.save();
    return 1;
  }

  let next = result.sequence + 1;
  await Sequence.findByIdAndUpdate(result.id, {
    date: date,
    sequence: next,
  });
  return next;
};

module.exports = { getLastSequenceToday };
