const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Owe = require('../../models/Owe');

router.get('/', (req, res) => {
    Owe.find()
        .sort({ date: -1 })
        .then(owe => res.json(owe));
});

router.post('/', (req, res) => {
    const { favor, debtor, creditor } = req.body;

    const newOwe = new Owe({
        favor: req.body.favor,
        debtor: req.body.debtor,
        creditor: req.body.creditor,
        proof: req.body.proof
    });

    if (!favor || !debtor || !creditor) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    newOwe.save().then(owe => res.json(owe));



    {/*const newOwe = new Owe({
        name: req.body.name
    });
newOwe.save().then(owe => res.json(owe));*/}
});

router.delete('/:id', auth, (req, res) => {
    Owe.findById(req.params.id)
        .then(owe => owe.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;