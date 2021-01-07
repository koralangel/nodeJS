const express = require('express');
const router = express.Router();

const fs = require('fs');

/* GET home page. */
router.post('/', (req, res, next) => {

  //fs.mkdirSync('/newdir');
  console.log(req)
  if(req.files){
    let myfile = req.files.f;
    // מעביר את הקובץ למיקום שניתן לו
    myfile.mv("public/images/users_imgs/"+myfile.name,(err) => {
      if(err) {
        return res.status(400).json({message:"error in file"})
      }
      else{
        res.json({status:"uploaded"})
      }
    })
  }
  else{
    return res.status(400).json({message:"please add file"})
  }
});

module.exports = router;