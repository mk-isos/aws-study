require('dotenv').config()
const express = require('express')
const { Sequelize, DataTypes} = require('sequelize');
const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3')
const cors = require('cors');
const app = express()
const port = 80;
app.use(cors());


const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: "ap-northeast-2"
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  }),
})

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql'
  }
);

const Board = sequelize.define('boards', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING
  },
  content: {
    type: DataTypes.STRING
  },
  imageUrl: {
    type: DataTypes.STRING
  }
}, {
  timestamps: false
})

app.get('/health', (req, res) => {
  res.status(200).send("Success Health Check");
})

app.get('/boards', async (req, res) => {
  const boards = await Board.findAll();
  res.status(200).send(boards);
});

app.post('/boards', upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const imageFile = req.file;

  const board = await Board.create({
    title,
    content,
    imageUrl: imageFile.location
  });

  res.status(200).send(board);
})


app.listen(port, async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  console.log(`Example app listening on port ${port}`)
})
