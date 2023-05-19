const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

app.use(express.json());

// GET para obtener todas las canciones
app.get('/canciones', (req, res) => {
    const canciones = JSON.parse(fs.readFileSync('repertorio.json'));
    res.send(canciones);
});

// POST para agregar una canción
app.post('/canciones', (req, res) => {
    const cancion = req.body;
    const canciones = JSON.parse(fs.readFileSync('repertorio.json'));
    canciones.push(cancion);
    fs.writeFileSync('repertorio.json', JSON.stringify(canciones, null, 4));
    res.send('Canción agregada correctamente');
});

// DELETE para borrar una canción por su ID
app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const canciones = JSON.parse(fs.readFileSync('repertorio.json'));
    const index = canciones.findIndex(c => c.id == id);
    if (index !== -1) {
        canciones.splice(index, 1);
        fs.writeFileSync('repertorio.json', JSON.stringify(canciones, null, 4));
        res.send('Canción borrada correctamente');
    } else {
        res.status(404).json({ error: 'Canción no encontrada.' });
    }
});

// PUT para modificar una canción por su ID
app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const cancion = req.body;
    const canciones = JSON.parse(fs.readFileSync('repertorio.json'));
    const index = canciones.findIndex(c => c.id == id);
    if (index !== -1) {
        canciones[index] = cancion;
        fs.writeFileSync('repertorio.json', JSON.stringify(canciones, null, 4));
        res.send('Canción modificada con éxito');
    } else {
        res.status(404).json({ error: 'Canción no encontrada.' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
