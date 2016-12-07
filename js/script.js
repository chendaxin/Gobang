	
	var chess = document.getElementById('chess'),
	    context = chess.getContext('2d'),
	    me = true,
	    chessBoard = [],
	    over = false;
	for(var i=0; i<15; i++){
		chessBoard[i] = [];
		for(var j=0; j<15; j++){
			chessBoard[i][j] = 0;
		}
	}
	//赢法数组
	var wins = [],
		count = 0;
	for(var i=0; i<15; i++){
		wins[i] = [];
		for(var j=0; j<15; j++){
			wins[i][j] = [];
		}
	}
	for(var i=0; i<15; i++){
		for(var j=0; j<11; j++){
			for(var k=0; k<5; k++) {
				wins[i][j+k][count] = true;
			}
			count++;
		} 
	}
	for(var i=0; i<15; i++){
		for(var j=0; j<11; j++){
			for(var k=0; k<5; k++) {
				wins[j+k][i][count] = true;
			}
			count++;
		} 
	}
	for(var i=0; i<11; i++){
		for(var j=0; j<11; j++){
			for (var k=0; k<5; k++) {
				wins[i+k][j+k][count] = true;
			}
			count++;
		}
	}
	for(var i=0; i<11; i++){
		for(var j=14; j>3; j--){
			for (var k=0; k<5; k++) {
				wins[i+k][j-k][count] = true;
			}
			count++;
		}
	}
	/*console.log(count);*/
	/*赢法的统计数组*/
	var mywin= []; /*我方赢法*/
	var computerWin = []; /*计算机赢法*/
	for(var i=0; i<count; i++){
		mywin[i] = 0;
		computerWin[i] = 0;
	}
	context.strokeStyle = "#414040";

	var logo = new Image();
	logo.src = "images/chess.png";
	logo.onload = function(){
		context.drawImage(logo, 0, 0, 450, 450);
		drawChessBoard();
	}

	var drawChessBoard = function(){
		
		for(var i=0; i<15; i++){
			context.moveTo(15 + i*30, 15);
			context.lineTo(15 +i*30, 435);
			context.stroke();
			context.moveTo(15, 15 + i*30);
			context.lineTo(435, 15 +i*30);
			context.stroke();

		}
	}
	var oneStep = function(i, j, me){ //i,j表示棋的索引 me表示白棋 黑棋
		/*画圆*/
		context.beginPath();
		context.arc(15 + i*30, 15 + j*30, 13, 0, 2*Math.PI);/*圆心位置200，200 半径100 起始角度和终止角度*/
		context.closePath();
		var gradient = context.createRadialGradient(15 + i*30 + 2, 15 + j*30 - 2, 13, 15 + i*30 + 2, 15 + j*30 - 2, 0);/*绘制渐变颜色*/
		if(me){
			gradient.addColorStop(0, "#0A0A0A");/*第一个圆*/
			gradient.addColorStop(1, "#636766");/*第二个圆 颜色在半径为50和20之间渐变*/
	}else{
			gradient.addColorStop(0, "#D1D1D1");/*第一个圆*/
			gradient.addColorStop(1, "#F9F9F9");/*第二个圆 颜色在半径为50和20之间渐变*/
	}
		context.fillStyle = gradient;
		context.fill();
}

chess.onclick = function(e){
	if(over){
		return;
	}
	if(!me){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if(chessBoard[i][j] == 0){
		oneStep(i ,j, me);
		chessBoard[i][j] = 1;
		for(var k=0; k<count; k++){
			if(wins[i][j][k]){
				mywin[k]++;
				computerWin[k] = 6;
				if(mywin[k] == 5){
					window.alert("恭喜，你赢了！");
					over = true;
				}
			}
		}
		if(!over){
			me = !me;
			computerAI();
		}
	}
	
}
var computerAI = function(){
	var myScore = [];
	var computerScore = [];
	var max =0;
	var u = 0, v = 0;
	for(var i=0; i<15; i++){
		myScore[i] = [];
		computerScore[i] = [];
		for(var j=0; j<15; j++){
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for(var i=0; i<15; i++){
		for(var j=0; j<15; j++){
			if(chessBoard[i][j] == 0){
				for(var k=0; k<count; k++){
					if(wins[i][j][k]){
						if(mywin[k] == 1){
							myScore[i][j] += 200;
						}else if(mywin[k] == 2){
							myScore[i][j] += 400;
						}else if(mywin[k] ==3){
							myScore[i][j] += 2000;
						}else if(mywin[k] ==4){
							myScore[i][j] += 10000;
						}
						if(computerWin[k] == 1){
							computerScore[i][j] += 220;
						}else if(computerWin[k] == 2){
							computerScore[i][j] += 420;
						}else if(computerWin[k] ==3){
							computerScore[i][j] += 2100;
						}else if(computerWin[k] ==4){
							computerScore[i][j] += 20000;
						}

					}
				}
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] == max){
					if(computerScore[i][j] > computerScore[u][v]){
						u = i;
						v = j;
					}
				}
				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(computerScore[i][j] == max){
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}
	}
	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	for(var k=0; k<count; k++){
			if(wins[u][v][k]){
				computerWin[k]++;
				mywin[k] = 6;
				if(computerWin[k] == 5){
					window.alert("你输了！！！");
					over = true;
				}
			}
		}
		if(!over){
			me = !me;
		}
}

