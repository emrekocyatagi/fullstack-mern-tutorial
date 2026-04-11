import Note from "../models/Note.js";


export async function getAllNotes(req,res){
try {
    const notes = await Note.find().sort({createdAt: -1}); // -1 newest first
    res.status(200).json(notes);

}catch(error){
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({
        message: "Error fetching notes",
        error: error.message
    });
}
}

export async function getNotesById(req,res){
    try{
        const note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).json({
                message: "Note not found"
            });
        }
        res.status(200).json(note);
    }catch(error){
        console.error("Error in getNotesById controller", error);
        res.status(500).json({
            message: "Error fetching note",
            error: error.message
        });
    }
}

export async function createNotes (req,res){
try {
    const{title, content} = req.body;
    const newNote = new Note({title, content});
    await newNote.save();
    res.status(201).json({
        message:"Note created succesfully",
        note: newNote
    });
}catch(error){
    console.error("Error in createNotes controller", error);
    res.status(500).json({
        message: "Error creating note",
        error: error.message
    });
}
}

export async function updateNote (req,res) {
  try {
    const {title,content}=req.body;
    const updatedNote = await Note.findByIdAndUpdate(
        req.params.id,
         {title, content}, 
         {new: true}
    );

    if(!updatedNote){
        return res.status(404).json({
            message: "Note not found"
        });
    }
    res.status(200).json({
        message: "Note updated successfully",
        Note: updatedNote
    });
  }catch(error){
    console.error("Error in updateNote controller", error);
    res.status(500).json({
        message: "Error updating note",
        error: error.message
    });
  } 
}

export async function deleteNote (req,res) {
    try{
        const deleteNode = await Note.findByIdAndDelete(req.params.id);
        if(!deleteNode){
            return res.status(404).json({
                message: "Note not found"
            });
        }
        res.status(200).json({
            message: "Note deleted successfully",
        });
    }
    catch(error){
        console.error("Error in deleteNote controller", error);
        res.status(500).json({
            message: "Error deleting note",
            error: error.message
        });
    }
}