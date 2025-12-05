const notes = require("../data/notes-data");


function list(req,res){
  res.json({ data: notes });
}

function read(req,res){
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  res.json({ data: foundNote });
}

function noteExists(req, res, next) {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  if (foundNote) {
    return next();
  } else {
    return next({
      status: 404,
      message: `Note id not found: ${req.params.noteId}`,
    });
  }
};

function update(req,res){
  const {noteId} = req.params;
  const foundNote = notes.find((note) => note.id === Number(noteId));
  const { data: { text } = {} } = req.body;
  console.log(noteId);

  const newNote = {
    id: notes.length + 1, // Assign the next ID
    text,
  };
  notes.push(newNote);
  res.status(200).json({ data: newNote });
}

function destroy(req,res){
  const {noteId} = req.params;
  const index = notes.findIndex((note) => note.id === Number(noteId));
  const deleteNote = notes.splice(index, 1);
  res.sendStatus(204);
}

function create(req,res){
  const { data: { text } = {} } = req.body;
  const newNote = {
    id: notes.length + 1, // Assign the next ID
    text,
  };
  notes.push(newNote);
  res.status(201).json({ data: newNote });
}

function hasText(req, res, next){
  const { data: { text } = {} } = req.body;
  if (text) {
    return next();
  }
  return next({ status: 400, message: "A 'text' property is required." });
};

function bodyDataHas(propertyName){
  return function(req,res,next){
    const {data = {}} = req.body;
    if (data[propertyName]){
      return next();
    }else{
      return next({status: 400, message: `Must include a ${propertyName}`});}
};
}

module.exports = {
  create: [
    bodyDataHas("text"),
    create
  ],
  list,
  read: [noteExists,
        read],
  update: [
    noteExists,
    bodyDataHas("id"),
    bodyDataHas("text"),
  ],
  delete: [
    noteExists,
    destroy
  ],
};

