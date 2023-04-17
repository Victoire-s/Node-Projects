const { Socket } = require('socket.io');
const path = require('path');


// Récupération du module Express
let app = require('express')();

// Création du serveur et du socket
let http = require('http').Server(app);
let io = require('socket.io')(http);


// Indication de la page à charger au lancement du serveur
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/client.js', function(req, res){
    res.sendFile(path.join(__dirname + '/client.js'));
});
app.get('/style.css', function(req, res){
    res.sendFile(path.join(__dirname + '/style.css'));
});


// Création de l'écouteur, et écriture des méthodes
io.on('connection', (socket) => {
   // Méthode de saisie des pseudos
   socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname; // Création de la variable rattaché au socket
    console.log(nickname + " connecté à"+new Date()); // Affichage de l'info dans la console
    io.emit('users-changed', {user: nickname, event:'joined'}); // Envoi de l'information aux autres utilisateurs


   // Récupération de la liste des utilisateurs (Sockets) connectés
   io.fetchSockets().then((room)=> {
    var utilisateurs=[];
    room.forEach((item) => {
        utilisateurs.push({
            id_client : item.id,
            pseudo_client : item.nickname,
        });
    });
    io.emit('reception_utilisateur', utilisateurs);
    console.table(utilisateurs);
   });

   });

   // Méthode en cas de déconnexion
   socket.on('disconnect', function(){
    console.log(socket.nickname + " déconnecté à"+ new Date()); // Affichage de l'info dans la console
    io.emit('users-changed', {user: socket.nickname, event: 'left'}); // Envoi de l'information aux autres utilisateurs
   });

   // Méthode envoie de message
   socket.on('add-message', (message) => {
    io.emit('message', {text: message, from: socket.nickname, created: new Date()}); // Émission du message
   });

     // Émission du message
     socket.on('emission_message', (message) => {

        io.emit('reception_message', {pseudo : message.nick, message : message.msg});
        console.table(message);
               
       });
});

// Indication du port et lancement du serveur
var port = process.env.PORT || 3001;
http.listen(port, function(){
    console.log('listening in http://localhost:' + port);
});
