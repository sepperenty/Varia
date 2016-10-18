




	var clockWidth = $("#clock").width();
	var clockHeight = $("#clock").height();
	var clockPos = $("#clock").position();
	var wijzerWidth = $("#secWijzer").width();
	var centerClock = clockPos.left + clockWidth/2;
	var clockYPos = clockPos.top;
	var clockXpos = clockPos.left;

	

	//secondenwijzer

	$("#secWijzer").css({"height": clockHeight/2 - 50});

	
	$("#secWijzer").css({"left": centerClock  - wijzerWidth/2});

	var wijzerHeight = $("#secWijzer").height();


	$("#secWijzer").css({"top": clockYPos + clockHeight/2 - 210});

	var wijzerxpos = $("#secWijzer").position().left;




	//Minutenwijzer

	var minWijzerWidth = $("#minWijzer").width();
	
	$("#minWijzer").css({"height": clockHeight/2 - 100});

	$("#minWijzer").css({"left": centerClock - minWijzerWidth/2});

	$("#minWijzer").css({"top": clockYPos + 100});



	//hourWijzer

	$("#hourWijzer").css({"height": clockHeight/2 - 180});

	var hourWijzerHeight = $("#hourWijzer").height();
	var hourWijzerWidth = $("#hourWijzer").width();

	var hourWijzerYpos = clockYPos +  (clockHeight/2 -  hourWijzerHeight);


	$("#hourWijzer").css({top: hourWijzerYpos});

	var hourWijzerXPos = centerClock - hourWijzerWidth/2;


	$("#hourWijzer").css({left: hourWijzerXPos});

	//LeftButton

	$("#leftButton").css({left: clockXpos + clockWidth/8});
	$("#leftButton").css({top: clockYPos + clockHeight/8});

	var clickLeftIn = false;




	
	//rightButton

	var rightButtonWidth = $("#rightButton").width();

	$("#rightButton").css({left:  clockXpos + clockWidth - clockWidth/8 - rightButtonWidth});

	$("#rightButton").css({top: clockYPos + clockHeight/8});


	
	



	




	//midden circel locatie

	var midCircleHeight = $("#midCircle").height();
	var midCircleWidth = $("#midCircle").width();

	var midCircleYLocation = clockYPos + clockHeight/2  - midCircleHeight/2;
	var midCircleXLocation = centerClock - midCircleWidth/2;

	

	
	$("#midCircle").css({"top": midCircleYLocation});
	$("#midCircle").css({"left": midCircleXLocation});




		

	var secDegree = 0;
	var minDegree = 0;
	var hourDegree = 0;

	var timer = 0;
	var minTimer = 0;

	var canStart = true;

	var timeOut;

	var clockTimer = function(){

		if(canStart)
			{
			timer++;
			

			secDegree+= 6;

			if(timer == 60)
			{
				minTimer++;
				minDegree+=6;
				timer = 0;
				secDegree = 0;
			}

			if(minTimer == 60)
			{
				minDegree = 0;
				hourDegree +=6;
				minTimer = 0;

			}




			$("#minWijzer").css({'-webkit-transform' : 'rotate('+ minDegree +'deg)',
	                 '-moz-transform' : 'rotate('+ minDegree +'deg)',
	                 '-ms-transform' : 'rotate('+ minDegree +'deg)',
	                 'transform' : 'rotate('+ minDegree +'deg)'});




			$("#secWijzer").css({'-webkit-transform' : 'rotate('+ secDegree +'deg)',
	                 '-moz-transform' : 'rotate('+ secDegree +'deg)',
	                 '-ms-transform' : 'rotate('+ secDegree +'deg)',
	                 'transform' : 'rotate('+ secDegree +'deg)'});


			$("#hourWijzer").css({'-webkit-transform' : 'rotate('+ hourDegree +'deg)',
	                 '-moz-transform' : 'rotate('+ hourDegree +'deg)',
	                 '-ms-transform' : 'rotate('+ hourDegree +'deg)',
	                 'transform' : 'rotate('+ hourDegree +'deg)'});


			timeOut = setTimeout('clockTimer()', 1000);
		}
	}




	$("#rightButton").mousedown(function(){



		canStart = true;

		clearTimeout(timeOut);

		secDegree = 0;
		minDegree = 0;
		hourDegree = 0;

		timer = 0;
		minTimer = 0;

		clockTimer();


		




		$(this).css({left:  clockXpos + clockWidth - clockWidth/8 - rightButtonWidth - 15, top: clockYPos + clockHeight/8 +15});
		setTimeout("rightUp()", 150);

	});



	$("#leftButton").mousedown(function(){

		clearTimeout(timeOut);

		canStart = false;

	

		$(this).css({left: clockXpos + clockWidth/8 + 15, top: clockYPos + clockHeight/8+15});
		setTimeout("leftup()", 150);

	});

		clockTimer();



	function leftup(){
		$("#leftButton").css({left: clockXpos + clockWidth/8, top: clockYPos + clockHeight/8});
	}

	function rightUp(){
		$("#rightButton").css({left:  clockXpos + clockWidth - clockWidth/8 - rightButtonWidth, top: clockYPos + clockHeight/8});
	}









