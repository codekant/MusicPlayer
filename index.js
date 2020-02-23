const ejs = require("ejs");
const express = require("express");
const ytdl = require("ytdl-core");
const http = require("http");
const app = express();

let server = http.createServer(app);
server.listen(3000, () => {
  console.log("Listening on PORT 3000");
});

app.set("view engine", "ejs");
app.use(express.static("bootstrap"));

app.get("/", async (req, res) => {
  res.render("input", {
    error: false,
    bitError: false
  });
});

app.get("/play", async (req, res) => {
  let url = req.query.url;
  if (!url)
    return res.render("input", {
      error: true,
      bitError: false
    });
  if (!url.includes("youtube.com") && !url.includes("youtu.be"))
    return res.render("input", {
      error: true
    });
  await ytdl.getInfo(url, (err, pog) => {
    if (err) {
      return res.render("output", {
        error: true,
        bitError: false
      });
    } else {
      let song = pog.formats.find(o => 500000 > o.bitrate);
      if (!song) {
        return res.render("input", {
          bitError: true,
          error: false
        });
      }
      res.render("output", {
        title: pog.title,
        thumbnail: `https://i.ytimg.com/vi/${pog.video_id}/maxresdefault.jpg`,
        play: song.url,
        loop: req.query.loop ? req.query.loop : "false",
        data: pog
      });
    }
  });
});
