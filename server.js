const express = require('express');
const PORT = process.env.PORT || 3001
const fs = require('fs')
const shortid = require('shortid')


const app = express();
//middleware which makes 'public' accessible to the client. 
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
 res.sendFile(`${__dirname}/public/index.html`)

})

app.delete('/api/notes/:id', (req,res) => {
const searchId = req.params.id
console.log(req.params.id)
const parsedSearch = req.body

const dataDB = JSON.parse(fs.readFileSync(`${__dirname}/db/db.json`))
let searchedItem

const searchResult = dataDB.filter((el) => {
  console.log(el.id)
  if(el.id !== searchId || el.id === undefined) 
    return el
})

// const result = dataDB.filter((el) => {
//   if(el.title !== parsedSearch.title)
//   return el
// })
const newDataDB = JSON.stringify(searchResult)
fs.writeFileSync(`${__dirname}/db/db.json`, newDataDB)



res.send(`requested item ${req.body.title} was deleted.`)



}
)
app.post('/api/notes', (req,res) => {
  const newNote = req.body
  if(req.body) {
    let newNote = req.body
    const fileData = JSON.parse(fs.readFileSync(`${__dirname}/db/db.json`))
    if(req.body.id === undefined) {
      newId = {"id" : `${shortid.generate()}`}
      newNotetoString = JSON.stringify(newNote) + "," + JSON.stringify(newId)
      newNotetoString = newNotetoString.replace(/\{|\}/g, '')
      newNotetoString = "{" + newNotetoString + "}"
      console.log(newNotetoString)
      // newNotetoString = newNotetoString.replace(/\'|\'/g, '')
  
      newNote = JSON.parse(newNotetoString)
    }
    let newArray = []
    fileData.forEach(el => newArray.push(el))
    newArray.push(newNote)
    
    const StringNewNoteData = JSON.stringify(newArray)
    
   fs.writeFile(`${__dirname}/db/db.json`, StringNewNoteData, (err) => {
  err ? console.log(err) : res.json({message: 'Your Note was saved Successfully!'})
    }) 
    console.log(newArray)
  }

  }
)

app.get('/api/notes', (req, res) => {
  res.sendFile(`${__dirname}/db/db.json`)

} )

app.get('/notes', (req,res) => {
  res.sendFile(`${__dirname}/public/notes.html`);
  console.log('file successfully loaded.')
})

app.listen(PORT, ()=> {
  console.log(`server listening on ${PORT}`)
})