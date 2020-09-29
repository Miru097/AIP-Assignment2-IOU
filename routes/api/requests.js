const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Request = require('../../models/Request');

router.get('/', (req, res) => {
    Request.find()
        .sort({ date: -1 })
        .then(request => res.json(request));
});

router.post('/', (req, res) => {
    const { favor, debtor, creditor, proof, description } = req.body;
    const newRequest = new Request({
        favor: req.body.favor,
        debtor: req.body.debtor,
        creditor: req.body.creditor,
        proof: req.body.proof,
        description: req.body.description
    });

    // if (!favor || !debtor || !creditor) {
    //     return res.status(400).json({ msg: 'Please enter all fields' });
    // }
    // if (!checked && !proof) {
    //     return res.status(400).json({ msg: 'Please enter all fields' });
    // }
    newRequest.save().then(request => res.json(request));
});

router.delete('/:id', auth, (req, res) => {
    Request.findById(req.params.id)
        .then(request => request.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;