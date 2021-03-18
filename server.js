const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');

app.get('/get-profile', (req, res) => {
  console.log('', 'REQWUESTED PROFILE');
  
  //console.log('', JSON.parse(fs.readFileSync('./out.json').toString()));

  res.send(JSON.parse(fs.readFileSync('./out.json').toString()))
})

app.get('/get-announcements', (req, res) => {
	console.log('', 'GOT get-announcements');

	console.log('', JSON.parse(fs.readFileSync('./announcements.json').toString()));

	res.send(JSON.parse(fs.readFileSync('./announcements.json')));
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})