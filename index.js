const express = require("express");
const api = require("./config/prisma");
const fs = require("fs");
const app = express();


const cors = require("cors");
app.use(cors());

const port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("index file is started");
});

app.get("/news", (req, res) => {
  const data = fs.readFileSync("./news/news-data.json", "utf-8");
  const news = JSON.parse(data);
  res.json(news);
});

app.post("/news", (req, res) => {
  const { title, img } = req.body;

  const data = fs.readFileSync("./news/news-data.json", "utf-8");
  const news = JSON.parse(data);

  const newNews = {
    id: news.length + 1,
    title,
    img,
    content: "No Content",
    author: "Admin",
    category: "General",
    publishedAt: new Date().toISOString().split("T")[0],
    source: "Dashboard",
    label: "FAKE",
  };

  news.push(newNews);

  fs.writeFileSync("./news/news-data.json", JSON.stringify(news, null, 2));

  res.status(201).json(newNews);
});



app.get("/news/search", (req, res) => {
  const search = req.query.search;

  if (!search) {
    return res.status(400).json({
      message: "Category is required",
    });
  }

  const data = fs.readFileSync("./news/news-data.json", "utf-8");
  const news = JSON.parse(data);

  const result = news.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  res.json(result);
});


app.get("/news/:id", (req, res) => {
  const id = Number(req.params.id);

  const data = fs.readFileSync("./news/news-data.json", "utf-8");
  const news = JSON.parse(data);

  const singleNews = news.find((item) => item.id === id);

  if (!singleNews) {
    return res.status(404).json({
      message: "News not found",
    });
  }
  res.json(singleNews);
});
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
;