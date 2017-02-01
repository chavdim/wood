/* ascii art created by
    http://patorjk.com/software/taag/#p=display&f=Big%20Money-ne&t=navigation
*/
/*
                                                             /$$             /$$    
                                                            |__/            | $$    
 /$$$$$$/$$$$  /$$   /$$        /$$$$$$$  /$$$$$$$  /$$$$$$  /$$  /$$$$$$  /$$$$$$  
| $$_  $$_  $$| $$  | $$       /$$_____/ /$$_____/ /$$__  $$| $$ /$$__  $$|_  $$_/  
| $$ \ $$ \ $$| $$  | $$      |  $$$$$$ | $$      | $$  \__/| $$| $$  \ $$  | $$    
| $$ | $$ | $$| $$  | $$       \____  $$| $$      | $$      | $$| $$  | $$  | $$ /$$
| $$ | $$ | $$|  $$$$$$$       /$$$$$$$/|  $$$$$$$| $$      | $$| $$$$$$$/  |  $$$$/
|__/ |__/ |__/ \____  $$      |_______/  \_______/|__/      |__/| $$____/    \___/  
               /$$  | $$                                        | $$                
              |  $$$$$$/                                        | $$                
               \______/                                         |__/                
*/

		var speechStarted=0;
		var currentlyTesting=0;
		var timeBeforeTestEnds = 220;
		var testEndTimer = 0;
		var prevTestNumber=1;
		var testNumber=1;
		var currentGap={};
		var sessionGaps={};
		var currentIscorrect=0;
		var alreadyCorrect=0;
		var currentCorrectRatio=0;
		var timeAutoChange=2200;
		//
		//										
		var numTests = parseInt(document.getElementById("numTests").innerHTML);
			
		//test
		var isTest=0;
		var showRes=0;
		var resultList=[];
		var scoreList=[];
		var testAnswersList=[];
		//rank info
		expNeeded = {
			"D":0,
			"C":60,
			"B":300,
			"A":1100
		}
		expPerRank = {
			"D":10,
			"C":30,
			"B":80,
			"A":200
		}
		document.addEventListener('keypress',onKey,true);
		function onKey (e) {
			if (isTest==0) {
				if (e.which=="115") {
					nextTest();
				};
				if (e.which=="119") {
					prevTest();
				};
			};
			if (e.which=="116") {
				testActivated(testNumber);
			};
		}
		function userRankSystem (score) {
			// body...
			var u = getCookie("username")
			if (u) {
				//progress bar
				//
				//$("#testResult").fadeToggle(); // for debugging!
				var newExpBar = new ProgressBar.Line(containerNew, {
				  strokeWidth: 4,
				  easing: 'easeInOut',
				  duration: 1400,
				  color: '#FFEA82',
				  trailColor: '#eee',
				  trailWidth: 0.001,
				  svgStyle: {width: '100%', height: '100%'}
				});
				var newExpBar2 = new ProgressBar.Line(containerNewExp, {
				  strokeWidth: 4,
				  easing: 'easeInOut',
				  duration: 2400,
				  color: '#00e68a',
				  trailColor: '#eee',
				  trailWidth: 1,
				  svgStyle: {width: '100%', height: '100%'}
				});
				//
				//
				console.log("calculating new rank")
				var trank = getCookie("currentTestRank")
				var uexp = getCookie("userExp")
				var urank = getCookie("userRank")
				// new exp
				var addExp = Math.round( expPerRank[trank] * score/100 )
				console.log("adding exp: "+addExp+" (rounded: "+( expPerRank[trank] * score/100) + ")" )
				console.log(parseInt(uexp) , parseInt(addExp))
				var newExp = parseInt(uexp) + parseInt(addExp)
				console.log(newExp,newExp.toString())
				//
				//
				//
				var e = parseInt(getCookie("userExp"))
				//
				//
				//
				if (newExp>expNeeded["A"]) {newExp=expNeeded["A"]};
				setCookie("userExp",newExp.toString())
				// new rank
				var newRank = "D"
				if (newExp > expNeeded["D"]) {
					newRank = "D"
				};
				if (newExp > expNeeded["C"]) {
					newRank = "C"
				};
				if (newExp > expNeeded["B"]) {
					newRank = "B"
				};
				if (newExp >= expNeeded["A"]) {
					newRank = "A"
				};
				console.log("new rank: " + newRank)
				var r = getCookie("userRank")
				setCookie("userRank", newRank)

				//progress bar continued
				//calculate current exp proggress
				var newRank = getCookie("userRank")
				//var e = getCookie("userExp")
				
				//newExpBar.animate(prog);
				
				
				//new exp
				var newExp =  getCookie("userExp")
				var gainedExp = newExp - e
				//gainedExp = 25                   // for debugging!
				//overflow
				//if (r!=newRank) {
				var newProg = gainedExp/expNeeded[r]
				if (newRank==r) {
					if (r == "D") {
						var nextRank = "C"
					}; 
					if (r == "C") {
						var nextRank = "B"
					};
					if (r == "B") {
						var nextRank = "A"
					};
					if (r == "A") {
						if (newExp>expNeeded["A"]) {newExp=expNeeded["A"]};
						var nextRank = "A"
					};
				}
				else{
					if (newRank == "D") {
						var nextRank = "C"
					}; 
					if (newRank == "C") {
						var nextRank = "B"
					};
					if (newRank == "B") {
						var nextRank = "A"
					};
					if (newRank == "A") {
						if (newExp>expNeeded["A"]) {newExp=expNeeded["A"]};
						var nextRank = "A"
					};
				}
				
				var prog = e/expNeeded[nextRank]
				console.log(e,gainedExp , expNeeded[nextRank])
				if (newRank != r) {
					//var overf = (e+gainedExp ) - expNeeded[r]
					//var expToMax = expNeeded[r] - e
					//console.log("hi",expToMax)
					//newProg = newExp/expNeeded[newRank] 
					$("#rankUpText").text( "ランクアップ！" ) 
					$("#newRank").text( newRank )
					newProg = newExp/expNeeded[nextRank]  
					//
					//newProg = 2 + newProg
					console.log("hi",newProg)
					newExpBar2.animate(newProg);
					

				}
				else{

					$("#rankUpText").text( "" ) 

					newProg = ( e+gainedExp )/(expNeeded[nextRank])
					console.log("hii",newProg,prog)
					newExpBar.animate(prog);
					newExpBar2.animate(newProg);
				}
				
				//exp overflow
				
				//

				return [newRank,newExp]
			};

		}
		// called when test is pressed
		function playAudio (which) {
			s = $("#sentence"+which).text();
			var msg = new SpeechSynthesisUtterance(s);
			msg.voiceURI = 'native';
			msg.volume = 1; // 0 to 1
			msg.rate = 1; // 0.1 to 10
			msg.pitch = 1.1; //0 to 2
			msg.lang = 'en-US';
    		window.speechSynthesis.speak(msg);
		}
		function testActivated (which) {

			currentIscorrect = 0;
		  	testNumber = which;
			startButton();
			console.log("test activated"+which+speechStarted);
			
			// not testing prior to click
			if (speechStarted==0) {
				$("#results").css("box-shadow", "0px 0px 8px red");
				//
				//$(".practiceButton").hide();
				$(".questionNumbers").css('visibility', 'hidden');
				
				$(".currentTestIndicator").css('visibility', 'visible');
				$(".practiceButton").css('visibility', 'hidden');
				$(".practiceButton2").html("中止");
				$("#goToTest").hide();
				$("#info").show()
				$(".correctDiv").css('visibility', 'hidden');
				//$(".correctDiv").hide();
				//
				goNextTimeout=0;
				//
				speechStarted=1;
				//RESET VARS
				currentIscorrect=0;
				currentGap={};
				//
				console.log("test started"+which);
				//Show only current test
				
				if (prevTestNumber!=testNumber) {
					//$(".testBox").hide();
					//$("#testBox"+which).show("fold")
					prevTestNumber=testNumber;
				};
				
				//
				$("#results").show("fold");
			}
			// already testing prior to click
			else{
				$("#results").css("box-shadow", "0px 0px 8px #888888");
				$(".practiceButton2").html("練習");
				testEndTimer=0;
				bar.animate(1.0)
				if (isTest==0) {
					//$(".practiceButton").show();
					$(".questionNumbers").css('visibility', 'visible');
					$(".practiceButton").css('visibility', 'visible');
					$("#goToTest").show();
				}
				else{
					$("#info").hide()
				}
				
				speechStarted=0;
				//$(".testBox").show("fold")
				//
				
				//$("#results").hide("fold");
				//when testing
				if (isTest==1) {
					if(typeof timer_gear == "undefined"){
					  goNextTimeout=window.setTimeout(nextTest, timeAutoChange);
					};
					scoreList.push(currentCorrectRatio);
					testAnswersList.push(final_span.innerHTML)
					console.log("results: ",resultList,currentCorrectRatio);
				};
				if(showRes==1){

					scoreList.push(currentCorrectRatio);
					showTestResult();
				};
			}
		}
		function calculateGap (event) {
			// body...
			//gap calculation
		  	//currentGap += parseFloat(event.results[0][0]["confidence"]);
		  	for (var i = event.resultIndex; i < event.results.length; ++i) {
		  		if (event.results[i].isFinal) {
		  			//currentGap[event.results[0][0]["transcript"]]=
		  			currentGap["transcript"] =
		  			(parseFloat(event.results[0][0]["confidence"]));
	  				//console.log(currentGap);
		  		}

		    }
		    if (currentIscorrect==1) {
		    	 addGap();
		    };
		   
		  	//console.log(parseFloat(event.results[0][0]["confidence"]));
		}

		function addGap () {
			console.log("adding gap");
			//gap =  1.0 confidence rounded to nearest 0.01
			//var gap =Math.round(currentGap["transcript"])/2;

			//rounds to hundreth
    		var gap = Math.ceil(currentGap["transcript"] * 1000) / 1000;
			console.log(gap)
			gap = 1000*(1 - gap);
			//Math.ceil(gap * 100) / 100;
			$("#gap"+testNumber).html(Math.round(gap));
		}
		function colorCorrectWords (num,result,event,isFinal) {
			console.log("coloring",num,result,isFinal)
		  // body...
		  var originalString = $("#sentence"+num).text().toLowerCase();
		  

		  var cleanString = originalString.replace(/[^\w\s]/gi, '');
		  var sentence = cleanString.split(" ");
		  var newHtml = "";

		  result += " "+final_span.innerHTML
		  var resultList = result.replace(/[^\w\s]/gi, '').toLowerCase().split(" ");
		  //Check if all correct
		  var correct = 0;
		  
		  //console.log(sentence,resultList)
		  //remove ""
		  for (var i = sentence.length - 1; i >= 0; i--) {
		  	if(sentence[i]==""){
		  		sentence.splice(i,1);
		  	}
		  };
		  console.log(sentence)
		  for (var i = 0; i < sentence.length; i++) {
		    
		    //console.log(sentence[i]);
		    var index = resultList.indexOf(sentence[i]); 
		    if (index>=0) {
		    	if (i!=sentence.length-1) {
		      		newHtml += "<span class=green>" + sentence[i] + " </span>";
		      	}
		      	//so " " dont add up
		      	else{
		      		newHtml += "<span class=green>" + sentence[i] + "</span>";
		      	}
		      correct +=1;
		    }
		    else{
		    	if (i!=sentence.length-1) {
		    		newHtml +="<span class=red>" + sentence[i] + " </span>";
		    	}
		    	//so " " dont add up
		    	else{
		    		newHtml +="<span class=red>" +  sentence[i] + "</span>";
		    	}
		    }
		  };
		  newHtml=newHtml
		  //console.log(sentence);
		  //console.log(result);
		  //console.log(newHtml);
		  $("#sentence"+num).html(newHtml);
		  //
		  //SHAKE CORRECT WORD                       <--------------------------  NOT DOME
		  //$("#sentence"+num).effect("shake", {distance:2},100);
		  //$(".green").effect("shake", {distance:2},100);

		  //Check  if all correct
		  currentCorrectRatio = parseFloat(correct)/parseFloat(sentence.length);
		  //console.log(parseFloat(correct),parseFloat(sentence.length));
		  console.log(currentCorrectRatio);
		  if (correct>=sentence.length) {
		  	currentIscorrect = 1;
		  	//recognition.onend();   
		  	if (speechStarted==1) {
		  		finishOnCorrect();
		  	};
    			//
    		//window.setTimeout(nextTest(), 6000);
		  	
		 };
		 if (isFinal==1) {
		  		//console.log(correct,"isFinal",result)
		  		//calculateGap(event);
		  		scoreList.push(currentCorrectRatio)
		 };
		  
		}
		function finishOnCorrect () {
			$(".practiceButton2").html("練習");
			alreadyCorrect=1;
			// body...
			if (isTest==1) {
				//$("#correct"+testNumber).show();
				$("#correct"+testNumber).css('visibility', 'visible');
				testAnswersList.push(final_span.innerHTML)
			};
		  	//myOnEnd();

		  	//$("#results").hide("fold");
		  	console.log("finish on correct "+speechStarted);
		  	testActivated(testNumber);
		  	if (isTest==1) {
		  		goNextTimeout=window.setTimeout(nextTest, timeAutoChange);
		  	}
		}
		//ft : final transcript
		function myOnEnd (ft) {
			$(".practiceButton2").html("練習");
			$("#results").css("box-shadow", "0px 0px 8px #888888");
			//
			
			colorCorrectWords(testNumber,final_transcript,1);
			//console.log(testNumber,ft);
			//$("#results").html("");
    		//$("#results").hide("fold");
    		if (isTest!=1) {
    			var result = $("#sentence"+testNumber).html()
    			$("#practiseResult"+testNumber).html("結果："+final_span.innerHTML)
    			$(".practiseResult").hide()
    			$("#practiseResult"+testNumber).show()
    		};
    		if (currentIscorrect==1) {
    			console.log("correct");
    			//if (isTest==1) {
    				//$("#correct"+testNumber).show();
    				$("#correct"+testNumber).css('visibility', 'visible');

    			//};
    													// add to practice results
    													/*
    			if (isTest!=1) {
    				var result = $("#sentence"+testNumber).html()
    				$("#practiseResult"+testNumber).html("結果："+result)
    				$(".practiseResult").hide()
    				$("#practiseResult"+testNumber).show()
    			};
    				*/
		  		//$("#results").hide("fold");
		  		
		  		//testActivated(testNumber);
		  		if (goNextTimeout==0) {
		  			if (isTest==1) {
		  				window.setTimeout(nextTest, timeAutoChange);
		  			};
		  		};
		  		//window.setTimeout(nextTest, timeAutoChange);

    		};
    		showInfo('info_start');
    		

		}
		function changeCurrentTest (which) {
			console.log("change test to "+which);
			//Show only current test
			$(".testBox").hide();
			$("#testBox"+which).show()
			//for mic and speaker
			$(".testBox2").hide();
			$("#testBox2"+which).show()
				//
			//$("#results").show("fold");
			//change current test indicator
			$(".currentTestIndicator").text("Q: "+which + "/" + numTests);
			//
			$(".practiseResult").hide()
			$("#practiseResult"+which).show()
			$(".correctDiv").css('visibility', 'hidden');
			//$(".correctDiv").hide()
			//$("#correct"+which).show()
		}
		function mrdelay (argument) {
			// body...
			testActivated(testNumber);
		}
		function nextTest () {
			if (speechStarted==0) {
				console.log("next test");
				testNumber +=1;
				if (testNumber>numTests) {
					testNumber -=1;
					console.log("already at last test")
				}
				else{
					changeCurrentTest(testNumber);
				};

				//when test automatically start test
				if (isTest==1) {
					if (testNumber<=numTests) {
						//window.setTimeout(mrdelay, 1000);
						testActivated(testNumber);
						if (testNumber==numTests) {
							isTest=0;
							showRes=1;
						};
						
					};	
				};
			};		
		}
		function showTestResult (argument) {
			
			//
			$("#testResult").fadeToggle();
			
			$("#testConfirmBG").fadeToggle();
			//test number and score
			for (var i =0; i < scoreList.length; i++) {
				$("#resultNumber").append(
					"<div class='singleResult'>"+"Q"+(i+1)+": "+Math.round(scoreList[i]*100) + "%" + "</div>"
					);
	
			};
			//average
			var av=0;
			for (var ii = scoreList.length - 1; ii >= 0; ii--) {
					av +=scoreList[ii];
				};
				av /= scoreList.length;
				
				$("#resultNumber").append(
					"<div class='averageResult'>"+"平均: "+Math.round(av*100) + "%" + "</div>"
					);
			//
			var newUserInfo = userRankSystem(Math.round(av*100));
			scoreList=[]
			//$("#resultNumber").text(currentCorrectRatio*100 + "%");
			u = getCookie("username");
			t = getCookie("token");
			// save test score
			if (u&&t) {
				console.log("posting score")
				$.post( "/addresult?score="+Math.round(av*100)+"&nr=" + newUserInfo[0] +"&ne=" + newUserInfo[1]);
			};
			
		}
		function prevTest () {
			if (speechStarted==0) {
				console.log("prev test");
				testNumber -=1;
				if (testNumber<1) {
					testNumber +=1;
					console.log("already at first test")
				}
				else{
					changeCurrentTest(testNumber);
				};
			};
			
		}
	
	/* TOO SLOW

	if (annyang) {
	  // Let's define our first command. First the text we expect, and then the function it should call
	  var commands = {
	    'test': function() {
	      testActivated(1);
	    }
	  };
	  annyang.debug();
	  // Add our commands to annyang
	  annyang.addCommands(commands);

	  // Start listening. You can call this here, or attach this call to an event, button, etc.
	  //annyang.start();
	}
	*/

/*
                                         /$$                                     /$$
                                        | $$                                    |__/
  /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$ | $$  /$$$$$$         /$$$$$$   /$$$$$$  /$$
 /$$__  $$ /$$__  $$ /$$__  $$ /$$__  $$| $$ /$$__  $$       |____  $$ /$$__  $$| $$
| $$  \ $$| $$  \ $$| $$  \ $$| $$  \ $$| $$| $$$$$$$$        /$$$$$$$| $$  \ $$| $$
| $$  | $$| $$  | $$| $$  | $$| $$  | $$| $$| $$_____/       /$$__  $$| $$  | $$| $$
|  $$$$$$$|  $$$$$$/|  $$$$$$/|  $$$$$$$| $$|  $$$$$$$      |  $$$$$$$| $$$$$$$/| $$
 \____  $$ \______/  \______/  \____  $$|__/ \_______/       \_______/| $$____/ |__/
 /$$  \ $$                     /$$  \ $$                              | $$          
|  $$$$$$/                    |  $$$$$$/                              | $$          
 \______/                      \______/                               |__/          
*/
/*
  window.___gcfg = { lang: 'en' };
  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
*/


var langs =
[
 ['English',  ['en-US']],
];


for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 0;
updateCountry();
select_dialect.selectedIndex = 0;
showInfo('info_start');

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  //start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    showInfo('info_speak_now');
    //start_img.src = '/intl/en/chrome/assets/common/images/content/mic-animate.gif';
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      //start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      //start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
    testActivated(testNumber)
  };

  recognition.onend = function() {

    recognizing = false;
    if (ignore_onend) {
      return;
    }
    //start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
    if (create_email) {
      create_email = false;
      createEmail();
    }
    //
    // my script
    //
    myOnEnd(final_transcript);
  };

  recognition.onresult = function(event) {

  	//
    var interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      upgrade();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);

    if (final_transcript || interim_transcript) {
      //showButtons('inline-block');
    }
    //
  	colorCorrectWords(testNumber,interim_transcript,event,0);  /// MY CODE
    
    
  };
}
////////////////////////////////
	function upgrade() {
	  start_button.style.visibility = 'hidden';
	  showInfo('info_upgrade');
	}

	var two_line = /\n\n/g;
	var one_line = /\n/g;

	function linebreak(s) {
	  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
	}

	var first_char = /\S/;
	function capitalize(s) {
	  return s.replace(first_char, function(m) { return m.toUpperCase(); });
	}

	function startButton(event) {
	  if (recognizing) {
	    recognition.stop();
	    return;
	  }
	  final_transcript = '';
	  recognition.lang = select_dialect.value;
	  recognition.lang = "en-US"
	  recognition.start();
	  ignore_onend = false;
	  final_span.innerHTML = '';
	  interim_span.innerHTML = '';
	  //start_img.src = '/intl/en/chrome/assets/common/images/content/mic-slash.gif';
	  showInfo('info_allow');
	  //showButtons('none');
	  //start_timestamp = event.timeStamp;
	}

	function showInfo(s) {
	  if (s) {
	    for (var child = info.firstChild; child; child = child.nextSibling) {
	      if (child.style) {
	        child.style.display = child.id == s ? 'inline' : 'none';
	      }
	    }
	    info.style.visibility = 'visible';
	  } else {
	    info.style.visibility = 'hidden';
	  }
	}

	var current_style;

	/*
	function showButtons(style) {
	  if (style == current_style) {
	    return;
	  }
	  current_style = style;
	  copy_button.style.display = style;
	  email_button.style.display = style;
	  copy_info.style.display = 'none';
	  email_info.style.display = 'none';
	}
	*/
