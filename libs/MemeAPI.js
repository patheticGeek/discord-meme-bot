const { default: axios } = require("axios");
const writeFile = require("../utils/writeFile");
const readFile = require("../utils/readFile");

const cacheTime = 30 * 60 * 1000;

class MemeAPI {
  static async getMemes() {
    const cache = await readFile("./cache/getMemes.json");
    if (cache.timestamp && cache.timestamp >= Date.now() - cacheTime) return parsedCache.data;

    console.log("getting data from server");
    const res = await axios.get("https://api.imgflip.com/get_memes");
    if (res.status !== 200) {
      throw new Error("Imgflip api cannot be reached");
    } else if (res.data.success) {
      await writeFile("./cache/getMemes.json", JSON.stringify({ time: Date.now(), data: res.data.data.memes }));
      return res.data.data.memes;
    } else {
      throw new Error(res.data.error_message || "An unknown error occured");
    }
  }

  static async makeMeme(template_id, texts) {
    if (!process.env.IMGFLIP_USERNAME || !process.env.IMGFLIP_PASSWORD) {
      console.log("Please add env IMGFLIP_USERNAME and IMGFLIP_PASSWORD");
      throw new Error("Please add env IMGFLIP_USERNAME and IMGFLIP_PASSWORD to create memes");
    }

    const query = new URLSearchParams({
      template_id,
      username: process.env.IMGFLIP_USERNAME,
      password: process.env.IMGFLIP_PASSWORD,
      text0: texts[0] || "",
      text1: texts[1] || "",
    });
    const res = await axios.post(`https://api.imgflip.com/caption_image?${query.toString()}`);
    if (res.status !== 200) {
      throw new Error("Imgflip api cannot be reached");
    } else if (res.data.success) {
      await writeFile("./cache/getMemes.json", JSON.stringify({ time: Date.now(), data: res.data.data.memes }));
      return res.data.data.url;
    } else {
      throw new Error(res.data.error_message || "An unknown error occured");
    }
  }
}

module.exports = MemeAPI;
