const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    ownerName: { type: String, required: true },       // Στήλη Α: Όνομα Ιδιοκτήτη
    phone: { type: String, required: true },           // Στήλη Β: Κινητό
    petName: { type: String, required: true },         // Στήλη C: Όνομα Κατοικιδίου
    boxContent: { type: String, required: true },      // Στήλη D: Περιεχόμενο Box
    deliveryDate: { type: Date, required: true }       // Στήλη E: Ημερομηνία Παράδοσης
});

module.exports = mongoose.model('Customer', customerSchema);