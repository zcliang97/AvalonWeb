// role_names[role] is the full name of the given role
const roleNames = {
	merlin: "Merlin",
	percival: "Percival",
	servant: "Servant of Arthur",
	assassin: "Assassin",
	morgana: "Morgana",
	oberon: "Oberon",
	mordred: "Mordred",
	minion: "Minion of Mordred",
};

//List of characters in the game for different number of players
const characterLists = {
	5:  ["merlin", "servant", "servant", "assassin", "minion"],
	6:  ["merlin", "servant", "servant", "servant", "assassin", "mordred"],
	7:  ["merlin", "percival", "servant", "servant","assassin", "morgana", "oberon"],
	8:  ["merlin", "percival", "servant", "servant", "servant","assassin", "morgana", "minion"],
	9:  ["merlin", "percival", "servant", "servant", "servant", "servant","assassin", "morgana", "mordred"],
	10: ["merlin", "percival", "servant", "servant", "servant", "servant","assassin", "morgana", "mordred", "oberon"],
};

//Number of participants required for each number of players
const questParticipants = {
	5:  [2, 3, 2, 3, 3, 0],
	6:  [2, 3, 4, 3, 4, 0],
	7:  [2, 3, 3, 4, 4, 0],
	8:  [3, 4, 4, 5, 5, 0],
	9:  [3, 4, 4, 5, 5, 0],
	10: [3, 4, 4, 5, 5, 0],
};

///Static variables

//All players
let playerNames;

//Number of players
let numPlayers;

//Index of current Player
let currPlayer;

//Message holder
let strMessage;

//Pause between each role declaration
let rolePause;

//Index of current mission
let currMission;

//Shuffle a list using the Fisher-Yates algorithm
function shuffle(inputList) {
	const list = JSON.parse(JSON.stringify(inputList));
	for (let i = numPlayers - 1; i >= 0; i--) {
		const j = Math.floor(i * Math.random());
		const t = list[i];
		list[i] = list[j];
		list[j] = t;
	}
	return list;
}

//Begin Game
function beginGame() {
	document.getElementById("game_start").style.display = "none";
	document.getElementById("game_setup").style.display = "block";
	document.getElementById("num_players").value = 5;
	document.getElementById("players").value = '';
}

//Game Initialization and setup
function initializeGame() {
	numPlayers = document.getElementById("num_players").value;
	if (numPlayers >= 5 && numPlayers <= 10) {
		playerNames = document.getElementById("players").value.split(",").map(name => name.trim());//.filter(name => name);
		for (let i = playerNames.length; i < numPlayers; i++) {
			playerNames.push(`Player ${i + 1}`);
		}
		//document.getElementById("test").innerHTML = playerNames;
		startGame();
	} 
	else {
		document.getElementById("error").textContent = "Must be between 5 and 10 inclusive.";
	}
}

function startGame(){
	currPlayer = 0;
	rolePause = false;
	
	document.getElementById("game_setup").style.display = "none";
	document.getElementById("game_image").style.display = "none";
	document.getElementById("game_main").style.display = "block";
	
	document.getElementById("btn_one").style.display = "none";
	document.getElementById("btn_two").style.display = "none";
	
	characterLists[numPlayers] = shuffle(characterLists[numPlayers]);
	
	nextRole();
	
}

function nextRole(){
	if (rolePause && currPlayer < numPlayers){
		document.getElementById("game_message").innerHTML = `<p> Please pass the computer to the next player.</p>`;
		rolePause = false;
	}
	else if (currPlayer < numPlayers){
		strMessage = [];
		strMessage.push(playerNames[currPlayer]);
		strMessage.push(" you are ");
		strMessage.push(roleNames[characterLists[numPlayers][currPlayer]]);
		strMessage.push(".");
		
		document.getElementById("game_message").innerHTML = `<p>${strMessage.join('')}</p>`;
		
		currPlayer++;
		rolePause = true;
	}
	else{
		startQuests();
	}
}

function startQuestss(){
	document.getElementById("game_main").style.display = "none";
	document.getElementById("game_start").style.display = "block";
	document.getElementById("btn_begin").textContent = "Play Again";
}

function startQuests(){
	currMission = 0;
	strMessage = [];
	strMessage.push(playerNames[Math.floor(numPlayers * Math.random())])
	strMessage.push(" will choose the first mission.<br>");
	
	//while(questParticipants[numPlayers][currMission] != 0){
		strMessage.push("Welcome to Mission ");
		strMessage.push(currMission + 1);
		strMessage.push("!<br>");
		strMessage.push("Please select ");
		strMessage.push(questParticipants[numPlayers][currMission]);
		strMessage.push(" people to go on the quest with you.");
		currMission++;
	//}
	document.getElementById("game_message").innerHTML = `<p>${strMessage.join('')}</p>`;
}

function clickBtnOne(){
}

function clickBtnTwo(){
}

//Event Listeners for Buttons
document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("btn_begin").addEventListener("click", beginGame);
	document.getElementById("btn_startGame").addEventListener("click", initializeGame);
	document.getElementById("btn_one").addEventListener("click", clickBtnOne);
	document.getElementById("btn_two").addEventListener("click", clickBtnTwo);
	document.getElementById("btn_next").addEventListener("click", nextRole);
});


