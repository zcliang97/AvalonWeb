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
	5:  [2, 3, 2, 3, 3],
	6:  [2, 3, 4, 3, 4],
	7:  [2, 3, 3, 4, 4],
	8:  [3, 4, 4, 5, 5],
	9:  [3, 4, 4, 5, 5],
	10: [3, 4, 4, 5, 5],
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

//Number of votes remaining
let numVotes;

//Number of successes and fails per quest
let numSuccess;
let numFail;

//Total sucesses and fails
let totalSuccesses;
let totalFails;

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
	totalSuccesses = 0;
	totalFails = 0;
	currPlayer = 0;
	rolePause = false;
	
	document.getElementById("game_setup").style.display = "none";
	document.getElementById("game_image").style.display = "none";
	document.getElementById("game_main").style.display = "block";
	
	document.getElementById("btn_success").style.display = "none";
	document.getElementById("btn_fail").style.display = "none";
	
	characterLists[numPlayers] = shuffle(characterLists[numPlayers]);
	
	nextRole();
	
}

function nextRole(){
	if (rolePause && currPlayer < numPlayers){
		document.getElementById("game_message").innerHTML = `<p> Please pass the computer to the next player.</p>`;
		document.getElementById("game_image").style.display = "none";
		rolePause = false;
	}
	else if (currPlayer < numPlayers){
		var imgSrc = [];
		imgSrc.push("Images/char_");
		imgSrc.push(characterLists[numPlayers][currPlayer]);
		imgSrc.push(".jpg");
		document.getElementById("game_image").style.display = "block";
		document.getElementById("main_image").src = imgSrc.join('');
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

function startQuests(){
	currMission = 0;
	
	document.getElementById("game_image").style.display = "block";
	document.getElementById("main_image").src = "Images/quest_mission.jpg";
	document.getElementById("main_image").height = "360";
	document.getElementById("main_image").width = "640";
	
	strMessage = [];
	strMessage.push(playerNames[Math.floor(numPlayers * Math.random())])
	strMessage.push(" will choose the first mission.<br>");
	
	document.getElementById("btn_next").removeEventListener("click", nextRole);
	document.getElementById("btn_next").addEventListener("click", startVoting);
	
	runQuest();
}

function runQuest(){
	strMessage = [];
	numSuccess = 0;
	numFail = 0;
	numVotes = questParticipants[numPlayers][currMission];
	
	if(totalSuccesses == 3){
		document.getElementById("game_message").innerHTML = "Three Missions Succeeded.<br>Bad players pick who you think Merlin is.";
		document.getElementById("game_dropdown").style.display = "inline-block";
		document.getElementById("btn_next").removeEventListener("click", runQuest);
		document.getElementById("btn_next").addEventListener("click", pickMerlin);
		
		populateDropdown();
	}
	else if(totalFails == 3){
		document.getElementById("game_message").innerHTML = "<h2>Congratulations Bad People! You Won!</h2>";
	}
	else{
		strMessage.push("<h2>Welcome to Mission ");
		strMessage.push(currMission + 1);
		strMessage.push("!</h2><br>");
		strMessage.push("Please select ");
		strMessage.push(questParticipants[numPlayers][currMission]);
		strMessage.push(" people to go on the quest with you.");
		
		document.getElementById("btn_next").removeEventListener("click", runQuest);
		document.getElementById("btn_next").addEventListener("click", startVoting);
		document.getElementById("game_message").innerHTML = `<p>${strMessage.join('')}</p>`;
	}
}

function startVoting(){
	document.getElementById("btn_next").style.display = "none";
	document.getElementById("btn_success").style.display = "inline-block";
	document.getElementById("btn_fail").style.display = "inline-block";
	if(numVotes == 0){
		strMessage = [];
		strMessage.push("There were ");
		strMessage.push(numSuccess);
		strMessage.push(" Successes and ");
		strMessage.push(numFail);
		strMessage.push(" Fails.<br>This mission ");
		if(numFail > 0){
			strMessage.push("<b>failed</b>.");
			totalFails++;
		}
		else{
			strMessage.push("<b>succeeded!</b>");
			totalSuccesses++;
		}
		
		document.getElementById("game_message").innerHTML = `<p>${strMessage.join('')}</p>`;
		document.getElementById("btn_success").style.display = "none";
		document.getElementById("btn_fail").style.display = "none";
		document.getElementById("btn_next").style.display = "inline-block";
		document.getElementById("btn_next").removeEventListener("click", startVoting);
		document.getElementById("btn_next").addEventListener("click", runQuest);
		currMission++;
	}
}

function clickSuccess(){
	numSuccess++;
	numVotes--;
	document.getElementById("btn_success").blur();
	startVoting();
}

function clickFail(){
	numFail++;
	numVotes--;
	document.getElementById("btn_fail").blur();
	startVoting();
}

function pickMerlin(){
	var players = document.getElementById("dropdown");
	if(characterLists[numPlayers][players.selectedIndex] == "merlin"){
		document.getElementById("game_message").innerHTML = "<h2>Congratulations Bad People! You Won!</h2>";
	}
	else{
		document.getElementById("game_message").innerHTML = "<h2>Congratulations Good People! You Won!</h2>";
	}
}

function populateDropdown(){
	var dropdown = document.getElementById('dropdown');
	for (let i = 0; i < numPlayers; i++){
		var player = document.createElement('option');
		player.value = playerNames[i];
		player.innerHTML = playerNames[i];
		dropdown.appendChild(player);
	}
}

//Event Listeners for Buttons
document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("btn_begin").addEventListener("click", beginGame);
	document.getElementById("btn_startGame").addEventListener("click", initializeGame);
	document.getElementById("btn_success").addEventListener("click", clickSuccess);
	document.getElementById("btn_fail").addEventListener("click", clickFail);
	document.getElementById("btn_next").addEventListener("click", nextRole);
});
