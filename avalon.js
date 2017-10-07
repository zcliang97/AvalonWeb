///=================================================== CONSTANT VALUES ===================================================

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

///=================================================== STATIC VARIABLES ===================================================

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

///=================================================== HELPER FUNCTIONS ===================================================

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

//Toggles the visibility of all the elements in the array to the specified display
function toggleVisibility(arr, display){
	for(let i = 0; i < arr.length; ++i){
		document.getElementById(arr[i]).style.display = display;
	}
}

//String concat
function formatString(arr){
	str = [];
	for(let i = 0; i < arr.length; ++i){
		str.push(arr[i]);
	}
	return str.join('');
}

function getElement(id){
	return document.getElementById(id);
}

///=================================================== MAIN FUNCTIONS ===================================================

//Begin Game
function beginGame() {
	toggleVisibility(["game_start"], "none");
	toggleVisibility(["game_setup"], "block");
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

//Start game
function startGame(){
	totalSuccesses = 0;
	totalFails = 0;
	currPlayer = 0;
	rolePause = false;
	
	toggleVisibility(["game_setup", "game_image", "game_main", "btn_success", "btn_fail"], "none");
	toggleVisibility(["game_main"], "block");
	
	characterLists[numPlayers] = shuffle(characterLists[numPlayers]);
	
	nextRole();
	
}

function nextRole(){
	var msgElement = getElement("game_message");
	if (rolePause && currPlayer < numPlayers){
		msgElement.innerHTML = `<p> Please pass the computer to the next player.</p>`;
		toggleVisibility(["game_image"], "none");
		rolePause = false;
	}
	else if (currPlayer < numPlayers){
		toggleVisibility(["game_image"], "block");
		getElement("main_image").src = formatString(["Images/char_", characterLists[numPlayers][currPlayer], ".jpg"]);
		strMessage = formatString([playerNames[currPlayer], " you are ", roleNames[characterLists[numPlayers][currPlayer]], "."]);
		msgElement.innerHTML = `<p>${strMessage}</p>`;
		
		currPlayer++;
		rolePause = true;
	}
	else{
		startQuests();
	}
}

function startQuests(){
	currMission = 0;
	
	var imgElement = getElement("main_image");
	var btnElement = getElement("btn_next");
	imgElement.src = "Images/quest_mission.jpg";
	imgElement.height = "288";
	imgElement.width = "512";
	
	strMessage = formatString([playerNames[Math.floor(numPlayers * Math.random())], " will choose the first mission.<br>"]);
	
	btnElement.removeEventListener("click", nextRole);
	btnElement.addEventListener("click", startVoting);
	
	runQuest();
}

function runQuest(){
	var btnNext = getElement("btn_next");
	var msgElement = getElement("game_message");
	numSuccess = 0;
	numFail = 0;
	numVotes = questParticipants[numPlayers][currMission];
	
	if(totalSuccesses == 3){
		msgElement.innerHTML = "Three Missions Succeeded.<br>Bad players pick who you think Merlin is.";
		toggleVisibility(["game_dropdown"], "inline-block");
		btnNext.removeEventListener("click", runQuest);
		btnNext.addEventListener("click", pickMerlin);
		
		populateDropdown();
	}
	else if(totalFails == 3){
		msgElement.innerHTML = "<h2>Congratulations Bad People! You Won!</h2>";
	}
	else{
		strMessage = formatString(["<h2>Welcome to Mission ", currMission + 1, "!</h2><br>", "Please select ", questParticipants[numPlayers][currMission], " people to go on the quest with you."]);
		btnNext.removeEventListener("click", runQuest);
		btnNext.addEventListener("click", startVoting);
		msgElement.innerHTML = `<p>${strMessage}</p>`;
	}
}

function startVoting(){
	toggleVisibility(["btn_next"], "none");
	toggleVisibility(["btn_success", "btn_fail"], "inline-block");
	if(numVotes == 0){
		strMessage = formatString(["There were ", numSuccess, " Successes and ", numFail, " Fails.<br>This mission ", (numFail > 0) ? "<b>failed</b>." : "<b>succeeded!</b>"]);
		if(numFail > 0) totalFails++;
		else totalSuccesses++;
		
		getElement("game_message").innerHTML = `<p>${strMessage}</p>`;
		toggleVisibility(["btn_success", "btn_fail"], "none");
		toggleVisibility(["btn_next"], "inline-block");
		getElement("btn_next").removeEventListener("click", startVoting);
		getElement("btn_next").addEventListener("click", runQuest);
		currMission++;
	}
}

function clickSuccess(){
	numSuccess++;
	numVotes--;
	getElement("btn_success").blur();
	startVoting();
}

function clickFail(){
	numFail++;
	numVotes--;
	getElement("btn_fail").blur();
	startVoting();
}

function pickMerlin(){
	var players = getElement("dropdown");
	var msgElement = getElement("game_message");
	if(characterLists[numPlayers][players.selectedIndex] == "merlin"){
		msgElement.innerHTML = "<h2>Congratulations Bad People! You Won!</h2>";
	}
	else{
		msgElement.innerHTML = "<h2>Congratulations Good People! You Won!</h2>";
	}
}

function populateDropdown(){
	var dropdown = getElement('dropdown');
	for (let i = 0; i < numPlayers; i++){
		var player = document.createElement('option');
		player.value = playerNames[i];
		player.innerHTML = playerNames[i];
		dropdown.appendChild(player);
	}
}

//Event Listeners for Buttons
document.addEventListener("DOMContentLoaded", function () {
	getElement("btn_begin").addEventListener("click", beginGame);
	getElement("btn_startGame").addEventListener("click", initializeGame);
	getElement("btn_success").addEventListener("click", clickSuccess);
	getElement("btn_fail").addEventListener("click", clickFail);
	getElement("btn_next").addEventListener("click", nextRole);
});