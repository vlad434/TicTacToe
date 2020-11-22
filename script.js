 var origBoard; //tabla initiala si retine ce e in fiecare patrat//
 const huPlayer = 'O'; //player om//
 const aiPlayer = 'X'; //player ai//
 const winCombos = [   //combinatiile castigatoare//
 	[0,1,2],
 	[3,4,5],
 	[6,7,8],
 	[0,3,6],
 	[1,4,7],
 	[2,5,8],
 	[0,4,8],
 	[2,4,6]

 ]

 const cells = document.querySelectorAll('.cell'); //o referinta pentru toate celulele, si retine ce e in ele//

startGame();
function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	 for(var i = 0; i < cells.length; i++){ //parcurge toate celulele si...//
	 	cells[i].innerText = ''; //goleste celula//
	 	cells[i].style.removeProperty('background-color'); //reseteaza culoarea celulei//
	 	cells[i].addEventListener('click', turnClick, false); //
	 }
}

function turnClick(square){
	if (typeof origBoard[square.target.id] == 'number'){
		turn(square.target.id, huPlayer); //daca un om face click, se apeleaza functia//
		if(!checkTie()) turn(bestSpot(), aiPlayer); //verifica daca nu e remiza, si face ai sa aleaga cel mai bun loc//
	}
}

function turn(squareId, player){  //squareId e id-ul fiecarei celule//
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;

	let gameWon = checkWin(origBoard, player);
	//la fiecare tura se verifica daca exista castigatori// 
	//se dau 2 parametrii: primul care arata unde sunt X si 0,//
	//si al doilea ca sa verificam cine a castigat//
	if(gameWon) gameOver(gameWon);
}

function checkWin(board, player){
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a,[]);
	let gameWon = null; //(**)//
	for (let [index, win] of winCombos.entries()){
		if(win.every(elem => plays.indexOf(elem) > -1)){
		//win.every trece prin toate elem lui win adica alea de sus de la winCombos//
		//verific daca jucatorul a nimerit toate cele 3 puncte castigatoare//
		gameWon = {index: index, player:player};
		break;	
		}
	}

	return gameWon;
	//daca nu castiga nimeni, gameWon o sa fie null (**)//

}

function gameOver(gameWon){
	for(let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =  //schimba culoarea ecranului in functie de castigator//
			gameWon.player == huPlayer ? "blue" : "red";
			//daca a castigat omul atunci(?) ecranul se face albastru,//
			//alfel(:) se face rosu//
	}
	for(var i = 0; i < cells.length; i++){//trece prin toate celulele si...//
		cells[i].removeEventListener('click', turnClick, false);  //nu te lasa sa mai apesi pe ele daca s-a terminat jocul//
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}


function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}


function emptySquares(){
	return origBoard.filter(s => typeof s == 'number'); 
	//filtreaza toate elem din origBoard ca sa vada daca e de tipul 'number'//
	//daca tipul e 'number' il returneaza//
	//toate celulele cu numere sunt GOALE, cele cu X/O nu sunt GOALE//
}


function bestSpot(){

	return emptySquares()[0]; //fct bestSpot cauta in emptySquares si ia primul element//
	return minimax(origBoard, aiPlayer).index;
}

function checkTie(){
	if(emptySquares().length == 0){
		for (var i = 0; i < cells.length; i++){
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick ,false);
		}
		declareWinner("Egalitate!");
		return true;
	}
	return false;
}


function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

