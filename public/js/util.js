/**
 * get an array of random numbers in [min, max) with length count
 * @param {Number} min min value
 * @param {Number} max max value
 * @param {Number} count number of random numbers needed
 */
export const getRndIntegers = (min, max, count) => {
  let results = [];
  while (results.length < count) {
    let rnd = Math.floor(Math.random() * (max - min) + min);
    if (results.indexOf(rnd) == -1) {
      results.push(rnd);
    }
  }
  return results;
};
