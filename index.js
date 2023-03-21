const path = require("path");
const app = require("express")();
const ytdl = require("ytdl-core");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index", { video: "" });
});

app.post("/show_availables", async (req, res) => {
  if (req.body.url == "") {
    res.send("You didn't entered anything...");
  } else {
    const fileName = await ytdl.getInfo(req.body.url).then((filename) => {
      return filename.videoDetails.title;
    });
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="jvxle.vercel.app - ${encodeURIComponent(
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
