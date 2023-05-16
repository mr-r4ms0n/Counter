//Codigo para enlazar la base de datos con el servidor

const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const dbConfig = {
    user: 'r4ms0n',
    password: 'sowlock2612AB',
    server: 'r4m-server.database.windows.net',
    database: 'r4ms0n-db',
    options: {
        encrypt: true
    }
  };

  app.post('/incrementarContador', (req, res) => {
    const pagina = req.body.pagina;
    sql.connect(dbConfig).then((pool) => {
      return pool.request().query(`UPDATE ContadorPaginas SET counter_visit_number = counter_visit_number + 1 WHERE counter_page_url = '${pagina}'`);
    }).then((result) => {
      res.send('Contador incrementado');
    }).catch((error) => {
      console.log('Error al incrementar el contador: ', error);
      res.status(500).send('Error al incrementar el contador');
    }).finally(() => {
      sql.close();
    });
  });

  app.get('/obtenerContador', (req, res) => {
    const pagina = req.query.pagina;
    sql.connect(dbConfig).then((pool) => {
      return pool.request().query(`SELECT counter_visit_number FROM ContadorPaginas WHERE counter_page_url = '${pagina}'`);
    }).then((result) => {
      const contador = result.recordset[0].counter_visit_number;
      res.send(contador.toString());
    }).catch((error) => {
      console.log('Error al obtener el contador: ', error);
      res.status(500).send('Error al obtener el contador');
    }).finally(() => {
      sql.close();
    });
  });

  app.use(express.static('public'));

  app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
  });
