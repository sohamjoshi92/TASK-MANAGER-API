const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req,res) => {
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

//GET tasks?completed=true/false.
//add limit and scale for pagination.
//GET tasks?sortBy=createsAt_asc/desc
//Hence we add 4 options : completed, limit,skip and sort.
router.get('/tasks', auth, async (req,res) => {
        const match = {}
        const sort = {}
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }
        try {
            await req.user.populate({
                path : 'tasks',
                match,
                options : {
                    limit : parseInt(req.query.limit),
                    skip : parseInt(req.query.skip),
                    sort
                }
            }).execPopulate()
            res.send(req.user.tasks)
        }
        catch (e) {
            res.status(500).send()
        }
})

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id
    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id , owner : req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (e) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['description', 'completed']
    const isValid = updates.every((update) => allowed.includes(update))
    if(!isValid){
        res.status(400).send('Invalid update operation')
    }
    try {
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true })
        const task = await Task.findOne({ _id : req.params.id, owner : req.user._id })
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }
    catch (e) {
        res.status(400).send()
    }
})

router.delete('/tasks/:id', auth, async (req,res) => {
    try {
        const task = await Task.findOneAndDelete({ _id : req.params.id, owner : req.user._id })
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }
    catch(e) {
        res.status(500).send()
    }
})

module.exports = router