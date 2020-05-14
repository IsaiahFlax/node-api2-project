const express = require('express')

const Data = require('./db.js')

const router = express.Router()



router.post('/posts', (req, res)=> {
    try {
        if (req.body.title && req.body.contents) {
            res.status(201).json(req.body)
        } 
        else {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        }
    }    
    catch {
        res.status(500).json({
            message: "The post information could not be retrieved."
        })
    }
        
})

router.post("/posts/:id/comments", (req, res) => {
    let userData = req.body;
    userData.post_id = req.params.id;
    db.insertComment(userData)
      .then(item => {
        if (item) {
          res.status(201).json({
            userData
          });
        } else if (!userData.text) {
          res
            .status(400)
            .json({ errorMessage: "Please provide text for the comment." });
        } else {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the comment to the database"
        });
      });
  });

router.get('/posts', (req, res)=> {
    console.log(req.query)
    Data.find(req.query)
    .then(data => {
        res.status(200).json(data)
    }).catch(error => {
        res.status(500).json({
            error: "The posts information could not be retrieved."
        })
    })
})

router.get('/posts/:id/', (req, res)=> {
            Data.findById(req.params.id).then(data => {
                if (data.length == 0) {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
                else {
                    res.status(200).json(data)
                }

            }).catch(error => {
                res.status(500).json({
                    error: "The posts information could not be retrieved."
                })
            })
})
     

router.get('/posts/:id/comments', (req, res) => {
    Data.findPostComments(req.params.id)
    .then(data =>{
        if (data.length > 1) {
            res.status(200).json(data)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist."})
        }
    }).catch(error => {
        res.status(500).json({
            error: "The comments information could not be retrieved."
        })
    })
})


router.delete('/posts/:id', (req, res) => {
    Data.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            res.status(500).json({
                error: "The post could not be removed"
            })
        })
})

router.put("/posts/:id", (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Data.update(id, data)
      .then(item => {
        if (item && data.title && data.contents) {
          res.status(200).json({ item });
        } else if (!data.title || !data.contents) {
          res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
          });
        } else {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
        }
      })
      .catch(err =>
        res.status(500).json({ error: "The post could not be modified" })
      );
  });

module.exports = router