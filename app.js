const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
//configuracion para el uso de peticiones post
app.use(bodyParser.urlencoded({extended:false}));

//plantillas que sean dinamicas
app.set('view engine','ejs');
app.set('views', './views');
app.use(express.static('public')); // importante para express para que pueda conectar con css
app.set('views', path.join(__dirname, 'views'));

const db = mysql.createConnection({
    host: 'localhost', // server
    user: 'root',// usuario de la DB
    password: '',//pass de tu BD
    database:'escuela',//nombre de la BD
    port:3306//puerto

});


db.connect(err=>{
    if(err){
    console.log(`error al conectar a la BD `);
    }else{
        console.log('la base de datos funciona y esta conectada')
    }
});

//iniciamos el server
const hostname = '0.0.0.0' // esta es para realizarlo por ip
const port =3009
app.listen(port,hostname,()=>{ // colocar hostname en lugar de port
    console.log(`servidor en funcionamiento desde http://${hostname}:${port}`) // en lugar de http://localhost se coloca ${direccion ip hostname}
});

// index

app.get('/',(req,res)=>{
    //consulta DB
    const query ='SELECT * FROM alumnos'; // user es el nombre de la tabla
     // trabajamos con la coneccion
     db.query(query,(err,results)=>{
        if(err){
            console.error(`error en DB Codigo: ${err}`);
            res.send('error en conexion a la Db de Error ')

        }else{
            console.log('Resultados de alumnos:', results); // Para depurar los datos
            res.render('index',{alumnos:results});// users es el nombre de la tabla de donde va a tomar los datos de db


        }

     });

});

// agregar usuarios

app.post('/add',(req,res)=>{
    const {nombre,apellido,edad,correo,direccion,telefono,fecha_ingreso}=req.body;
    const query = 'INSERT INTO alumnos (nombre,apellido,edad,correo,direccion,telefono,fecha_ingreso) VALUE (?,?,?,?,?,?,?)'
    db.query(query,[nombre,apellido,edad,correo,direccion,telefono,fecha_ingreso],(err)=>{

        if(err){
            console.error("Error al agregar alumno");
            res.send("Error al agregar alumno")

        }else{

            res.redirect('/');

        }
    });

});

// editar usuario

app.get('/edit/:id', (req,res)=>{
    const {id}=req.params;
    const query = 'SELECT * FROM alumnos WHERE id= ?';
    db.query(query,[id],(err,results)=>{

        if(err || results.length === 0){
            console.error("Error al obtener alumno:", err);
            res.send("Alumno no encontrado");

        }else{

            res.render('edit',{alumno:results[0]});

        }
    });

});
// actualiza la edicion 
app.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const { nombre,apellido,edad,correo,direccion,telefono,fecha_ingreso } = req.body;
    const query = 'UPDATE alumnos SET nombre = ?, apellido = ?, edad = ?, correo = ?, direccion = ?, telefono = ?, fecha_ingreso = ? WHERE id = ?';
    db.query(query, [nombre,apellido,edad,correo,direccion,telefono,fecha_ingreso, id], (err) => {
        if (err) {
            console.error("Error al actualizar alumno:", err);
            res.send("Error al actualizar alumno");
        } else {
            res.redirect('/');
        }
    });
});

//eliminar usuario

app.get('/delete/:id',(req,res)=>{
    const {id}=req.params;
    const query= 'DELETE FROM alumnos WHERE id = ?';
    db.query(query,[id],(err)=>{
        if(err){
            console.error("Error al eliminar alumno:", err);
            res.send("Error al eliminar alumno");
            

        }else{
            res.redirect('/');

        }
    });
});
