const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Owe = require('../../models/Owe');

router.get('/', (req, res) => {
    Owe.find()
        .sort({ date: 1 })
        .then(owe => res.json(owe));
});
//owe add
router.post('/', auth, (req, res) => {
    const { favor, debtor, creditor, proof, checked } = req.body;
    const newOwe = new Owe({
        favor: req.body.favor,
        debtor: req.body.debtor,
        creditor: req.body.creditor,
        proof: req.body.proof
    });
    //check whether has a proof
    if (!favor || !debtor || !creditor) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    if (!checked && !proof) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    newOwe.save().then(owe => res.json(owe));
});
//owe delete
router.delete('/:id', auth, (req, res) => {
    Owe.findById(req.params.id)
        .then(owe => owe.remove().then(() => res.json({ msg: true })))
        .catch(err => res.status(404).json({ msg: 'It had be deleted!' }));
});

module.exports = router;