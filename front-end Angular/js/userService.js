/*
	Ik heb onderstaande code volledig zelf geschreven.
	Ik heb natuurlijk wel gebruik gemaakt van de angular documentatie en diverse websites waarbij angular/javascript vragen 
	of oplossingen getoont worden.
	Ik heb niets letterlijk over genomen.
*/



(function(){

	var app = angular.module("userService", []);

	/*Deze factory gebruik ik in de app.js en doet verschillende api calls*/

	app.factory("UserService", ["$http", function($http) {

		var user = {};
		user.info = {};
		
		user.courseTable = {};
		user.logTable= {};
		user.logTable.weken = [];
		return {

			

			//Set de info van de user (initialen en id)

			setUserInfo: function(id,init){										
				user.info.id = id;
				user.info.init = init;
			},

			//krijg info over de user (initialen en id)
			
			getUserInfo: function(){ 											
				return user.info;
			},


			/*Set al de vakken van de betreffende user met behulp van de stud.php*/

			setUserCourses: function(){											
				
				$http({
					url: "http://multimediatechnology.be/workload/stud.php",
					method:"JSONP",
					params:{
						studentid : user.info.id,
						initials : user.info.init,
						callback : "JSON_CALLBACK"
					}
				}).success(function(data){

					user.courseTable.courses = data.courses;
					user.info.validLogin = data.state;

				});

			},

			/*Returnt al de  vakken van de betreffende user die aangemaakt zijn in de setUserCourses methode*/

			getUserCourses: function(){											
				return user.courseTable;
			},

			/*Verander het geselecteerde vak en verander de weken array met behulp van de setWeken functie.
			De perdiodeCode wordt meegegeven zodat dit kan worden opgeslagen in de logtable.periodecode, de vaknaam wordt meegegeven
			zodat deze kan opgeslagen worden in de logTable.vaknaam (dit om te tonen van boven op de pagina)*/

			setVak : function(vakcode, periodeCode, vaknaam){							
				var service = this;
				user.logTable.vakcode = vakcode;
				user.logTable.periodeCode = periodeCode;			
				user.logTable.vaknaam = vaknaam;
				console.log(vaknaam);
				$http({
					url: "http://multimediatechnology.be/workload/log.php",
					method:"JSONP",
					params:{
						appkey : "renty1.0",
						studentid : user.info.id,
						vakcode: vakcode,
						callback : "JSON_CALLBACK"
						
					}
				}).success(function(data){

					user.logTable.logs = data.results;										
				});
				



			},

				/*returnt al de eerdere logs van het geselecteerde vak die zijn opgehaald in de setVak methode*/

			getLogs: function(){												
				

				return user.logTable;
			
			},

				/*Met de setWeken methode bereken ik de weken van een bepaalt vak aan de hand van de gegeven periodecode.
				 de  periodeCode wordt meegegeven in de showLogs methode van app.js.*/


			setWeken: function(periodeCode){
				var start;
				var end;

				/*Eerst wordt de begin en eind datum van de gegeven periode opgeslagen.
				a.d.h.v. de periode api*/

				$http({
					url: "http://multimediatechnology.be/workload/periode.php",
					method:"JSONP",
					params: {periodecode : periodeCode,
								callback: "JSON_CALLBACK"}
				}).success(function(data){
					var start = data.periods[0].start.full;
					var end = data.periods[0].eind.full;
					setWekenArray(start,end);
					
				});

				/*Hierna wordt met deze data de weeknummers berekend. Eerst de start week en daarna de eindweek.
				Op het einde steek ik de weeknummers met een for lus in de user.logtable.weken array.
				Hiervoor gebruik ik de week api 2x*/


				var setWekenArray = function(start, end){
					var weekNrStart;
					var weekNrEnd;
					var wekenList = [];
					$http({
						url:"http://multimediatechnology.be/workload/week.php",
						method:"JSONP",
						params:{
							date : "2016-10-14", //start
							callback : "JSON_CALLBACK"}
					}).success(function(data){
						weekNrStart = data.weeknr;

							$http({
								url:"http://multimediatechnology.be/workload/week.php",
								method:"JSONP",
								params:{
									date: "2016-11-30", //end
									callback: "JSON_CALLBACK"}
							}).success(function(secData){
								weekNrEnd = secData.weeknr;
								user.logTable.weken = [];
							

								/*Voor de makkelijkheid wil ik de begin datum van elke week er bij zetten.
								Hiervoor moet ik eerst elke week afgaan met een for loop en zo per week de begindatum opzoeken met een $http request.
								Hiervoor gebruik ik de methode fillweken waardoor ik de array user.logTable.weken vul met objecten van het type
								weekinfo waarin op weekinfo.nr de weeknummer staat en op weekinfo.start de begin datum staat.*/
								
								/*De veriabele difference bestaat om te checken wanneer de weken array volledig is. als de lengte van de array
								gelijk is aan de difference tussen de beginweek en de eindweek, weet ik dat de array volledig gevult is.*/

								var difference = weekNrEnd - weekNrStart;
								difference+=1;
								
								var fillWeken = function(i)
								{
									
									
									var weekInfo = {};

								

									$http({
										url:"http://multimediatechnology.be/workload/week.php?",
										method:"JSONP",
										params:{
											weeknr : i,
											callback : "JSON_CALLBACK"}
									}).success(function(weekData){
										var startDate = weekData.date.day + "/" + weekData.date.month + "/" + weekData.date.year;
										weekInfo.start = startDate;
										weekInfo.nr = i;
										wekenList.push(weekInfo);

										/*Wanneer de array vol zit met al de data roep ik de sortmethode op
										Omdat de $http calls asynchroon zijn worden de weken niet in de juiste volgorde getoont
										Daarom sorteer ik ze eerst.*/
										
										if(wekenList.length == difference)
										{
											sortWekenList();
										}
										
									});
								}


								/*adhv deze methode sorteer ik de lijst met weken van klein naar groot*/

								var sortWekenList = function()
								{
									var high = 100 ;

									for( var i = 0; i<wekenList.length; i++)
									{
										 high = 100;

											for(var y=0; y<wekenList.length; y++)
											{
												if(high > wekenList[y].nr)
												{
													high = wekenList[y].nr;
													index = y;
													
													
												}
												
											}


											user.logTable.weken.push(wekenList[index]);
											deleteFromArray(index);
											
									}

								}

								/*Extra functie voor het deleten van de oorspronkelijke waarden voor de sorteer methode*/


								var deleteFromArray = function(index){
									wekenList[index] =  0 ;
								}

								/*dit genereert al de weken*/
								

								for(var i = weekNrStart; i<= weekNrEnd; i++)
								{
									fillWeken(i);
								}



 

							});
					});
				};
			},

			//Nieuwe log aanmaken met de info dat eerder opgeslagen is in de user variabele.
			//Weeknummer en uren worden hier aan meegegeven 

			setLog: function(weeknr, uren){
				
				user.info.addLogSucces = false;

				var service = this;
				$http({
					url:"http://multimediatechnology.be/workload/log.php",
					method: "JSONP",
					params:{
					appkey: 	"renty1.0",
					studentid: 	user.info.id,
					vakcode: 	user.logTable.vakcode,
					week: 		weeknr,
					uren: 		uren,
					extra: 		"commentaar",
					callback : "JSON_CALLBACK",
					}
				}).success(function(data){
					
					service.setVak(user.logTable.vakcode, user.logTable.periodeCode, user.logTable.vaknaam);
					user.info.addLogSucces = true;
			
				});
			},



		};
	}]);
	

})();


