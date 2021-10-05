const express = require('express');
const app = express();
const path = require('path');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

const PORT = process.env.PORT || 3000;
const serverIP = process.env.SERVER || 'localhost'
// const DBPort = process.env.DBPORT || 1401;
const DBPort = process.env.DBPORT || 1401;
const DBUserName = process.env.USERNAME || "SA";
const DBPassword = process.env.PASSWORD || "test123AA";
const DBName = process.env.DBNAME || "RECLAMATION";


var config = {
    server: serverIP, // or "localhost"
    options: {
        port: DBPort,
        database: DBName,
        // useColumnNames: true,
    },
    authentication: {
        type: "default",
        options: {
            userName: DBUserName,
            password: DBPassword,
        }
    }
};

const connection = new Connection(config);
connection.on('connect', (err) => {
    if (err) {
        console.log('Error: ', err)
    }
    // If no error, then good to proceed.
    console.log("Connected");
});

connection.connect();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));
app.use('/bootstrap/dist/css', express.static(path.join(__dirname, './node_modules/bootstrap/dist/css')));
app.use('/bootstrap/dist/js', express.static(path.join(__dirname, './node_modules/bootstrap/dist/js')));
app.use('/cropperjs', express.static(path.join(__dirname, './node_modules/cropperjs/dist')));

app.get('/', (req, res) => {
    res.redirect('/index/html');
});

app.post('/api', (req, res) => {
    const cin = req.body.cin;
    let notFound = true;

    const request = new Request(`
    SELECT TOP (10) [Id]
        ,[Nom]
        ,[Prenom]
        ,[NumeroCIN]
        ,[NumeroCarteSejour]
        ,[FileCinId]
        ,[FileCsId]
        ,[Fonction]
        ,[NumeroGSM]
        ,[AdresseMail]
        ,[Ville]
        ,[AdressePostal]
        ,[NumeroPermis]
        ,[FilePermisId]
        ,[CodePostal]
        ,[PP_SGI_id]
        ,[PP_SGI_Type_id]
        ,[CreatedDate]
        ,[CreatedBy]
        ,[UpdatedDate]
        ,[UpdatedBy]
        ,[NomAr]
        ,[PrenomAr]
        ,[VilleAr]
        ,[AdresseAr]
    FROM [RECLAMATION].[dbo].[PersonnePhysique]
    WHERE [NumeroCIN] = '${cin}';`, function (err, rowCount) {
        if (err) {
            console.log(err);
        }
        else {
            if (rowCount == 0) {
                res.send({
                    "error": "No results found"
                });
            }
            else {
                notFound = false;
            }
        }
    });

    const obj = {};

    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.metadata.colName == "Nom") {
                obj.nom = column.value;
            }
            if (column.metadata.colName == "Prenom") {
                obj.prenom = column.value;
            }
            if (column.metadata.colName == "NumeroCIN") {
                obj.numeroCIN = column.value;
            }
            if (column.metadata.colName == "Ville") {
                obj.ville = column.value;
            }
            if (column.metadata.colName == "NumeroPermis") {
                obj.numeroPermis = column.value;
            }
        });
    });

    request.on('requestCompleted', function () {
        if (!notFound) {
            res.send({
                'result': obj,
            });
        }
    });

    request.on('error', function (err) {
        console.log(err);
    });

    connection.execSql(request);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});