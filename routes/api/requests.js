const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Request = require('../../models/Request');

router.get('/', (req, res) => {
    Request.find()
        .sort({ date: 1 })
        .then(request => res.json(request));
});
router.get('/:id', auth, (req, res) => {
    Request.findById(req.params.id)
        .then(request => res.json(request))
        .catch(err => res.status(404).json({ msg: 'It had be deleted!' }));
});

router.post('/', auth, (req, res) => {
    const { favor, debtor, creditor, proof, description } = req.body;
    const newRequest = new Request({
        favor: req.body.favor,
        debtor: req.body.debtor,
        creditor: req.body.creditor,
        proof: req.body.proof,
        description: req.body.description
    });
    newRequest.save().then(request => res.json(request));
});

router.delete('/:id', auth, (req, res) => {
    Request.findById(req.params.id)
        .then(request => request.remove().then(() => res.json({ msg: true })))
        .catch(err => res.status(404).json({ msg: false }));
});

router.put('/:id', auth, (req, res) => {
    Request.findByIdAndUpdate(req.params.id, req.body)
        .then(request => res.json(request))
        .catch(err => res.status(404).json({ msg: false }));
});


module.exports = router;