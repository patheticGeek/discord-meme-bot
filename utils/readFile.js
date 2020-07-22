const fs = require("fs");

function readFile(path) {
  return new Promise((resolve, reject) => {
    try {
      const data = fs.readFileSync(path, { encoding: "utf8" });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = readFile;
