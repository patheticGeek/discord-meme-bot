const fs = require("fs");

function writeFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => (err ? reject(err) : resolve()));
  });
}

module.exports = writeFile;
