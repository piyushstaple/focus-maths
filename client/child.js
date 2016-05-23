
Session.setDefault("year","1");
Session.setDefault("tempyear","1");

/*if(typeof(Session.get("questionno"))=="undefined")
{*/
Session.setPersistent("questionno",0);
Session.setPersistent("correctanswers",0);
Session.setPersistent("quesserno",0);



/*}*/

/**** Setting the year and skills of the user in the session *****/



/*if(typeof(userData.profile.year)!="undefined")
{
	
	//Session.set("userYear",userData.profile.year);
	//Session.set("userskills",userData.profile.skills);
}
*/

Template.childdashboard.onRendered(function()
{

	Meteor.setTimeout(function()
	{
		

	$(".mCustomScrollbar").mCustomScrollbar({
					theme:"minimal"
				});

	var userYear=2 // need to get from the collection mean while i added the static value to make the logic work
	var mastered=0;
	var started=0;
	
	var testData=tests.find({'year_group':userYear}).fetch();
	
	var totalTests=testData.length;

	for(i=0;i<testData.length;i++)
	{
		var testResultData=testResults.find({'test_id':testData[i]._id}).fetch();

		if(testResultData.length==1)
		{
			//checked user given the test single time or multiple times
			if(testResultData[0].isMastered==1)
			{
				mastered++;
			}
			else                                                                                                                                                  
			{
				started++;
			}
		}
		else if(testResultData.length>1)
		{
			var correct=0;
			for(j=0;j<testResultData.length;j++)
			{
				if(testResultData[j].isMastered==1)
				{
					correct=1;		
					break;
				}	
			}

			if(correct) mastered++;
			else started++;

		}

	}


	var notstarted=totalTests-(mastered+started);
	var startedPer=(started/totalTests)*100;
	var notstartedPer=(notstarted/totalTests)*100;
	var masterdPer=(mastered/totalTests)*100;
	

/*	var chart = AmCharts.makeChart( "skill-level-chart", {
			  "type": "pie",
			  "theme": "light",
			  "color":"#626262",
			  "fontSize":"12",
			  "dataProvider": [ {
			  "title": "Not Started",
			  "value": notstarted,
			  "labeltext": "Not Started "+notstartedPer+"%"
			  }, {
			    "title": "Started",
			    "value": started,
			  "labeltext": "Started "+startedPer+"%"
			  } ,  {
			    "title": "Mastered",
			    "value": mastered,
			  "labeltext": "Mastered "+masterdPer+"%"
			  }
			  ],
			  "titleField": "title",
			  "valueField": "value",
			  "labelRadius": 5,

			  "radius": "42%",
			  "innerRadius": "50%",
			  "labelText": "[[labeltext]]",
			  "export": {
			    "enabled": true
			  }
			} );
*/

},500);

});

Template.childmenu.helpers({

	'menus':function()
	{
		// Get unique tests from tests collection to show in child menu
		var uniqueTests= (tests.find({}).fetch());

		var testReport=[];
		for(j=0;j<uniqueTests.length;j++)
		{
			var testDetail={};
			var testId = uniqueTests[j]._id;
			var testName = uniqueTests[j].testname;

			testDetail.href='/testquestions/'+testId;
			testDetail.testid=testId;
			testDetail.title=testName;
			testDetail.class="testypes"
			testReport.push(testDetail);
		}

		// Menu to be shown in child section
		var menuOptions=[{href:"/childdashboard",title:"Dashboard",class:"flaticon-tool"},{href:"",title:"Tests",class:"flaticon-symbol",submenus:testReport},{href:"/childselectskills",title:"Select Skills",class:"flaticon-graphic"},{href:"/childpastreports",title:"Past Tests and reports",class:"flaticon-business"},{href:"/childbadges",title:"Badges and Certificates",class:"flaticon-star"},{href:"/profile",title:"Profile",class:"flaticon-social-1"},{href:"",title:"Logout",class:"flaticon-symbol-1"}];

		var selectedHref=Router.current().route.path(this);

		// Create menu Html
		var menuHtml="";
        for(i=0;i<menuOptions.length;i++)
        {

        	menuHtml+='<li><a href="'+menuOptions[i].href+'"';

        	if(menuOptions[i].title=="Logout")
        	{
        		menuHtml+='class="logout"';	
        	}
        	else
        	{
        		if(selectedHref==menuOptions[i].href)
        		{
        			menuHtml+='class="dashboard-link-hover"';
        		}
        		else
        		{
        			
        			if(menuOptions[i].submenus!=undefined)
        			{
        				for(var j=0;j<menuOptions[i].submenus.length;j++)
        				{
        					if(selectedHref==menuOptions[i].submenus[j].href)
        					{
        						menuHtml+='class="dashboard-link-hover"';
        						break;	
        					}
        				}
        			}

        			
           	}
           	}

        		menuHtml+='><i class="'+menuOptions[i].class+'">';

        	if(menuOptions[i].title=="Memberships" || menuOptions[i].title=="Help")
        	{
				menuHtml+='<img src="'+menuOptions[i].img+'">';        		
        	}

        	menuHtml+='</i><span>'+menuOptions[i].title+'</span></a>';



        	if(menuOptions[i].submenus!=undefined)
        	{
        		menuHtml+='<ul class="dropdown">';

        		for(var j=0;j<menuOptions[i].submenus.length;j++)
        		{
        			
        			menuHtml+='<li><a href="'+menuOptions[i].submenus[j].href+'"';

        			if(typeof(menuOptions[i].submenus[j].class)!="undefined")
        							menuHtml+= 'class="'+menuOptions[i].submenus[j].class+'" id="'+menuOptions[i].submenus[j].testid+'"';

        			menuHtml+='>'+menuOptions[i].submenus[j].title+'</a></li>';

        		}
				menuHtml+='</ul>';

        	}

        	menuHtml+='</li>';	

        }   
        	return menuHtml;	

	}

});

Template.childmenu.events({

	"click .logout":function(event)
	{
		event.preventDefault();
		Meteor.logout();
		Router.go("/childlogin");
	},

	'click .testypes':function(event)
	{
		event.preventDefault();

		// clear the localstorage for the timer of test

		localStorage.removeItem("timer");	
		
		var userData=Meteor.users.findOne({"_id":Meteor.userId()});
		var userYear=0;
		var skills=[];
		var testId=event.currentTarget.id;

		console.log("user data is");
		console.log(userData);	

	if(typeof(userData.profile.skills)!="undefined")
	{
			userYear=userData.profile.year;
			skills=userData.profile.skills;
			
			var randomIndex=Math.floor(Math.random()*skills.length);
			var selectedSkill=skills[randomIndex];

			Session.setPersistent("skill",selectedSkill);

			
			if(selectedSkill!="division")
					return false;

	
			if(typeof(userData.profile.skillsproficiency)!="undefined")
			{
				var skillsproficiency=userData.profile.skillsproficiency;



				for(i=0;i<skillsproficiency.length;i++)
				{
					if(skillsproficiency[i].skill==selectedSkill)
					{
						console.log("Working here");
						Session.setPersistent("difficultylevel",skillsproficiency[i].difficultylevel);
						Session.setPersistent("proficiency",skillsproficiency[i].proficiency);			
						break;		
					}
				}

			
			}	
			else
			{
				Session.setPersistent("difficultylevel",0);
				Session.setPersistent("proficiency",0);
			}	 	

		
		console.log(Session.get("difficultylevel"));
		console.log(Session.get("proficiency"));		


		var questionsData=questions.find({'year_group':userYear,'skill':{$regex: new RegExp('^' + selectedSkill.toLowerCase(), 'i')}},{type_of_test:{$elemMatch:{testId:testId}}}).fetch();
		
	
		//stroed the questions into temprory collection 
		Session.setPersistent("testId",testId);

	/*	console.log("question data is ");
		console.log(questionsData);

		return;*/

		console.log("questionsData is");
		console.log(questionsData);


		Meteor.call("storeQuestion",Meteor.userId(),testId,questionsData,function(err,result)
		{
				if(!err)
				{
					console.log(result);
					Router.go("/testquestions");
				}

			});

		}
		else
		{
			Router.go("/childselectskills");
		}

	
	}


});

Template.childpasttest.helpers({
	'testData': function()
	{
		var currentTestId=Router.current().params.testId
		return ReactiveMethod.call('testDetails',currentTestId);
	}
});

Template.childlogin.events({

 "submit .login-form":function(event)
 {
 	event.preventDefault();
 	
 	var isexist=Meteor.users.findOne({"username":event.target.email.value});

 	if(typeof(isexist)!="undefined")
 	{

	 	var userType=Meteor.users.findOne({"username":event.target.email.value}).profile.user_type;	


		 	if(userType=="a")
			{
					alert("You can't login admin in child dashboard");
					return false;
			}
			else if(userType=="p")
			{
					alert("You can't login parent in child dashboard");
					return false;
			}

	}

 	Meteor.loginWithPassword(event.target.email.value,event.target.password.value,function(err)
	{
			console.log(err);
			if(!err)
			{
				
				Router.go('childdashboard');	
				
			}
			else
			{
				$(".error-msg").text("User name or password do not match").fadeIn(2000).fadeOut(1000);	
			}			
	});

 }


})


Template.childdashboard.helpers({

	'getPointDetails':function()
	{
		var pointsData=ReactiveMethod.call('getPointDetails',Meteor.userId());
		
		console.log("point data is");
		console.log(pointsData);
		return pointsData[0].acheivements;
	},

	'suggestedSkills':function()
	{
		var userYear=2; // need to get the userYear for the current user	
		
		var testCount=tests.find({'year_group':userYear}).count();
	
		var testResultData=testResults.find({'year_group':userYear}).fetch();

		var masteredresults=testResults.find({'isMastered':1,'year_group':userYear}).fetch();

		var masterCount=masteredresults.length;

		var masteredIds=[];

		for(var i=0;i<testResults.length;i++)
		{
			masteredIds.push(testResults[i]._id);
		}

		var masterNotCount=testResults.find({'isMastered':0,'year_group':userYear,'_id':{$nin:masteredIds}}).count();
		

		var skillsListing="";
		if(testCount==0)
		{
			var  skillsData=tests.find({},{limit:3}).fetch();
			 for(var i=0;i<skillsData.length;i++)
			{
				skillsListing+="<li><span>"+skillsData[i].testname+"</span></li>";	
			}
				
		}
		else if(testCount==masterCount)
		{
			skillsListing="<li><span>You have mastered the Math for the Year 2, we recommend you to begin with the next academic year</span></li>";
				
		}
		else
		{
			
			
		
			var skillsData=testResults.find({'isMastered':0,'year_group':userYear},{limit:3,sort:{'points':1}}).fetch();
			var skillsIds=[skillsData[0].test_id,skillsData[1].test_id,skillsData[2].test_id];
			skillsData=tests.find({'_id':{$in:skillsIds}}).fetch();
			var limit=3;
			for(var i=0;i<skillsData.length;i++)
			{
				skillsListing+="<li><span>"+skillsData[i].testname+"</span></li>";	
				limit--;
			}

			if(limit)
			{
				var  skillsData=tests.find({'_id':{$nin:skillsIds}},{limit:limit}).fetch();
				for(var i=0;i<skillsData.length;i++)
				{
					skillsListing+="<li><span>"+skillsData[i].testname+"</span></li>";	

				}	

			
			}	
			
			
		}

		return skillsListing;

		
	}


});

Template.childpastreports.helpers({

	'getTableHeading':function()
	{
		var sortcols=[{key:'testname',val:'Test Name'},{key:'testtype',val:'Test Type'},{key:'Qs answered',val:'Qs answered'},{key:'% Correct',val:'% Correct'},{key:'points',val:'Points'},{key:'Last login',val:'Last login'},{key:'Last login',val:'Last login'}]

		if(Session.get('sortData')!=undefined)
		{
			var heading="";	
			var sortData=JSON.parse(Session.get('sortData'));	

			for(var i=0;i<sortcols.length;i++)
			{
				if(sortcols[i].key=='testname' || sortcols[i].key=='testtype' || sortcols[i].key=='points')
				{
					heading+='<th class="testsort" datasort="'+sortcols[i].key+'">'+sortcols[i].key+'<span>';



					if(sortData.colName==sortcols[i].key)
					{

						if(sortData.val==1)
								heading+='<img src="images/down-arw.png">';
							else	
								heading+='<img src="images/uparrow.png">';

					}	

					heading+='</span></th>';

				}	
				else
				{
					heading+="<th>"+sortcols[i].val+"</th>";
				}
			}

			return heading;
		}

		return '<th class="testsort" datasort="testname">Test Name</th><th class="testsort" datasort="testtype">Test Type</th><th>Qs answered</th><th>% Correct</th><th class="testsort" datasort="points">Points</th><th>Last login</th><th>Proficiency</th>';


	},	


	'getTestReports':function()
	{
		var testResultData="";
		if(Session.get("sortData")!=undefined)
		{
	
			var sortData=JSON.parse(Session.get("sortData"));
			testResultData=ReactiveMethod.call('getTestReports',Meteor.userId(),sortData.colName,sortData.val);

		}
		else
		{
			 testResultData=ReactiveMethod.call('getTestReports',Meteor.userId(),'','');
			
		}	
		
		console.log("resultDatais");
		console.log(testResultData);
		return testResultData;
	}


});

Template.childpastreports.events({

	"click .testname":function(event)
	{
		event.preventDefault();
		Router.go("/testdetails/"+event.currentTarget.id);
		console.log("Current element id "+event.currentTarget.id);	

	},

	"click .testsort":function(event)
	{
		event.preventDefault();
		var sort="";
		if(Session.get("sortData")!=undefined)
		{
			sort=JSON.parse(Session.get('sortData'));
			if(sort.colName==event.currentTarget.attributes.datasort.value)
			{
					var objVal=sort.val;
					
					if(sort.val==1)
							sort.val=-1;
					else
							sort.val=1;
			}
			else
			{

				sort={};	
				sort.colName=event.currentTarget.attributes.datasort.value;
				sort.val=1;

			}
					
		}
		else
		{
			sort={};	
			sort.colName=event.currentTarget.attributes.datasort.value;
			sort.val=1;
						
		}	

		
		Session.set("sortData",JSON.stringify(sort));
		console.log(sort);
	}



})

Template.testdetails.helpers({

	'testResultDetails':function()
	{	
		var testResultId=Router.current().params._id;

		var resultData=ReactiveMethod.call("testResultDetails",testResultId);
		return resultData;			
	},

	'testbasicDetail':function()
	{
		var testResultId=Router.current().params._id;	
		var testData=ReactiveMethod.call("testbasicDetail",testResultId);
		return testData;
	},

	'checksrno':function(srno)
	{
		if(srno%2==0)
			return "dont-match-num";

		return "";
	}


});


Template.subscriptiondetail.onRendered(function()
{
	Meteor.setTimeout(function()
	{
				$(".mCustomScrollbar").mCustomScrollbar({
					theme:"minimal"
				});

	},200);

});

Template.subscriptiondetail.helpers({

	'expiryMonths':function()
	{
		var options="<option value=''>--Select Month--</option>";
		var month=0;
		for(var i=1;i<=12;i++)
		{
			month=("0"+i).slice("-2");
			options+="<option value='"+i+"'>"+ month +"</option>";
		}

		return options;
	},

	'expiryYears':function()
	{
		var d=new Date();
		var currentYear=d.getFullYear();
		var options="<option value=''>--Select Year--</option>";
		for(i=1;i<=15;i++)
		{
			
			options+="<option value='"+i+"'>"+ currentYear +"</option>";
			currentYear+=1;

		}
		
		return options;
	}

});

Template.subscriptiondetail.events({

	"keyup .cardno":function(event)
	{
		event.preventDefault();

	if($(".cardno").val().length>19)
	{

		$(".cardno").val($(".cardno").val().slice(0,19));
	}
	else
	{	
		if($.inArray($(".cardno").val().length,[4,9,14,19])>=0)
		{
			$(".cardno").val($(".cardno").val()+"-");	
		}

		
	}

	}

});


Template.billingdetails.onRendered(function()
{
	Meteor.setTimeout(function()
	{
				$(".mCustomScrollbar").mCustomScrollbar({
					theme:"minimal"
				});

	},500);

});







Template.testquestions.helpers({

'questionData':function()
{
	
	/*** Getting the current year and skills of the user ****/
	var quesno =Session.get("questionno");
	var questionData="";
  	var testId="";
	
	 if(quesno==0)
	 { 
			var userId=Meteor.userId();
			questionData=tempCollection.findOne({'userId':userId});
			testId=questionData.testId;
			questionsData=questionData.questionsData;
		
			/****  check question randomized ***/
			var testsData=tests.findOne({"_id":testId});
			
			console.log("question rand is "+ testsData.quesrand);

			if(testsData.quesrand=="y")
			{
				// if user set test randomized.. the following code randomized the question ids	
				var j,temp;
				for(i=1;i<questionsData.length;i++)
				{

					var j=Math.floor(Math.random()*i)
					temp=questionsData[i];
					questionsData[i]=questionsData[j];
					questionsData[j]=temp;
				}
			}

				
			
			var dQuestions=[];
			for(i=0;i<questionsData.length;i++)
			{
				console.log(questionsData[i].difficulty_level);
				switch(questionsData[i].difficulty_level)
				{
					case '1':
						if(!(dQuestions[0] instanceof Array))
							dQuestions[0]=[];

						dQuestions[0].push(questionsData[i]);
					break;

					case '2':
						if(!(dQuestions[1] instanceof Array))
							dQuestions[1]=[];

						dQuestions[1].push(questionsData[i]);
					break;
					
					case '3':	
						console.log("questionlevel is 3");
						if(!(dQuestions[2] instanceof Array))
							dQuestions[2]=[];
						dQuestions[2].push(questionsData[i]);
					break;	
				}
			}



			questionsData=dQuestions;
				
			console.log("question data is ");
			console.log(questionsData);	


			Session.setPersistent("questionData",JSON.stringify(questionsData));
	  		Session.setPersistent("testId",testId);
	  		Session.setPersistent("starttime",$.now());
	  		Session.setPersistent("no_of_question",testsData.no_of_questions)
	  }
	  else
	  {
	  		questionsData=JSON.parse(Session.get("questionData"));
	  		testId=Session.get("testId");
	  }

	
	var testsData=tests.findOne({"_id":testId});

	questionsData=questionsData[Session.get('difficultylevel')][quesno];
	
	
	if(testsData.answerrand=="Y")
	{
	 	/*** Answer randomized **/
	 	var options=questionsData.options;
	 	var j,temp;
		
		for(i=1;i<options.length;i++)
		{
			var j=Math.floor(Math.random()*i)
			temp=options[i];
			options[i]=options[j];
			options[j]=temp;
		}

		questionsData.options=options;
	 }	

	questionsData.srno=Session.get("quesserno")+1;
	console.log("test id is "+testId);			
	
	return questionsData;

},

'testTime':function()
{
	// return the total time for the test

	if(typeof(Session.get("testtime"))=="undefined")
	{
		var test=tests.findOne({"_id":Session.get("testId")})
		return test.timelimit;
	}
	
},

'timeupdate':function(min , seconds)
{
	console.log(min+ "   "+seconds);

},

'questionOptions':function(options)
{
	var optionsHtml="";
	var optionSeq=['A','B','C','D'];
	for(var i=0;i<options.length;i++)
	{
		optionsHtml+='<li><input type="radio" name="answer" value="'+options[i]+'"> <label>'+optionSeq[i]+'. '+options[i]+'</label></li>';
	}

		return optionsHtml;
 },


});

Template.testquestions.events({

	"click #nextquestion":function(event)
	{
		

		event.preventDefault();
		var proficiencyLevels1=[{'level':"12.50%"},{'level':"45.83%"},{'level':"79.17%"}]
		var proficiencyLevels2=[{'level':"33.33%"},{'level':"66.67%"},{'level':"100%"}]
		
		var quesno =Session.get("questionno");
	
		var userAnswer=$("[name='answer']:checked").val();
		var questionId=$("#quesid").val();

		var testId=Session.get("testId");
		questionsData=JSON.parse(Session.get("questionData"));
	  	var noof_question=Session.get("no_of_question");
	  	questionsData=questionsData[Session.get('difficultylevel')][quesno];	
	  	
	   var 	quesserno=parseInt(Session.get("quesserno"))+1  
	
	   Session.set("quesserno",quesserno);

		/** Evaluate user answer for question.***/
		
		var userAnswer=$("[name='answer']:checked").val();
		var questionId=$("#quesid").val();
		var correctanswer=0;
		var points=0;



		if(typeof(userAnswer)=="undefined")
		{
			correctanswer=2; //set the status 2.. if user not answered the question
			Session.set("correctanswers",0);
		}
		else
		{
			if($.inArray(userAnswer,questionsData.answerVals)>=0)
			{	
				correctanswer=1; //set the status 1 for the right answer
				Session.set("correctanswers",parseInt(Session.get('correctanswers'))+1);			
				points=questionsData.points;
			}
			else
			{
				Session.set("correctanswers",0);
			}	

		}



		var questionData={'userAnswer':userAnswer,'points':points,'questionId':questionId,'testId':testId,'userId':Meteor.userId(),'correctanswer':correctanswer,'reportError':$("#report_error").is(":checked"),'userRating':$(".current-rating").attr('data-stars')};

	
		Meteor.call('insertTempData',questionData,function(err,result)
		{
			console.log(err);	
			if(!err)
			{
					console.log(result);

			}		

		});

	Meteor.setTimeout(function()
	{
	//adding some delay for fetching the records //

	console.log(quesserno);
	console.log(noof_question);

	if(noof_question==quesserno || $("#timeover").val()=="1")
	{
		if(Session.get('correctanswers')==5)
		{
				
				if(Session.get("difficultylevel")<=3)
				{
					var proficiency=proficiencyLevels2[Session.get("difficultylevel")].level;
					Session.setPersistent("proficiency",proficiency);
					Session.setPersistent("difficultylevel",parseInt(Session.get("difficultylevel"))+1);
				}
				quesno=0;
		}
		else if(Session.get('correctanswers')==3)
		{
				var proficiency=proficiencyLevels1[Session.get("difficultylevel")].level;
				Session.setPersistent("proficiency",proficiency);
			
		}


		   var tempData=tempResults.find({'userId':Meteor.userId(),'testId':testId}).fetch();
	       var points=0;
	       var questionAnswers=[];
	       var questionAnswered=0;
	       var correctAnswers=0;
	       for(var i=0;i<tempData.length;i++)
	       {
	          
	          questionAnswers.push({'questionId':tempData[i].questionId,'answer':tempData[i].userAnswer,'userRating':tempData[i].userRating,'reportError':tempData[i].reportError,'correct':tempData[i].correctanswer});
       			
	       		
	       		if(tempData[i].correctanswer!=2)
	       		{
	       			questionAnswered++;
	       			if(tempData[i].correctanswer==1)
	       			{
	       				correctAnswers++;

	       				points+=parseInt(tempData[i].points);
	       				console.log("correct answer");
	       			}
	       		}
	       }

	  
	    // Adding the test result into testresult collection and remove it from the temp collection *

	   	var minutes=parseInt(($.now()-parseInt(Session.get('starttime')))/1000/60);
	   	var seconds=parseInt(($.now()-parseInt(Session.get('starttime')))/1000%60);

	    	var testResultData={'user_id':Meteor.userId(),'test_id':testId,'question_answered':questionAnswered,'points':points,'createdAt':$.now(),'correctAnswer':correctAnswers,'testname':"",'testtype':"",'questionAnswers':questionAnswers,'testTimeTaken':minutes+ " min "+ seconds+ " sec",'no_of_question':noof_question}

		

		Meteor.call("insertResulttest",testResultData,function(err,result)
		{


			if(!err)
			{
				
					var testresultId=result;	
					Meteor.call("removeTempCollection",Meteor.userId(),testId,function(err,result)
					{
						if(!err)
						{
							var data={'proficiency':Session.get("proficiency"),'difficultylevel':Session.get("difficultylevel"),'skill':Session.get("skill")}
							
							Meteor.call("userProficiencyupdate",Meteor.userId(),data,function(err,result)
							{
								if(!err)
								{
									console.log(result);
								}
							});

							console.log(result);
							Session.delete('questionData');
							Session.delete('questionno');
							Session.delete('difficultylevel');
							Session.delete('proficiency');
							Session.delete('correctanswers');
							Session.delete('quesserno');
							
							Router.go("/testsummary/"+testresultId);
						}
					});	
			}

		});	

		/*** Delete the tempory collection result ****/
		
		
				
		}
		else
		{
			
			

			$(".stars").removeClass('current-rating');
			$("#report_error").attr('checked',false);

			if(Session.get('correctanswers')==5)
			{
				
				if(Session.get("difficultylevel")<=3)
				{
					var proficiency=proficiencyLevels2[Session.get("difficultylevel")].level;
					Session.setPersistent("proficiency",proficiency);
					Session.setPersistent("difficultylevel",parseInt(Session.get("difficultylevel"))+1);
				}

			
				/*quesno=0;
				Session.set("correctanswers",0);*/
			}
			else if(Session.get('correctanswers')==3)
			{
				var proficiency=proficiencyLevels1[Session.get("difficultylevel")].level;
				Session.setPersistent("proficiency",proficiency);
				quesno++;
			
			}
			else
			{
				quesno++;
				
			}
			

			Session.setPersistent("questionno",	quesno);
			Session.set("quesserno",quesserno);
		}	

		
	},100);
	
	}

});


Template.testsummary.onRendered(function()
{
	Meteor.setTimeout(function()
	{

		$(".mCustomScrollbar").mCustomScrollbar({
					theme:"minimal"
				});

	},1000);

});


Template.testsummary.helpers({

	'resultDetails':function()
	{
		var resultId=Router.current().params.testid;
		var resultData=testResults.findOne({"_id":resultId,"user_id":Meteor.userId()});

		var incorrectAnswers=resultData.no_of_question-resultData.correctAnswer;
		var accuracy=parseInt((resultData.correctAnswer/resultData.no_of_question)*100);
		var resultDetails={
			'testTimeTaken':resultData.testTimeTaken,
			'correctAnswers':resultData.correctAnswer,
			'incorrectAnswers':incorrectAnswers,
			'points':resultData.points,
			'accuracy':accuracy,
		}

		return resultDetails;
	},

	'corrections':function()
	{
		var resultId=Router.current().params.testid;
		var resultData=testResults.findOne({"_id":resultId});
		var questionAnswers=resultData.questionAnswers;
		
		var incorrectQues=[];

		for(var i=0;i<questionAnswers.length;i++)
		{
			if(questionAnswers[i].correct==2 || questionAnswers[i].correct==0)
				incorrectQues.push(questionAnswers[i].questionId);
		}		
	
		questionDetails=questions.find({"_id":{$in:incorrectQues}}).fetch();

		return questionDetails
	},

	'correctAnswer':function(answer)
	{
		return answer.join(", ");

	}
});


Template.childselectskills.helpers({

	'skills':function()
	{

		var userData=Meteor.users.findOne({"_id":Meteor.userId()})	
		var year='';
		var userskills=[];
		if(typeof(userData.profile.year)=="undefined" || Session.get("year")!=Session.get("tempyear"))
		{
			year=Session.get("year");
			
		}
		else
		{
			year=userData.profile.year;
			userskills=userData.profile.skills;
			Session.set("year",year);
			Session.set("tempyear",year);
		}


		var questionsData=questions.find({'year_group':year}).fetch();

	
		var skillsHtml=""
		var skills=[];	
		for(var i=0;i<questionsData.length; i++)
		{
			if($.inArray(questionsData[i].skill,skills)<0)
			{
				skillsHtml+='<tr><td>'+questionsData[i].skill+'</td><td><img src="images/red-cross.png"></td><td><span class="prof-red prof-circle"></span></td><td><input type="checkbox" name="selectskill" value="'+ questionsData[i].skill+'"';

				if($.inArray(questionsData[i].skill,userskills)>=0)
				{
					skillsHtml+=' checked';
				}

				skillsHtml+='></td></tr>';
			}

	
			skills.push(questionsData[i].skill)
		} 


			
		return skillsHtml;
	
	},

	'yearlisting':function()
	{
		var yearsHtml=""
		var userData=Meteor.users.findOne({"_id":Meteor.userId()})	
		var year='';
		if(typeof(userData.profile.year)!="undefined")
		{
			year=userData.profile.year;
			
		}
		for(i=1;i<=6;i++)
		{
			yearsHtml+='<option value="'+i+'"';

			if(i==year)
				yearsHtml+=" selected ";

			yearsHtml+='>Year '+i+'</option>';
		
		}

		return yearsHtml;
	}
});


Template.childselectskills.events({

	'click #selectall':function(event)
	{
		
		if($("#selectall").is(":checked"))
		{
			$('[name="selectskill"]').each(function() { 
					this.checked=true;
			 });		
		}
		else
		{
			$('[name="selectskill"]').each(function() { 
					this.checked=false;
			 });	
		}

		//$('[name="selectskill"]').attr('checked',true)

	},

	'change .year':function(event)
	{
		var selectYear=	$(".year").val();
		Session.set("year",selectYear);
		console.log("selected year is "+ selectYear);
	},

	'submit .set-year-form-out':function(event)
	{
		event.preventDefault();

		var year=$("[name='year']").val();

		var selectedSkills=[];
		$("[name='selectskill']:checked").each(function()
		{
			selectedSkills.push(this.value);

		});

		console.log("Select values are");

		Meteor.call("updateSkillInfo",{'userId':Meteor.userId(),'skills':selectedSkills,'year':year},function(err,result)
		{
			if(!err)
			{
				alert("you saved skils successfully");	
				console.log(result);
			}

		});

	}


})

/********************* Global Template Helpers for the all the templates. You can use it any template **/

Template.registerHelper("paginationPages",(collectioName) =>{

	console.log("in the global template");
	return string.toUpperCase();	
});



Template.registerHelper("userName",() => {

	if(Meteor.user().profile.first_name.length>=9)
	{
			
		return Meteor.user().profile.first_name.slice(0,6)+"..";
	}	
		return Meteor.user().profile.first_name;
});


