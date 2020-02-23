const ejs = require("ejs");
const express = require('express');
const ytdl = require("ytdl-core");
const http = require("http");
const app = express();

let server = http.createServer(app);
server.listen(30, () => {
    console.log("Listening on PORT 30");
});

app.set('view engine', 'ejs');
app.use(express.static('bootstrap'));

app.get("/", async(req, res) => {
    res.render("input", {
        error: false
    });
});

app.get("/play", async(req, res) => {
    let url = req.query.url;
    if(!url) return res.render("input", {
        error: true
    });
    if(!url.includes("youtube.com") && !url.includes("youtu.be")) 
           return res.render("input", {
        error: true
    });
    await ytdl.getInfo(url, (err, pog) => {
        if(err) {
            return res.render("output", {
                error: true
            });
        } else {
            res.render("output", {
                title: pog.title,
                thumbnail: `https://i.ytimg.com/vi/${pog.video_id}/maxresdefault.jpg`,
                play: pog.formats[0].url,
                loop: req.query.loop ? req.query.loop : "false",
                data: pog
            });
        }
    })
});
