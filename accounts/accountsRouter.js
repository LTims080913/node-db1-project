const express = require('express');

// database access using knex
const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
    db.select('*')
    .from('accounts')
    .then(account => {
        res.status(200).json({data: account})
    })
    .catch(error => {
        res.status(500).json({message: error.message})
    })
});

router.get('/:id', (req, res) => {
db('accounts')
.where({id: req.params.id})
.first()
.then(account => {
    if(account) {
        res.status(200).json({data: account})
    } else {
        res.status(404).json({message: 'No accounts with that ID'})
    }
})
.catch(error => {
    res.status(500).json({message: error.message})
})
});

router.post('/', (req, res) => {
    const account = req.body

    if(isValidAccount(account)) {
        db('accounts')
        .insert(account, 'id')
        .then(ids => {
            if(account) {
                res.status(200).json({data: ids})
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({message: error.message})
        })
    } else {
        res.status(400).json({message: 'Please provide name and budget for the account'})    }
})

router.put('/:id', (req, res) => {
    const changes = req.body
    db('accounts')
    .where({id: req.params.id})
    .update(changes)
    .then(count => {
        if(count) {
            res.status(200).json({data: count})
        } else {
            res.status(404).json({message: 'Account not found by that ID'})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message: error.message})
    })
})

router.delete('/:id', (req,res) => {
    db('accounts')
    .where({id: req.params.id})
    .del()
    .then(count => {
        if(count > 0) {
            res.status(200).json({data: count})
        } else {
            res.status(404).json({message: 'Account not found by that ID'})
        }
    })
    .catch(error => {
        res.status(500).json({message: error.message})
    })
})


function isValidAccount(account) {
    return Boolean(account.name && account.budget)
}
module.exports = router