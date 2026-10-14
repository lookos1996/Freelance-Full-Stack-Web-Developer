const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 1. Σύνδεση & Δημιουργία τοπικής βάσης SQLite (database.db)
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Σφάλμα κατά τη δημιουργία της βάσης:', err.message);
    } else {
        console.log('✅ Συνδέθηκε επιτυχώς στην τοπική βάση SQLite!');
        
        // Δημιουργούμε τον πίνακα των πελατών με ΟΛΑ τα νέα πεδία (Διεύθυνση, Τιμή, Ημέρες)
        db.run(`CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ownerName TEXT NOT NULL,
            petType TEXT NOT NULL,
            petName TEXT NOT NULL,
            phone TEXT NOT NULL,
            address TEXT NOT NULL,
            boxContent TEXT NOT NULL,
            boxPrice TEXT NOT NULL,
            deliveryInterval INTEGER NOT NULL,
            deliveryDate TEXT NOT NULL
        )`);
    }
});

// --- API ROUTES ---

// 2. Προσθήκη νέου πελάτη (POST)
app.post('/api/customers', (req, res) => {
    const { ownerName, petType, petName, phone, address, boxContent, boxPrice, deliveryInterval, deliveryDate } = req.body;
    
    const sql = `INSERT INTO customers (ownerName, petType, petName, phone, address, boxContent, boxPrice, deliveryInterval, deliveryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [ownerName, petType, petName, phone, address, boxContent, boxPrice, deliveryInterval, deliveryDate], function(err) {
        if (err) {
            console.error('Σφάλμα αποθήκευσης:', err);
            res.status(400).json({ error: 'Πρόβλημα κατά την αποθήκευση' });
        } else {
            res.status(201).json({ message: 'Ο πελάτης καταχωρήθηκε επιτυχώς!' });
        }
    });
});

// 3. Λήψη όλων των πελατών για τον πίνακα (GET)
app.get('/api/customers', (req, res) => {
    const sql = `SELECT * FROM customers`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Σφάλμα λήψης:', err);
            res.status(500).json({ error: 'Πρόβλημα κατά τη λήψη των δεδομένων' });
        } else {
            res.json(rows);
        }
    });
});

// 4. Επεξεργασία (Ανανέωση) Πελάτη (PUT)
app.put('/api/customers/:id', (req, res) => {
    const { ownerName, petType, petName, phone, address, boxContent, boxPrice, deliveryInterval, deliveryDate } = req.body;
    const sql = `UPDATE customers SET ownerName = ?, petType = ?, petName = ?, phone = ?, address = ?, boxContent = ?, boxPrice = ?, deliveryInterval = ?, deliveryDate = ? WHERE id = ?`;
    
    db.run(sql, [ownerName, petType, petName, phone, address, boxContent, boxPrice, deliveryInterval, deliveryDate, req.params.id], function(err) {
        if (err) {
            console.error('Σφάλμα ενημέρωσης:', err);
            res.status(400).json({ error: 'Πρόβλημα κατά την ενημέρωση' });
        } else {
            res.json({ message: 'Ενημερώθηκε επιτυχώς!' });
        }
    });
});

// 5. Διαγραφή Πελάτη (DELETE)
app.delete('/api/customers/:id', (req, res) => {
    const sql = `DELETE FROM customers WHERE id = ?`;
    
    db.run(sql, req.params.id, function(err) {
        if (err) {
            console.error('Σφάλμα διαγραφής:', err);
            res.status(400).json({ error: 'Πρόβλημα κατά τη διαγραφή' });
        } else {
            res.json({ message: 'Διαγράφηκε επιτυχώς!' });
        }
    });
});

// Εκκίνηση Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Ο Server τρέχει στο http://localhost:${PORT}`);
});