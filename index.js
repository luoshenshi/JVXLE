const path = require("path");
const app = require("express")();
const ytdl = require("ytdl-core");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/filter", async (req, res) => {
  if (req.body.url == "") {
    res.send("You didn't entered anything...");
  } else {
    const thumbnail = await ytdl.getInfo(req.body.url).then((info) => {
      const length_of_thumbnail = info.videoDetails.thumbnail.thumbnails.length;
      const fthumbnail =
        info.videoDetails.thumbnail.thumbnails[length_of_thumbnail - 1].url;
      const titleofvideo = info.videoDetails.title;
      res.render("download", {
        thumbnail: fthumbnail,
        title: titleofvideo,
        url: req.body.url,
      });
    });
  }
});

app.post("/download", async (req, res) => {
  if (req.body.url == "") {
    res.send("You didn't entered anything...");
  } else {
    const fileName = await ytdl.getInfo(req.body.url).then((filename) => {
      return filename.videoDetails.title;
    });
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="jvxle.onrender.com - ${encodeURIComponent(
        fileName
      )}.mp4"`
    );
    const stream = ytdl(req.body.url, {
      filter: (format) => {
        return (
          format.codecs.includes("avc1.42001E") &&
          format.codecs.includes("mp4a.40.2")
        );
      },
    });
    stream.pipe(res);
  }
});

app.listen(3000);
