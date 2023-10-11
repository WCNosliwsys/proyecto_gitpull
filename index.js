const express = require('express');
const { exec } = require('child_process');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 3000;

app.use(bodyParser.json());

app.get('/verificar', cors(), (req, res) => {
  // Lógica de verificación o respuesta
  res.status(200).send('Servidor en funcionamiento gracias a Karencita');
});

// Ruta para recibir notificaciones de GitHub y actualizar el proyecto principal
app.post('/webhook/proyecto_principal', (req, res) => {
  handleWebhook('proyecto_gitpull', req, res);
});

// Ruta para recibir notificaciones de GitHub y actualizar proyectos secundarios
app.post('/webhook/:project', (req, res) => {
  const { project } = req.params;
  handleWebhook(project, req, res);
});

function handleWebhook(project, req, res) {
  // Validación de seguridad (puedes agregar más medidas de seguridad aquí)
  if (!isAuthorized(req)) {
    return res.status(403).send('Acceso no autorizado.');
  }

  // Determinar la ruta correcta del proyecto (principal o secundario)
  const projectPath = project === 'proyecto_gitpull' ? __dirname : `${__dirname}/${project}`;

  // Ejecutar git pull en el proyecto específico
  exec(`git -C ${projectPath} pull`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar git pull en ${project}: ${error}`);
      return res.status(500).send('Error en la actualización.');
    }

    console.log(`Git pull exitoso en ${project}: ${stdout}`);
    res.status(200).send('Actualización exitosa.');
  }); // Cierre de la función exec
}

function isAuthorized(req) {
  // Implementa aquí tus medidas de seguridad, como la autenticación o la verificación de IP.
  // Devuelve true si la solicitud es autorizada, de lo contrario, devuelve false.
  return true;
}

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
