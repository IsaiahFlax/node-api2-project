const express = require('express')

const Data = require('./db.js')

const router = express.Router()

router.get('/', (req, res)=> {
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

router.get('/:id', (req, res) => {
    Data.findById(req.params.id)
    .then(data =>{
        if (data) {
            res.status(200).json(data)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    }).catch(error => {
        res.status(500).json({
            message: "The post information could not be retrieved."
        })
    })
})

router.get('/:id/comments', (req, res) => {
    Data.findById(req.params.id)
    .then(data =>{
        if (data) {
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

router.post('/', (req, res)=> {
    Data.add(req.body)
    .then(data => {
        res.status(201).json(data)
    }).catch(error => {
        res.status(500).json({
            errorMessage: "Please provide title and contents for the post."
        })
    })
})

// router.post('/:id/comments', (req, res)=> {
//     Data.add(req.body)
//     .then(data => {
//         res.status(201).json(data)
//     }).catch(error => {
//         res.status(500).json({
//             error: "There was an error while saving the comment to the database"
//         })
//     })
// })

router.delete('/:id', (req, res) => {
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

router.put('/:id', (req, res) => {
    const changes = req.body;
    Data.update(req.params.id, changes)
        .then(data => {
            if (data && changes.title && changes.content) {
                res.status(200).json(data);
            } else if (!changes.title || !changes.content ) {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: "The post information could not be modified."
            })
        })
})

module.exports = router