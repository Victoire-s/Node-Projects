// Connexion au serveur
var socket = io();
var destid = null;
var pseudo = prompt('Quel est votre pseudo ?'); // Demande du pseudo + envoie au serveur
socket.emit('set-nickname', pseudo); //Envoi du pseudo au serveur
var messages = document.getElementById('messages'); // Ensemble des messages qui vont être affichés
var form = document.getElementById('form'); // Récupération du formulaire
var input = document.getElementById('input_msg'); // Récupération saisie du client
var id_salon='salon'; // Variable qui va définir un destinataire par defaut le salon général
var lesMessages = []; // Tableau qui va contenir l'ensemble des messages envoyés (semi-persistance)
var user = document.getElementById('user');


form.addEventListener('submit', (e)=> {
 
  // Si il y a eu un appui sur "Envoi"
   e.preventDefault();
   if(input.value){
       socket.emit('emission_message', { // Envoie du pseudo et du message au serveur
           nick : pseudo,
           msg : input.value    
       });
       input.value = '';
       
       
   }
});

socket.on('reception_message', (infos) => { // Reception des nouveaux messages
    var item = document.createElement('li');
    item.textContent = infos.pseudo+" : "+infos.message; // On traite les données reçus
    messages.appendChild(item); // On ajoute dans les messages à afficher
    window.scrollTo(0, document.body.scrollHeight);
    // AJOUTER EMPLACEMENT SALON 
});

socket.on('reception_utilisateur', (data) => {  
  var utilisateurSalon = false;
  console.log("data :"+JSON.stringify(data));
  const listeUtilisateur = document.getElementById('user');
  listeUtilisateur.innerHTML = '';
  socket.emit('emission_utilisateur', {utilisateurs : data.pseudo_client + data.id_client });

  if(!utilisateurSalon){
    const pseudoClient = document.createElement('li');
    pseudoClient.textContent = "Salon";
    pseudoClient.innerHTML = '<a href="#" onClick="salon(\'' + data.id_client + '\', \'' + data.pseudo_client + '\')" >' + "Salon" + '</a>';
    listeUtilisateur.appendChild(pseudoClient);
    console.log(data.pseudo_client + data.id_client);
  }
  data.forEach((utilisateurs) => { 
    pseudoC = utilisateurs.pseudo_client;
    const pseudoClient = document.createElement('li');
    pseudoClient.textContent = pseudoC;
    // Ajout d'un événement de clic sur l'élément de liste pour lancer la conversation privée correspondante
    pseudoClient.addEventListener('click', () => {
    console.log("voici le pseudo : "+data.pseudo_client)
    id_client = data.id_client;
    id_salon = data.id_client;
    destid = data.id_client;
    const discussion = document.getElementById('discussion-utilisateur');
    discussion.innerHTML = '';
    console.log(id_client + id_salon + destid);
    });
    listeUtilisateur.appendChild(pseudoClient);
    pseudoClient.innerHTML = '<a href="#" onClick="salon(\'' + data.id_client + '\', \'' + data.pseudo_client + '\')" >' + pseudoC + '</a>';
    console.log(pseudoC);
  });
  // AFFICHAGE NOMBRE M
  var nbUtilisateurs = document.getElementById('nb-utilisateurs');
  nbUtilisateurs.innerText = data.length;
});

function salon(id){

}

































// Affichage des messages en fonction du choix de l'utilisateur :
// - Soit les mes messages du salon général,
// - SOit les messages d'une conversation privée avec un autre utilisateur
/*function salon(id) {
  const discussion = document.getElementById('discussion-utilisateur');
  discussion.innerHTML = '';
  //Discussion générale
  if(id_salon = salon){
    lesMessages.forEach((message) => {
      const contenuMessage = document.createElement('div');
      messageElem.innerHTML = '<ul style="float:right;" >'+message.pseudo + ' : ' +message.msg+'</ul>';
      messageContainer.appendChild(messageElem);
      message.recu =true;
    });
  }
  else if(id_salon = id_client){
    lesMessages.forEach((message) => {
      const contenuMessage = document.createElement('div');
      messageElem.innerHTML = '<ul style="float:right;" >'+message.pseudo + ' : ' +message.msg+'</ul>';
      messageContainer.appendChild(messageElem);
      message.recu =true;
    });
  }
  

    }





  
  /*
  function check_unread() {
  // Envoyer une requête à l'API pour récupérer le nombre de messages non-lus
  fetch('/api/messages/unread')
    .then(response => response.json())
    .then(data => {
      // Récupérer l'élément HTML qui affiche le badge de notification
      const badge = document.getElementById('badge');

      // Mettre à jour le badge de notification avec le nombre de messages non-lus
      badge.innerHTML = data.unreadCount;
    });
}*/