//Creación de la matriz que contiene los botones
matrix = new Array (3);
cpuMatrix = new Array (3);
for (var i = 0 ; i < 3 ; i ++) {
	matrix[i] = new Array (3);
	cpuMatrix[i] = new Array (3);
}
//Definicion de variables globales
btnSquare = '<i class="fa fa-square-o fa-3x" aria-hidden="true"></i>';
btnX = '<i class="fa fa-times fa-3x" aria-hidden="true"></i>';
btnO = '<i class="fa fa-circle-o fa-3x" aria-hidden="true"></i>';
btnSuccess = 'btn-outline-success';
btnPrimary = 'btn-outline-primary';
btnDanger = 'btn-outline-danger';
turn = 1; //false = turno de las x ; true = turno del circulo
role = {player:1, cpu:2};
gameState = {playing:0, waiting:1, finished:2};
finish = {tie:0, player:1, cpu:2};


//Función onload para que se ejecute el código una vez que la página ha sido cargada
window.onload = function () {
	//Mapeo de los botones en una matriz de elementos
	for (var i = 0 ; i < 3 ; i ++) {
		for (var j = 0 ; j < 3 ; j ++) {
			matrix[i][j] = document.getElementById('b' + (i*3+j));
		}
	}
	//Tirada inicial de la máquina en una de las cuatro esquinas
	switch (Math.floor(Math.random()*3)) {
		case 0: matrix[0][0].classList.remove(btnPrimary);
				matrix[0][0].classList.add(btnDanger);
				matrix[0][0].classList.add('disabled');
				matrix[0][0].innerHTML = btnX;
				break;
		case 1: matrix[0][2].classList.remove(btnPrimary);
				matrix[0][2].classList.add(btnDanger);
				matrix[0][2].classList.add('disabled');
				matrix[0][2].innerHTML = btnX;
				break;
		case 2: matrix[2][0].classList.remove(btnPrimary);
				matrix[2][0].classList.add(btnDanger);
				matrix[2][0].classList.add('disabled');
				matrix[2][0].innerHTML = btnX;
				break;
		case 3: matrix[2][2].classList.remove(btnPrimary);
				matrix[2][2].classList.add(btnDanger);
				matrix[2][2].classList.add('disabled');
				matrix[2][2].innerHTML = btnX;
				break;
	}
}
//Función que se ejecuta al hacer click a un botón
function revisar (btn) {
	if (!btn.classList.contains('disabled')) {
		//Se cambia la apariencia del botón y se deshabilita
		btn.classList.remove(btnPrimary);
		btn.classList.add(btnSuccess);
		btn.classList.add('disabled');
		btn.innerHTML = btnO;
		turn++;
		cpu();
		switch (victoryCondition()) {
			case finish.player:
				document.getElementById('alert').innerHTML = '<div class="alert alert-success alert-dismissable">¡Ganaste!</b> El jugador gana la partida.</div>';
				blockAll();
				return;
			case finish.tie:
				document.getElementById('alert').innerHTML = '<div class="alert alert-info alert-dismissable">¡La partida ha finalizado en <b>empate</b>!</div>';
				blockAll();
				return;
			case finish.cpu:
				document.getElementById('alert').innerHTML = '<div class="alert alert-danger alert-dismissable"><b>¡Perdiste!</b> La máquina gana la partida.</div>';
				blockAll();
				return;
		}
	}
}

function cpu () {
	var posX = 0;
	var posY = 0;
	var aux, best = -9999;
	if (turn != 9) {
		//Recuperación de la matriz para la creación del arbol y la simulación
		for (var i = 0 ; i < 3 ; i ++) {
			for (var j = 0 ; j < 3 ; j ++) {
				if (matrix[i][j].classList.contains(btnPrimary))
					cpuMatrix[i][j] = 0;
				else if (matrix[i][j].classList.contains(btnSuccess))
					cpuMatrix[i][j] = role.player;
				if (matrix[i][j].classList.contains(btnDanger))
					cpuMatrix[i][j] = role.cpu;
			}
		}
		console.log(cpuMatrix[0][0]);
		for (var i = 0 ; i < 3 ; i ++) {
			for (var j = 0 ; j < 3 ; j ++) {
				if (cpuMatrix[i][j] == 0) {
					cpuMatrix[i][j] = role.cpu;
					aux = cpuMin();
					if (aux > best)
					{
						best = aux;
						posX = i;
						posY = j;
					}
					cpuMatrix[i][j] = 0;
				}
			}
		}
	 	matrix[posX][posY].classList.remove(btnPrimary);
		matrix[posX][posY].classList.add(btnDanger);
		matrix[posX][posY].classList.add('disabled');
		matrix[posX][posY].innerHTML = btnX;
		turn++;
	}
}

function cpuMin () {
	if (cpuVictorySimulation() == role.cpu) return 1;
	if (cpuVictorySimulation() == finish.tie) return 0;
	var aux, best = 9999;
 	for (var i = 0 ; i < 3 ; i ++) {
		for (var j = 0 ; j < 3 ; j ++) {
			if (cpuMatrix[i][j] == 0) {
				cpuMatrix[i][j] = role.player;
				aux = cpuMax();
				if (aux < best)
				{
					best = aux;
				}
				cpuMatrix[i][j] = 0;
			}
			console.log(cpuMatrix);
		}
	}
	return best;
}

function cpuMax () {
	if (cpuVictorySimulation() == role.player) return -1;
	if (cpuVictorySimulation() == finish.tie) return 0;
	var aux, best = -9999;
 	for (var i = 0 ; i < 3 ; i ++) {
		for (var j = 0 ; j < 3 ; j ++) {
			if (cpuMatrix[i][j] == 0) {
				cpuMatrix[i][j] = role.cpu;
				aux = cpuMin();
				if (aux > best)
				{
					best = aux;
				}
				cpuMatrix[i][j] = 0;
			}
		}
	}
	return best;
}

function victoryCondition () {
	//Condiciones en la que el jugador gana la partida
	if (matrix[0][0].classList.contains(btnSuccess) && matrix[0][1].classList.contains(btnSuccess) && matrix[0][2].classList.contains(btnSuccess) ||
		matrix[1][0].classList.contains(btnSuccess) && matrix[1][1].classList.contains(btnSuccess) && matrix[1][2].classList.contains(btnSuccess) ||
		matrix[2][0].classList.contains(btnSuccess) && matrix[2][1].classList.contains(btnSuccess) && matrix[2][2].classList.contains(btnSuccess) ||
		matrix[0][0].classList.contains(btnSuccess) && matrix[1][0].classList.contains(btnSuccess) && matrix[2][0].classList.contains(btnSuccess) ||
		matrix[0][1].classList.contains(btnSuccess) && matrix[1][1].classList.contains(btnSuccess) && matrix[2][1].classList.contains(btnSuccess) ||
		matrix[0][2].classList.contains(btnSuccess) && matrix[1][2].classList.contains(btnSuccess) && matrix[2][2].classList.contains(btnSuccess) ||
		matrix[0][0].classList.contains(btnSuccess) && matrix[1][1].classList.contains(btnSuccess) && matrix[2][2].classList.contains(btnSuccess) ||
		matrix[0][2].classList.contains(btnSuccess) && matrix[1][1].classList.contains(btnSuccess) && matrix[2][0].classList.contains(btnSuccess))
		return finish.player;
	//Condiciones en la que la máquina gana la partida
	if (matrix[0][0].classList.contains(btnDanger) && matrix[0][1].classList.contains(btnDanger) && matrix[0][2].classList.contains(btnDanger) ||
		matrix[1][0].classList.contains(btnDanger) && matrix[1][1].classList.contains(btnDanger) && matrix[1][2].classList.contains(btnDanger) ||
		matrix[2][0].classList.contains(btnDanger) && matrix[2][1].classList.contains(btnDanger) && matrix[2][2].classList.contains(btnDanger) ||
		matrix[0][0].classList.contains(btnDanger) && matrix[1][0].classList.contains(btnDanger) && matrix[2][0].classList.contains(btnDanger) ||
		matrix[0][1].classList.contains(btnDanger) && matrix[1][1].classList.contains(btnDanger) && matrix[2][1].classList.contains(btnDanger) ||
		matrix[0][2].classList.contains(btnDanger) && matrix[1][2].classList.contains(btnDanger) && matrix[2][2].classList.contains(btnDanger) ||
		matrix[0][0].classList.contains(btnDanger) && matrix[1][1].classList.contains(btnDanger) && matrix[2][2].classList.contains(btnDanger) ||
		matrix[0][2].classList.contains(btnDanger) && matrix[1][1].classList.contains(btnDanger) && matrix[2][0].classList.contains(btnDanger))
		return finish.cpu;
	//Condicion en la que la partida termina en empate
	if (turn == 9)
		return finish.tie;
}

function cpuVictorySimulation () {
	//Condiciones en la que el jugador gana la partida
	if (cpuMatrix[0][0] == finish.player && cpuMatrix[0][1] == finish.player && cpuMatrix[0][2] == finish.player ||
		cpuMatrix[1][0] == finish.player && cpuMatrix[1][1] == finish.player && cpuMatrix[1][2] == finish.player ||
		cpuMatrix[2][0] == finish.player && cpuMatrix[2][1] == finish.player && cpuMatrix[2][2] == finish.player ||
		cpuMatrix[0][0] == finish.player && cpuMatrix[1][0] == finish.player && cpuMatrix[2][0] == finish.player ||
		cpuMatrix[0][1] == finish.player && cpuMatrix[1][1] == finish.player && cpuMatrix[2][1] == finish.player ||
		cpuMatrix[0][2] == finish.player && cpuMatrix[1][2] == finish.player && cpuMatrix[2][2] == finish.player ||
		cpuMatrix[0][0] == finish.player && cpuMatrix[1][1] == finish.player && cpuMatrix[2][2] == finish.player ||
		cpuMatrix[0][2] == finish.player && cpuMatrix[1][1] == finish.player && cpuMatrix[2][0] == finish.player)
		return finish.player;
	//Condiciones en la que la máquina gana la partida
	if (cpuMatrix[0][0] == finish.cpu && cpuMatrix[0][1] == finish.cpu && cpuMatrix[0][2] == finish.cpu ||
		cpuMatrix[1][0] == finish.cpu && cpuMatrix[1][1] == finish.cpu && cpuMatrix[1][2] == finish.cpu ||
		cpuMatrix[2][0] == finish.cpu && cpuMatrix[2][1] == finish.cpu && cpuMatrix[2][2] == finish.cpu ||
		cpuMatrix[0][0] == finish.cpu && cpuMatrix[1][0] == finish.cpu && cpuMatrix[2][0] == finish.cpu ||
		cpuMatrix[0][1] == finish.cpu && cpuMatrix[1][1] == finish.cpu && cpuMatrix[2][1] == finish.cpu ||
		cpuMatrix[0][2] == finish.cpu && cpuMatrix[1][2] == finish.cpu && cpuMatrix[2][2] == finish.cpu ||
		cpuMatrix[0][0] == finish.cpu && cpuMatrix[1][1] == finish.cpu && cpuMatrix[2][2] == finish.cpu ||
		cpuMatrix[0][2] == finish.cpu && cpuMatrix[1][1] == finish.cpu && cpuMatrix[2][0] == finish.cpu)
		return finish.cpu;
	//Condicion en la que la partida termina en empate
	if (turn == 9)
		return finish.tie;
}
//Función que bloquea todo el tablero al cuplirse una condición de victoria
function blockAll () {
	for (var i = 0 ; i < 3 ; i ++) {
		for (var j = 0 ; j < 3 ; j ++) {
			matrix[i][j].classList.add('disabled');
		}
	}
}
