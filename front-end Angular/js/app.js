/*
	Ik heb onderstaande code volledig zelf geschreven.
	Ik heb natuurlijk wel gebruik gemaakt van de angular documentatie en diverse websites waarbij angular/javascript vragen 
	of oplossingen getoont worden
	Ik heb niets letterlijk over genomen
*/


(function(){

	/*De app maakt gebruikt van de userService en de ngAnimate module. De ngAnimate module heb ik gebruikt om animaties toe te laten bij 
	ng-show/hide veranderingen. De userService wordt gebruikt om de $http requists te doen en nog achterliggende zaken*/

	var app = angular.module("schoolUren", ["userService", "ngAnimate"]);

	app.directive("loginForm", ["UserService" ,  function(UserService){
		return{
			restrict:"E", 
			templateUrl: "loginForm.html",
			controller: function($scope){

						/*Automatisch vullen van  de form met behulp van cookies*/

						var cookies = document.cookie;
						var cookieSplit = cookies.split("; ");
					
						var id;
						var initials;
						console.log(cookieSplit);

						/*De cookies worden bemachtigt door een split*/

						for(var i in cookieSplit)
						{

							var cookieParts = cookieSplit[i].split("=");
							console.log(cookieParts);
							
							if(cookieParts[0] == "id")
							{
								id = cookieParts[1];

							}

							if(cookieParts[0]=="initials")
							{
								initials = cookieParts[1];
							}
						}


						this.userInfo = {};
						var user = this;

						this.info =  UserService.getUserInfo();

						var triedLogin = false;


						/*Als er een cookie bestaat met de initialen en de id, worden de tekstboxen vanzelf ingevuld*/

						if(initials!=null && id !=null)
						{
							console.log(initials + "---" + id);
							user.userInfo.studentId = id;
							user.userInfo.studentInit = initials;
						}


						/*De tijd van 20 dagen later wordt hier opgeslagen in de expDate variabele. Hiermee wordt later de cookie aangemaakt*/

						var expDate = new Date();
				        expDate.setTime(expDate.getTime()+(20*24*60*60*1000));


						this.submit = function(){	

						/*Deze functie wordt uitgevoerd wanneer de user wilt inloggen*/		

							if(user.userInfo.studentId != null && user.userInfo.studentInit != null)
							{


								document.cookie="id="+user.userInfo.studentId + "; expires=" + expDate.toGMTString();
								document.cookie="initials="+user.userInfo.studentInit + "; expires=" + expDate.toGMTString();

								/*Triedlogin is om er voor te zorgen dat de failanimatie niet voorbarig wordt uitgevoerd. Enkel
								wanneer men heeft geprobeerd om in te loggen*/

								triedLogin = true;

								var id = user.userInfo.studentId;
								var init = user.userInfo.studentInit;
								
								/*Info wordt opgeslagen in de userService met behulp van de functies
								SetUserCourses zorgt ervoor dat de juiste vakken worden bij gehouden*/

								UserService.setUserInfo(id, init);
								UserService.setUserCourses();								

							}
							
							

						};

						/*Dit zorgt ervoor dat er niet aangemeld kan worden met een onherkenbaar studentennummer of initialen
						Wanneer de validlogin true wordt zal er aangemeld mogen worden, anders niet*/

						$scope.$watch(
										'loginCtrl.info.validLogin',
										function(newValue, oldValue) {
										
										if(user.info.validLogin == "Success")
										{
											
											
											$("#loginButton").css({"background-color": "green"});
											$scope.show = true;
											$scope.hideLogin = true;

										}

										else
										{
											if(triedLogin)
											{
											loginFailAnim();
											}
										}
										
									});
						


						

			},
			controllerAs: "loginCtrl"
		}
	}]);


	app.directive("coursesSection", ["UserService", function(UserService){
		return{
			restrict:"E", 
			templateUrl: "courses.html",
			controller: function($scope){
						this.vak = "test";
						
						this.courseTable = UserService.getUserCourses();

						/*Deze functie wordt uitgevoerd bij het selecteren van een vak*/

						this.showLogs = function(vakcode, periodeCode, vaknaam){
							

							/*Eerst wordt er gescrolt naar boven, hierna wordt de logsCanShow variabele op true gezet zodat de logs getoond worden
							met behulp van een ng-show
							Met de setVak methode wordt in de userService het juiste vak geset zodat al de juiste logs opgehaald worden
							De weken worden geset met de setWeken functie hiervoor wordt de periodeCode van het vak gebruikt
							Ook de showAddlog variabele wordt op true gezet zodat de addLog Form getoond wordt*/

							window.scrollTo(0,0);
							$scope.logsCanShow = true;
							UserService.setVak(vakcode, periodeCode, vaknaam);
							UserService.setWeken(periodeCode);
							$scope.showAddLog = true;						
						};


			},
			controllerAs: "coursesCtrl"
		}
	}]);

	app.directive("logSection", ["UserService", "$timeout", function(UserService, $timeout){
		return{
			restrict:"E",
			templateUrl: "logs.html",
			controller: function($scope){

				/*Al de logs van het betreffende vak worden opgeslagen in de logTable met behulp van de getLogs functie*/
				
				this.logTable = UserService.getLogs();
				

				//Checken of de logs zijn aangepast. Als dit zo is wordt er de makeDiagram function uitgevoerd die de staafdiagram maakt.
				//Eerst gebruikt het wel de $timeout om zeker te zijn dat de DOM volledig is ingeladen.


				$scope.$watch(
					'logsCtrl.logTable.logs',
					function(newValue, oldValue) {
					/* console.log("change");*/
					 $timeout(function(){
					 	 makeDiagram();
					 });
					
				});
				

			},
			controllerAs: "logsCtrl"
		}
	}]);

	app.directive("addlogSection", ["UserService", "$timeout", function(UserService, $timeout){
		return{
			restrict: "E",
			templateUrl: "addLog.html",
			controller: function($scope){
				addLogDir = this;

				this.wekenLoad = false;

				this.weekNr;
				this.uren;
				this.logTable = UserService.getLogs();
				logSection = this;

				/*Deze methode wordt aangeroepen wanneer de user een nieuwe log wil toevoegen*/

				this.newLog = function(){

					/*De log wordt opgeslagen met behulp van de setLog methode van de UserService*/

					removeAnimation();
					UserService.setLog(logSection.weekNr, logSection.uren);
				};

				/*Deze methode wordt opgeroepen wanneer men op de back knop klikt.*/

				this.deleteAnimation = function(){
					 removeAnimation();
					
				};

				/*Deze methode zorgt er voor dat er geen rare dingen gebeuren met de animate tijdens de navigatie, de klassen die de
				animate bevatten worden dus verwijdert*/

				function removeAnimation(){
					 $(".welDoneFrame").removeClass("move");
					 $(".welDoneSprite").removeClass("wink");
				}


				this.info =  UserService.getUserInfo();

				/*checken of de log juist is toegevoegd,
				in userservice wordt de variabele addlogsucces op true gezet als het toevoegen is gelukt
				Hierna wordt de animatie getoond*/

				$scope.$watch(
							'addLogCtrl.info.addLogSucces',
							function(newValue, oldValue) {

								if(logSection.info.addLogSucces)
								{
									/*De klasse move en wink roepen een css animatie op*/
									
									$(".welDoneFrame").addClass("move");
									$(".welDoneSprite").addClass("wink");

								}


					});
										


				/*Deze methode wordt opgeroepen wanneer er iets verandert bij de weken array
				Het laden van al de verschillende data per week neemt wat tijd dus tijdens het laden
				toon ik een laad animatie*/

				$scope.$watch(
					'addLogCtrl.logTable.weken',
					function(newValue, oldValue) {

					if(addLogDir.logTable.weken.length == 0)
					{
						addLogDir.wekenLoad = true;
					}
					else
					{
						addLogDir.wekenLoad = false;
					}
					
					
					
				}, true);
				


				

			},
			controllerAs: "addLogCtrl"
		}
	}]);








	/*Methode zorgt ervoor dat de login knop rood wordt bij een foute aanmelding*/

	function loginFailAnim(){
		$("#loginButton").css({"background-color": "#ff0000"},200);
								
							};


	/*Methode zorgt voor het aanmaken van de staafDiagrammen*/

	function makeDiagram(){
		
		$(".chartBlock").each(function()
			{

				var uren = $(this).attr("uren");
				var urenMult = 10 * uren;

					$(this).animate({width: urenMult});

			});

	
	}
	


})()



