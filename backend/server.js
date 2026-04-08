import express from 'express';
const app = express();
//req = request, res = response
app.get("/api/notes",(req,res) =>{
    res.status(200).send("You got 5 notes");
});
app.
app.listen(5001, () => {
  console.log('Server is running on port 5001');
});