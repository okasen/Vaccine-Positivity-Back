const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/vaccine-positive", {useNewUrlParser: true, useUnifiedTopology: true})

var bodyParser = require('body-parser')
app.use(bodyParser.json())

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("connection created!")
})
var cors = require('cors')
const port = 3000

var experienceSchema = new mongoose.Schema({
  name: String,
  experience: String,
  location: String
});

const experience = mongoose.model('submissions', experienceSchema)

var corsOptions = {
  origin: 'http://localhost:*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors())


app.get('/approved', function(req, res) {
  const experience = mongoose.model('submissions', experienceSchema)

  experience.find(function(err, data){
    if (err) console.log(err);
    else {
      console.log(data);
      res.send(data);
    }
  });
});

app.post('/submissions', (req, res) => {
  var subData = new experience(req.body)
  const result = subData.save()
    .then(item => {
      res.send(result)
    })
    .catch(err => {
      res.status(400).send("oh, that failed...")
    })
})

app.listen(port, () => {
  console.log(`Vaccine Positive listening at port ${port}`)
})

app.use(express.static('assets'))
