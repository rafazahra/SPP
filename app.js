const express = require('express');
const mysql = require('mysql');
const hbs = require('hbs');
const bodyParser = require('body-parser')

const app = express ();
const port = 4000;

//setting engine view bhs
app.set('view engine', 'hbs');

//setting parser data dari mysql ke appjs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const koneksi = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_pembayaransppku'
}); 

koneksi.connect((err) => {
    if(err) throw err;
    console.log('Koneksi Database Berhasil Disambung');
});


//login
app.get('/login', (req, res) => {
    koneksi.query('SELECT * FROM User', (err, hasil) => {
        if(err) throw err;
        res.render('login', {
            judulHalaman: 'Pembayaran SPP',
            data: hasil
        });
    });
});

app.post('/login', (req, res) => {
    var usernames = req.body.usernames;
    var passwords = req.body.passwords;
    koneksi.query("SELECT * FROM User WHERE usernames=? AND passwords=?", 
    [ usernames, passwords ], 
    (err, hasil) => {
        if(err) throw err;
        if(hasil > 0){
            res.redirect('/inputpembayaran');
        } else {
            res.redirect('/login');
        }
    });
});


//inputpembayaran
app.get('/inputpembayaran', (req, res) => {
    koneksi.query('SELECT * FROM Pembayaran', (err, hasil) => {
        if(err) throw err;
        res.render('inputpembayaran', {
            judulHalaman: 'Pembayaran SPP',
            data: hasil
        });
    });
});

app.post('/inputpembayaran', (req, res) => {
    var siswa = req.body.inputsiswa;
    var bulan = req.body.inputbulan;
    var jumlah = req.body.inputjumlah;
    var tanggaltransaksi = req.body.inputtanggaltransaksi
    koneksi.query('INSERT INTO Pembayaran(siswa, bulan, jumlah, tanggal_transaksi) VALUES(?, ?, ?, ?)',
    [ siswa, bulan, jumlah, tanggaltransaksi ],
    (err, hasil) => {
        if(err) throw err;
        res.redirect('/inputpembayaran');
    }
    )
});


//logout
app.get('/logout', (req, res) => {
    koneksi.query('SELECT * FROM login', (err, hasil) => {
        if(err) throw err;
        res.render('logout.hbs',{
            judulhalaman: 'ppob',
            data: hasil
        });
    });
});


app.listen(port, () => {
    console.log(`App berjalan pada port ${port}`);
});