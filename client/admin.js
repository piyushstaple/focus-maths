	Template.adminlogin.onRendered(function()
{

	
	$(".login-form").validate({
		
			rules:{
					email:{
							required:true,
						  },
					password:{
							required:true,
						  }
					  	
			    },
			    
		   messages:{
			
			  email:
					{
						required:"email required"
				    },
			  password:
				  {
					  required:"password required"
				  }
			 }		
	});

		
	
});




Template.adminlogin.events({
	
	
	"submit .login-form":function(event)
	{
		event.preventDefault();

		var isexist=Meteor.users.findOne({"profile.email":event.target.email.value});

		if(typeof(isexist)!="undefined")
		{

			var userType=Meteor.users.findOne({"profile.email":event.target.email.value}).profile.user_type;																													
			
			if(userType=="p")
			{
				alert("You can't login parent in admin dashboard");
				return false;
			}
			else if(userType=="c")
			{
				alert("You can't login child in admin dashboard");
				return false;
			}

		}		

		Meteor.loginWithPassword(event.target.email.value,event.target.password.value,function(err)
		{
			console.log(err);
			if(!err)
			{
				
				Router.go('admindashboard');	
				
			}
			else
			{
				$(".error-msg").text("User name or password do not match").fadeIn(2000).fadeOut(1000);	
			}			
		});
		
	},


	
});

Template.adminmenu.helpers({



 'menus':function()
 {
 	var menuOptions=[{href:"/admindashboard",title:"Dashboard",class:"flaticon-tool"},{href:"/questionbank",title:"Ques. Bank",class:"flaticon-symbol",submenus:[{href:"/createquestion",title:"Create new question"}]},{href:"",title:"Manage Members",class:"flaticon-people-1"},{href:"/testtype",title:"Type of Tests",class:"flaticon-student"},{href:"/admingamrification",title:"Gamification",class:"flaticon-star",submenus:[{href:"",title:"Badges"},{href:"",title:"Levels"},{href:"",title:"Certificates"}]},{href:"",title:"Reports",class:"flaticon-business-1"},{href:"/adminmanagement",title:"Management",class:"flaticon-people-4",submenus:[{href:"",title:"Admin"},{href:"",title:"Payment System"},{href:"",title:"Communications"}]},{href:"/profile",title:"Profile",class:"flaticon-people-5"},{href:"",title:"Logout",class:"flaticon-symbol-1"}];


		var selectedHref=Router.current().route.path(this);
		var menuHtml="";
        for(i=0;i<menuOptions.length;i++)
        {

        	menuHtml+='<li><a href="'+menuOptions[i].href+'"';

        	if(menuOptions[i].title=="Logout")
        	{
        		menuHtml+='class="adminlogout"';	
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
        			menuHtml+='<li><a href="'+menuOptions[i].submenus[j].href+'">'+menuOptions[i].submenus[j].title+'</a></li>';

        		}
				menuHtml+='</ul>';

        	}

        	menuHtml+='</li>';	
        	
        	

        }   
        

        	return menuHtml;	

 }


})


Template.adminmenu.events({

	"click .adminlogout":function(event)
	{
		event.preventDefault();
		console.log("Working");
		Meteor.logout();
		Router.go("/adminlogin");

	}
});


Template.settings.helpers({

	'profiledata':function()
	{
	    	return ReactiveMethod.call('profileinfo',Meteor.userId());
		 
	}

});

Template.settings.events({

	'submit .login-form':function(event)
	{
		event.preventDefault();
		var user={
			'user_id':Meteor.userId(),
			'first_name':event.target.first_name.value,
			'last_name':event.target.last_name.value,
			'email':event.target.email.value
		};
		
		

		Meteor.call('updateadminProfile',user,function(err,result)
		{
			console.log(err);	
			if(!err)
			{
				alert("Profile Update Sucessfull");		
			}

		});

	}


});



Template.createquestion.onRendered(function()
{
	/*** Setting the autocomplete for the create question fields  ******/

	var cursorResult=questionOptions.find({}).fetch();
	var years=cursorResult[0].year_group;
	var strand=cursorResult[0].strand;
	var skills=cursorResult[0].skill;

	Meteor.setTimeout(function()
	{

			$( "[name='year_group']" ).autocomplete({
				source: years
			}).focus(function(){            
				$("[name='year_group']").autocomplete('search', $("[name='year_group']").val());
			});
			
			$( "[name='strand']" ).autocomplete({
				source: strand
			}).focus(function(){            
				$("[name='strand']").autocomplete('search', $("[name='strand']").val());
			});

			$( "[name='skill']" ).autocomplete({
				source: skills
			}).focus(function(){            
				$("[name='skill']").autocomplete('search', $("[name='skill']").val());
			});
		

			
	},1000);



	jQuery(".editor-outer").froalaEditor({enter: $.FroalaEditor.ENTER_BR})	;
	$(".mCustomScrollbar1").mCustomScrollbar({
					theme:"minimal"
				});
});


Template.createquestion.helpers({

	'reteriveField':function(opt)
	{

		var cursorResult=questionOptions.find({}).fetch();


        var optionHtml="";

        if(opt=="year")
        {
          cursorResult=cursorResult[0].year_group;
          var cursorLen=cursorResult.length;
          for(i=0;i<cursorLen;i++)
		 {
			optionHtml+="<option value='"+cursorResult[i]+"'>Year "+cursorResult[i]+"</option>";

		 }
		}
        else if(opt=="strand"){
          cursorResult=cursorResult[0].strand;
          var cursorLen=cursorResult.length;
          for(i=0;i<cursorLen;i++)
		  {
			
				optionHtml+="<option value='"+cursorResult[i]+"'>"+cursorResult[i]+"</option>";
		  }	
       
        }
        else if(opt=="type_of_test"){
          cursorResult=cursorResult[0].type_of_test;
          var cursorLen=cursorResult.length;
          for(i=0;i<cursorLen;i++)
		  {
			
				optionHtml+="<option value='"+cursorResult[i]+"'>"+cursorResult[i]+"</option>";
		  }	
        }
        else if(opt=="skill"){
          cursorResult=cursorResult[0].skill;	
       	  var cursorLen=cursorResult.length;
          for(i=0;i<cursorLen;i++)
		  {
			
				optionHtml+="<option value='"+cursorResult[i]+"'>"+cursorResult[i]+"</option>";
		  }	
        }
        else if(opt=="difficuly_level")
        {
        	  var levels=[1,2,3];	

	          for(i=0;i<levels.length;i++)
			  {
					optionHtml+='<input type="radio" class="checkbtn-radiobtn" name="difficulty_level" value="'+levels[i]+'"><span>Level '+levels[i]+'</span>';
				
			  }	       	  	
        }

		 return optionHtml;	
       
	
		
	},

	'searchYear':function()
	{

		return questionOptions.find({}).fetch().map(function(it)
		{
				console.log("Working here");
				return it.year_group;

		});
	},

/*	'testType':function()
	{
		var testsData=tests.find({}).fetch();

		var testTypeHtml="";

		for(var i=0;i<testsData.length;i++)
		{
			testTypeHtml+='<option value="'+testsData[i]._id+'">'+testsData[i].testname+'</option>';

		}

		return testTypeHtml;
	}*/

});


Template.createquestion.events({

	"submit .create_question":function(event)
	{
		event.preventDefault();
		var difficuly_level=jQuery("[name='difficulty_level']:checked").val();
		var answers=[];
		var answerVals=[];
		jQuery("[name='option_check']").each(function(){  
			if(jQuery(this).is(":checked"))
			{
				
				 answers.push(jQuery(this).val());
				 answerVals.push(jQuery(this).prev().val());		
			}	 
		});

		var testtype=[];

		$("[name='type_of_test'] option:selected").each(function(){ 
			  testtype.push({'testId':this.value,'testname':this.text});
		 });


		var question={
			'year_group':event.target.year_group.value,
			'strand':event.target.strand.value,
			'type_of_test':testtype,
			'skill':event.target.skill.value,
			'difficulty_level':difficuly_level,
			'question':jQuery("[name='question']").val(),
			'answer_type':event.target.answer_type.value,
			'options':[ 
						event.target.option1.value,
						event.target.option2.value,
						event.target.option3.value,
						event.target.option4.value,
			],
			'answer':answers,
			'answerVals':answerVals,	
			'points':event.target.points.value
		
		}


		Meteor.call("addquestion",question,function(err,result)
		{
				if(!err)
				{
					Router.go("questionbank");
				}
		});

	},

	"click #add_new_year":function(event)
	{
		event.preventDefault();
		jQuery(".popup-outr h1").contents().eq(0).replaceWith("Add Year Group");
		jQuery(".popup-outr label").text("Year Group");
		jQuery("#field_type").val("add_year");
		jQuery("#field_value").val("");
		jQuery(".popup-outr").slideDown();
		
	},
	"click #strand":function(event)
	{
		event.preventDefault();
		jQuery(".popup-outr h1").contents().eq(0).replaceWith("Add Strand");
		jQuery(".popup-outr label").text("Strand");
		jQuery("#field_type").val("strand");
		jQuery("#field_value").val("");
		jQuery(".popup-outr").slideDown();
		
	},
	"click #add_test_type":function(event)
	{
		event.preventDefault();
		jQuery(".popup-outr h1").contents().eq(0).replaceWith("Add Test Type");
		jQuery(".popup-outr label").text("Test Type");
		jQuery("#field_type").val("add_test_type");
		jQuery("#field_value").val("");
		jQuery(".popup-outr").slideDown();
		
	},
	"click #add_skill":function(event)
	{
		event.preventDefault();
		jQuery(".popup-outr h1").contents().eq(0).replaceWith("Add Skill");
		jQuery(".popup-outr label").text("Skill");
		jQuery("#field_type").val("add_skill");
		jQuery("#field_value").val("");
		jQuery(".popup-outr").slideDown();
		
	},
	"click #add_difficulty":function(event)
	{
		event.preventDefault();
		jQuery(".popup-outr h1").contents().eq(0).replaceWith("Add Difficulty Level");
		jQuery(".popup-outr label").text("Difficulty Level");
		jQuery("#field_type").val("add_difficulty");
		jQuery("#field_value").val("");
		jQuery(".popup-outr").slideDown();
		
	},
	'submit .add_field':function(event)
	{
		event.preventDefault();
		if(event.target.field_value.value>5 && event.target.field_type.value=="add_difficulty")
		{
			alert("Sorry! you can't assign diffculty level more than 5");
			return ;
		}
		
		Meteor.call("addfield",event.target.field_value.value,event.target.field_type.value,function(err,result){

			console.log(result);


		});
		jQuery(".popup-outr").slideUp();	
	}
})


Template.settings.onRendered(function()
{

	
	$(".login-form").validate({
		
			rules:{
					email:{
							required:true,
						  },
					first_name:{
							required:true,
						  }
					  	
			    },
			    
		   messages:{
			
			  email:
					{
						required:"You must enter an email address"
				    },
			  first_name:
				  {
					  required:"You must enter first name"
				  }
			 }		
	});

		
	
});
	
Template.addquestion.onRendered(function()
{
	$("#question").froalaEditor();
	$(".mCustomScrollbar").mCustomScrollbar({
					theme:"minimal"
				});

});


Template.addquestion.events({

	"click #add_more":function(event)
	{
		event.preventDefault();
		jQuery("#morequestions").append('<p><input type="text" name="option" placeholder=option'+option+'></p>');
		option++;
	},

	"submit .add_question":function(event)
	{
		event.preventDefault();
		var questionObj={};
		questionObj.question=event.target.question.value;
		questionObj.type=event.target.type.value;
		questionObj.year=event.target.year.value;
		questionObj.skill=event.target.skill.value;
		questionObj.correctanswer=event.target.correctanswer.value;
		questionObj.options=[];
		$("[name='option']").each(function()
		{
			questionObj.options.push($(this).val());

		});	

		Meteor.call('addquestion',questionObj,function(err,response)
		{
				if(!err)
				{
					alert("Question has been added successfully");

				}
		});
		console.log(questionObj);

		//Query("[name='option']")	

	}

});

Template.test.helpers({

	"questionObj":function()
	{
		console.log(Session.get("question"));	
		var skip=parseInt(Session.get("question"))
		return questions.find({},{limit:1,skip:skip}).fetch();

	
	},

	"submit_answer":function()
	{
		if(Session.get("question")==(questions.find({}).count()-1))	
		{
			return true;
		}

		return false;	

	}	

});

Template.test.events({

	"click #next_question":function(event)
	{
		event.preventDefault();
		
		Session.set("question",(parseInt(Session.get("question"))+1));
		console.log(question);
		
	},

	"click #submittest":function(event)
	{
		event.preventDefault();


	}
});


Template.questionbank.onRendered(function()
{
		$(".mCustomScrollbar").mCustomScrollbar({
					theme:"minimal"
				});

	Session.set('questionPage',1);
	Session.delete('searchCreteria');


});


Template.questionbank.helpers({

	"questions":function()
	{

		var currentPage=0;		

		if(Session.get('questionPage')>1)
		{	
			currentPage=parseInt((Session.get('questionPage')-1)*2);
		}

		/*** Here need to replace with the async call ****/

		
		

		//var sort=JSON.parse(Session.get("sortData"));	
		//console.log(sort);

		if(Session.get('searchCreteria')!=undefined)
		{
		
			var searchingData=JSON.parse(Session.get('searchCreteria'));
			if(Session.get("sortData")!=undefined)
			{


				var sort=JSON.parse(Session.get("sortData"));	
				if(sort.colName=="year")
				return 	questions.find(searchingData,{limit:2,skip:currentPage,sort:{year_group:sort.val}}).fetch();
			else if(sort.colName=="strand")
				return  questions.find(searchingData,{limit:2,skip:currentPage,sort:{strand:sort.val}}).fetch();
			else if(sort.colName=="skills")				
				return questions.find(searchingData,{limit:2,skip:currentPage,sort:{skill:sort.val}}).fetch();
			

			}
			else
			{

				return questions.find(searchingData,{limit:2,skip:currentPage}).fetch();
			}

		}
		else
		{
			if(Session.get("sortData")!=undefined)
			{
				var sort=JSON.parse(Session.get("sortData"));	
				if(sort.colName=="year")
					return 	questions.find({},{limit:2,skip:currentPage,sort:{year_group:sort.val}}).fetch();
				else if(sort.colName=="strand")
					return  questions.find({},{limit:2,skip:currentPage,sort:{strand:sort.val}}).fetch();
				else if(sort.colName=="skills")				
					return questions.find({},{limit:2,skip:currentPage,sort:{skill:sort.val}}).fetch();
			}
			else
			{
					return questions.find({},{limit:2,skip:currentPage}).fetch();

			}

			/*if(sort.colName=="year")
				return 	questions.find({},{limit:2,skip:currentPage,sort:{year_group:sort.val}}).fetch();
			else if(sort.colName=="strand")
				return  questions.find({},{limit:2,skip:currentPage,sort:{strand:sort.val}}).fetch();
			else if(sort.colName=="skills")				
				return questions.find({},{limit:2,skip:currentPage,sort:{skill:sort.val}}).fetch();
			else*/

			
		}	
		
		
																
			

		//return  questions.find({},{limit:2,skip:currentPage}).fetch();

		//return ReactiveMethod.call("questions",currentPage,2);

		//return questions.find({},{limit:2,skip:currentPage}).fetch();
		 //return questions.find({}).limit(2).skip(currentPage).fetch();

	},	  

	"typeoftest":function()
	{
		  var cursorResult=questionOptions.find({}).fetch();	
		  cursorResult=cursorResult[0].type_of_test;
          var cursorLen=cursorResult.length;
          var testType="";
          for(i=0;i<cursorLen;i++)
		  {
			
				testType+="<td>"+cursorResult[i]+"</td>";
		  }	
		  return testType;
	},
	"questionTestType":function(selected)
	{
		  /*var cursorResult=questionOptions.find({}).fetch();	
		  cursorResult=cursorResult[0].type_of_test;
          var cursorLen=cursorResult.length;*/
          var questionTestType="";
        
          var testType=['10min','11+','FE','CQ','None'];
          
          for(i=0;i<testType.length;i++)
		  {
				questionTestType+='<td><input type="checkbox" ';
				
				for(j=0;j<selected.length;j++)
				{	
					if(selected[j].testname==testType[i])
						questionTestType+='checked';
				}

				questionTestType+='></td>';
			
		 }	
		 
		 return questionTestType;
	},

	"answerType":function(anstype)
	{
		if(anstype=="1")
			return "SC";
		else if(anstype=="2")
			return "MC";
		else if(anstype=="3")
			return "FIB";
		else if(anstype=="4")
			return "Sort";
		else if(anstype=="5")
			return "Match";
		else if(anstype=="6")
			return "OE";
		else
			return "";

	},

	"incrementquestion":function(autoid)
	{
	    var currentPage=Session.get("questionPage");	
		
		if(currentPage==1)
			return ++autoid;	
		else
			return ++autoid+parseInt(currentPage);
	},

	"questionbankPages":function()
	{
		var totalQ=0;
		if(Session.get('searchCreteria')!=undefined)
		{
			
				var searchingData=JSON.parse(Session.get('searchCreteria'));
				totalQ=questions.find(searchingData).count();
				
		}
		else
		{
				totalQ=questions.find({}).count();
		}	
		


		//var totalQ=ReactiveMethod.call("totalQuestions");
		var paginationHtml="";
		var page=0;
		var currentPage=Session.get('questionPage');
		
		console.log("current page is " + currentPage );

		if(currentPage==1)
		{
			paginationHtml='<li><a>&#171;</a></li>';
			
		}
		else
		{
			paginationHtml='<li><a href="#"  class="page" datapage="'+ (parseInt(currentPage)-1) +'">&#171;</a></li>';
		}

	
		if(currentPage>5)
		{	console.log("current page value is "+ currentPage);
			page=parseInt(currentPage-6);
			
		}
		
		for(i=1;i<=totalQ && i<=20;i=i+2)
		{	
			++page;
			if(page==currentPage)
			{
				paginationHtml+='<li><a   class="active-page" datapage="'+page+'">'+page+'</a></li>';

			}
			else
			{
				paginationHtml+='<li><a href="#"  class="page" datapage="'+page+'">'+page+'</a></li>';
			}
			
		
		}		

		if(currentPage==page)
		{
			paginationHtml+='<li><a>&#187;</a></li>';
		}
		else
		{
			paginationHtml+='<li><a href="#"   class="page" datapage='+ (parseInt(currentPage)+1) +'>&#187;</a></li>';
		}

		

		return paginationHtml;
	},

	'sortingColumns':function()
	{	

		var cols=['year','strand','skills'];
		var sCols='';
		if(Session.get('sortData')!=undefined)
		{
				
			var sortData=JSON.parse(Session.get('sortData'));

		
			for(i=0;i<cols.length;i++)
			{
				
				sCols+='<th class="qbank-sort" datasort="'+cols[i]+'">'+cols[i]+'<span>';
				
				if(cols[i]==sortData.colName)
				{
							if(sortData.val==1)
								sCols+='<img src="images/down-arw.png">';
							else	
								sCols+='<img src="images/uparrow.png">';	
				}

				sCols+='</span></th>';

			}

		}
		else
		{
			sCols='<th class="qbank-sort" datasort="year">Year<span></span></th><th class="qbank-sort" datasort="strand">Strand<span></span></th><th class="qbank-sort" datasort="skills">Skills<span></span></th>';
		}
	
		return sCols;
	}


});

Template.questionbank.events({

	'click .delete':function(event)
	{
		event.preventDefault();	
		
		
		if(confirm("Are you Sure to delete it"))
		{
			Meteor.call('deletequestion',event.currentTarget.id,function(err,result)
			{
				if(!err)
				{
					alert("Question Delete Successfully");

				}

			});

		}
	},

	'click .edit':function(event)
	{
		event.preventDefault();
		Router.go("/editquestion/"+event.currentTarget.id);
		//Router.go("editquestion.show",{_id:event.currentTarget.id},{query:});

	},

	'submit .search-question-form':function(event)
	{

		event.preventDefault();
		var searchingData={};


		if($("[name='skill']").val().trim()!="")
						searchingData.skill=$("[name='skill']").val().toString();
		if($("[name='type_of_test']").val().trim()!="")
						searchingData.type_of_test=$("[name='type_of_test']").val().toString();
		if($("[name='year_group']").val().trim()!="")				
						searchingData.year_group=$("[name='year_group']").val().toString();
		if($("[name='strand']").val().trim()!="")				
						searchingData.strand=$("[name='strand']").val().toString();
		if($("[name='difficulty_level']").val().trim()!="")		
						searchingData.difficulty_level=$("[name='difficulty_level']").val().toString();
			
		Session.set('searchCreteria',JSON.stringify(searchingData));
			
			console.log(searchingData);

			return searchingData;

	},

	'click .page':function(event)
	{
		event.preventDefault();
		Session.set("questionPage",event.currentTarget.attributes.datapage.value);
	},

	'click .qbank-sort':function(event)
	{
		event.preventDefault();
		var sort="";

		if(Session.get("sortData")!=undefined)
		{
			sort=JSON.parse(Session.get('sortData'));
			if(sort.colName==event.currentTarget.attributes.datasort.value)
			{
					var objVal=sort.val;
					console.log("object value is "+ objVal);
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


	},

	'click #exportQuestion':function(event)
	{
		event.preventDefault();
		var csvData="Question,Year Group, Strand,Type of test , Skill, Answer Type, Difficulty level, Points, Options, Answer";
		Meteor.call("getallQuestions",function(err,result)
		{
				if(!err)
				{
					
					for(var i in result)
					{
						csvData+= "\n "+result[i].question+","+result[i].year_group+","+result[i].strand+","+result[i].type_of_test+","+result[i].skill+","+result[i].answer_type+","+result[i].difficulty_level+","+result[i].points+', "'+result[i].options.join(",")+ '" ,"'+result[i].answerVals.join(",")+'"';
					}

					console.log(csvData);

						var blob = new Blob([csvData], 
			                    {type: "text/csv;charset=utf-8"});
								saveAs(blob, "questions.csv");

				}
			
		});

		/*var yourCSVData = "Col1Row1,Col2Row1\nCol1Row2,Col2Row2";

			var blob = new Blob([yourCSVData], 
			                    {type: "text/csv;charset=utf-8"});
		saveAs(blob, "yourfile.csv");*/
	}



});

Template.editquestion.onRendered(function()
{
	
	var cursorResult=questionOptions.find({}).fetch();			
	var years=cursorResult[0].year_group;
	var strand=cursorResult[0].strand;
	var skills=cursorResult[0].skill;

	Meteor.setTimeout(function()
	{

			$( "[name='year_group']" ).autocomplete({
				source: years
			}).focus(function(){            
				$("[name='year_group']").autocomplete('search', $("[name='year_group']").val());
			});
			
			$( "[name='strand']" ).autocomplete({
				source: strand
			}).focus(function(){            
				$("[name='strand']").autocomplete('search', $("[name='strand']").val());
			});

			$( "[name='skill']" ).autocomplete({
				source: skills
			}).focus(function(){            
				$("[name='skill']").autocomplete('search', $("[name='skill']").val());
			});
		

		$(".editor-outer").froalaEditor({enter: $.FroalaEditor.ENTER_BR});

		$(".mCustomScrollbar").mCustomScrollbar({
					theme:"minimal"
				});

			
	},1000);



	
	

	Meteor.call("questionDetails",Router.current().params._id,function(err,result)
	{
		Meteor.setTimeout(function()
		{
			$(".editor-outer").froalaEditor({enter: $.FroalaEditor.ENTER_BR});
			$(".editor-outer").froalaEditor("html.set",result.question);
			console.log("Working here with the code");

		},10);
	

	});

});

Template.editquestion.helpers({

	'questionDetails':function()
	{
		var question=ReactiveMethod.call("questionDetails",Router.current().params._id);
		return question;

	},

	'checkchecked':function(val,mval)
	{
		if(val==mval)
		{
			return "checked";
		}

	},
	'reteriveField':function(opt,selected)
	{

		var cursorResult=questionOptions.find({}).fetch();
        var optionHtml="";

        if(opt=="year")
        {
          cursorResult=cursorResult[0].year_group;
          var cursorLen=cursorResult.length;
          for(i=0;i<cursorLen;i++)
		 {
			optionHtml+="<option value='"+cursorResult[i]+"'";
			if(cursorResult[i]==selected)
				optionHtml+=" selected";

			optionHtml+=">Year "+cursorResult[i]+"</option>";

		 }
		}
        else if(opt=="strand"){
          cursorResult=cursorResult[0].strand;
          var cursorLen=cursorResult.length;
          for(i=0;i<cursorLen;i++)
		  {
			
				optionHtml+="<option value='"+cursorResult[i]+"'>"+cursorResult[i]+"</option>";
		  }	
       
        }
        else if(opt=="type_of_test"){
          var testType=['10min','11+','FE','CQ','None'];
          
          /*cursorResult=cursorResult[0].type_of_test;
          var cursorLen=cursorResult.length;*/
          
          for(i=0;i<testType.length;i++)
		  {			
				optionHtml+="<option value='"+testType[i]+"'";

				for(var j=0;j<selected.length;j++)
				{
					if(selected[j].testname==testType[i])
						optionHtml+=" selected";
				}

				optionHtml+=">"+testType[i]+"</option>";
		 

		  }	
        
        }
        else if(opt=="skill"){
          cursorResult=cursorResult[0].skill;	
       	  var cursorLen=cursorResult.length;
          for(i=0;i<cursorLen;i++)
		  {
			
				optionHtml+="<option value='"+cursorResult[i]+"'>"+cursorResult[i]+"</option>";
		  }	
        }
        else if(opt=="difficuly_level")
        {
        	
        	 var levels=[1,2,3];

	          for(i=0;i<levels.length;i++)
			  {
					optionHtml+='<input type="radio" class="checkbtn-radiobtn" name="difficulty_level" value="'+levels[i]+'"';

					if(levels[i].toString()==selected)
						optionHtml+=' checked';

					optionHtml+='><span>Level '+levels[i]+'</span>';
				
			  }	       	  	
        }

		 return optionHtml;	
       
	
		
	},




	'questionOpts':function(options,answer)
	{
		var html=""
		var opts=['a','b','c','d'];

	
		for(var i=0;i<options.length;i++)
		{
			c=i+1;
			html+='<p><span>'+opts[i]+'.</span><input type="text" name="option'+c+'" value="'+options[i]+'"><input type="checkbox" name="option_check" value="'+i+'"';

			if(jQuery.inArray(i.toString(),answer)>=0)
			{
				html+=' checked';
			}

			html+='></p>';
		}
	
		return html;
	}


});

Template.editquestion.events({

	"submit .edit_question":function(event)
	{
		event.preventDefault();
		var difficuly_level=jQuery("[name='difficulty_level']:checked").val();
		var answers=[];
		
		jQuery("[name='option_check']").each(function(){  
			if(jQuery(this).is(":checked"))
			{
			 answers.push(jQuery(this).val());
		
			}	 
		});

		var testtype=[];

		$("[name='type_of_test'] option:selected").each(function(){ 
			  testtype.push({'testId':this.value,'testname':this.text});
		 });	

		
		var question={
			'year_group':event.target.year_group.value,
			'strand':event.target.strand.value,
			'type_of_test':testtype,
			'skill':event.target.skill.value,
			'difficulty_level':difficuly_level,
			'question':jQuery("[name='question']").val(),
			'answer_type':event.target.answer_type.value,
			'options':[ 
						event.target.option1.value,
						event.target.option2.value,
						event.target.option3.value,
						event.target.option4.value,
			],
			'answer':answers,
			'points':event.target.points.value
		}
	
		
		Meteor.call("updateQuestion",Router.current().params._id,question,function(err,result){
			
				alert("Question updated succesfully");

		});
		
		},

		"click #add_new_year":function(event)
	{
		event.preventDefault();
		jQuery(".popup-outr h1").contents().eq(0).replaceWith("Add Year Group");
		jQuery(".popup-outr label").text("Year Group");
		jQuery("#field_type").val("add_year");
		jQuery("#field_value").val("");
		jQuery(".popup-outr").slideDown();
		
	},
	"click #strand":function(event)
	{
		event.preventDefault();
		jQuery(".popup-outr h1").contents().eq(0).replaceWith("Add Strand");
		jQuery(".popup-outr label").text("Strand");
		jQuery("#field_type").val("strand");
		jQuery("#field_value").val("");
		jQuery(".popup-outr").slideDown();
		
	},
	"click #add_test_type":function(event)
	{
		event.preventDefault();
		jQuery(".popup-outr h1").contents().eq(0).replaceWith("Add Test Type");
		jQuery(".popup-outr label").text("Test Type");
		jQuery("#field_type").val("add_test_type");
		jQuery("#field_value").val("");
		jQuery(".popup-outr").slideDown();
		
	},
	"click #add_skill":function(event)
	{
		event.preventDefault();
		jQuery(".popup-outr h1").contents().eq(0).replaceWith("Add Skill");
		jQuery(".popup-outr label").text("Skill");
		jQuery("#field_type").val("add_skill");
		jQuery("#field_value").val("");
		jQuery(".popup-outr").slideDown();
		
	},
	"click #add_difficulty":function(event)
	{
		event.preventDefault();
		jQuery(".popup-outr h1").contents().eq(0).replaceWith("Add Difficulty Level");
		jQuery(".popup-outr label").text("Difficulty Level");
		jQuery("#field_type").val("add_difficulty");
		jQuery("#field_value").val("");
		jQuery(".popup-outr").slideDown();
		
	},
	'submit .add_field':function(event)
	{
		event.preventDefault();
		if(event.target.field_value.value>5 && event.target.field_type.value=="add_difficulty")
		{
			alert("Sorry! you can't assign diffculty level more than 5");
			return ;
		}
		
		Meteor.call("addfield",event.target.field_value.value,event.target.field_type.value,function(err,result){

			console.log(result);


		});

	}
});


Template.adminmanagement.onRendered(function()
{
		$(".mCustomScrollbar,.mCustomScrollbar1").mCustomScrollbar({
					theme:"minimal"
				});

		

});


Template.adminmanagement.helpers({

	"adminusers":function()
	{
		return Meteor.users.find({$or:[{'profile.user_type':'ad'},{'profile.user_type':'mr'},{'profile.user_type':'m'}]}).fetch();

		/*** Applied in clause on find query mongodb ***/
		//Meteor.users.find({'profile.user_type':{$in{[m,mr,]}}});
	},
	"userrole":function(role)
	{
		if(role=="ad")
			return "Main Admin";
		else if(role=="m")
			return "Moderator";
		else if(role=="mr")
			return "Marketing";


	}

});

Template.adminmanagement.events({

	"submit .add-new-admin-form":function(event)
	{
		event.preventDefault();
		var user={};
		user.name=event.target.name.value;
		user.role=event.target.role.value;
		user.username=event.target.username.value;
		user.password=event.target.password.value;

		console.log(user);	

		Meteor.call("adduser",user,function(err,result)
		{

			if(!err)
			{
				alert("User has been added succesfully");

			}


		});

	},

	"click .delete":function(event)
	{
		event.preventDefault();
		var currentId=event.currentTarget.id;
		if(confirm("Are you Sure to delete it"))
		{
			Meteor.call("deleteuser",currentId,function(err,result)
			{
				console.log(result);	
				if(!err)
				{
					alert("User has been deleted succesfully");

				}	


			});


		}
	},

	"click .edit":function(event)
	{
		event.preventDefault();
		var userData=Meteor.users.find({_id:event.currentTarget.id}).fetch();
		$("[name='pname']").val(userData[0].profile.first_name);
		$("[name='pusername']").val(userData[0].profile.first_name);
		$("[name='prole']").val(userData[0].profile.user_type);
		$("[name='userid']").val(userData[0]._id);
		
		$('.popup-outr').slideDown();

		console.log(userData[0].profile.first_name+"  "+userData[0].profile.user_type+"   "+userData[0].username);
		console.log(userData);
	},

	"submit .updateUser":function(event)
	{
		event.preventDefault();
		var user={

		};

		var pass=Accounts._hashPassword(event.target.ppassword.value);

		
		
		user.role=event.target.prole.value;
		user.first_name=event.target.pname.value;
		user.password=pass.digest;;
		user.user_id=event.target.userid.value;

		Meteor.call("updateUser",user,function(err,result)
		{	
				if(!err)
				{
					$('.popup-outr').slideUp();

				}
		
		});

	},

	"click .resetPassword":function(event)
	{
		event.preventDefault();
		$("[name='ruserid']").val(event.currentTarget.id);
		$(".resetpass-popup").slideDown();
	},

	"submit .rpassword":function(event)
	{

		event.preventDefault();	 
		var pass=Accounts._hashPassword(event.target.rpassword.value);
		pass=pass.digest;

		Meteor.call("resetuPassword",event.target.ruserid.value,pass,function(err,result)
		{
				$(".resetpass-popup").slideUp();


		});

	}


});

Template.admindashboard.onRendered(function()
{

	Meteor.setTimeout(function()
	{
			$(".mCustomScrollbar").mCustomScrollbar({
					theme:"minimal"
				});

	},200);

});


Template.testtype.onRendered(function()
{

	Meteor.setTimeout(function()
	{
			$(".mCustomScrollbar").mCustomScrollbar({
					theme:"minimal"
				});


		
		if($(".testname").val()=="10min")	$("#difficulytLevels").hide();	
		else							$("#difficulytLevels").show();

	
	},200);



});

Template.testtype.helpers(	{

	reteriveField:function(type)
	{
		var questionData=ReactiveMethod.call("reteriveField");
		var html="";
		
	if(type=="difficultylevel")
	{
		/*var difficultyLevels=questionData[0]['difficulty_levels'];
		var len=difficultyLevels.length;
		*/

		/*** Comment the above code as we are getting the static levels for the difficulty ***/

		var levels=[1,2,3];

		for(var i=0;i<levels.length;i++)
		{

			html+='<input type="checkbox" class="checkbtn-radiobtn" name="difficultylevel[]" value="'+levels[i]+'"><span>Level '+levels[i]+'</span>';
		}	

	}
	else if(type=="skill")
	{
		var years=questionData[0]['year_group'];
		var len=years.length;
	
		for(var i=0;i<len;i++)
		{

			html+='<input type="checkbox" class="checkbtn-radiobtn" name="skills[]" value="'+years[i]+'"><span>Year '+ years[i] +'</span>';
		}	

	}	


		

		return html;	
		
	},

	questionListing:function()
	{
		
		return tests.find({}).fetch();
		

	}
	

});

Template.testtype.events({


	'change .testname':function(event)
	{
		event.preventDefault();
		if($(".testname").val()=="11+" || $(".testname").val()=="FE")
		{
			$("#skills").show();			
		}
		else
		{
			$("#skills").hide();
		}

		if($(".testname").val()=="10min")
			$("#difficulytLevels").hide();
		else
			$("#difficulytLevels").show();

	},

	"submit .addTest":function(event)
	{

		event.preventDefault();
		var selectlevels=[];
		var selectskills=[];
		var noofQues=event.target.numofques.value;
	


	/** Get the selected level***/	

		$("[name='difficultylevel[]']").each(function()
		{
			if($(this).is(":checked"))
			{
				selectlevels.push(($(this).val()).toString());

			}

		});

	/*** Get Selected skills   ****/	

	$("[name='skills[]']").each(function()
	{
			if($(this).is(":checked"))
			{
				selectskills.push(($(this).val()).toString());

			}
	});

	var skillsChecked=""

	if($("#skills").css('display')=="none")
	{
		skillsChecked=0;
	}
	else
	{
		skillsChecked=1;
	}
	

/*	Meteor.call("checkquesReq",selectlevels,selectskills,skillsChecked,function(err,result)
	{
		if(!err)
		{
	
			if(result<noofQues)
			{
				alert("number of questions not maching with creteria")

			}
			else
			{
	*/			
				var test={};
				test.testname=event.target.testname.value;
				test.no_of_questions=noofQues;
				test.timelimit=event.target.timelimit.value;
				test.skills=selectskills;
				test.selectlevels=selectlevels;
				test.quesrand=$("[name='questionrand']:checked").val();
				test.answerrand=$("[name='answerrand']:checked").val();


	/*** Find that test is exist earlier or not in the test collection ***/
			
			var testData=tests.findOne({'testname':event.target.testname.value}); 

			if(testData==undefined)
			{
				Meteor.call("insertTest",test,function(err,result)
				{
					if(!err)
					{
						console.log(result);
					}

				});
			}
			else 
			{
				Meteor.call("updateTest",testData._id,test,function(err,result)
				{
					console.log(result);
					if(!err)
					{
						console.log(result);
					}

				});
			}




			/*}

		}
	});
		*/

	},

	'click .delete':function(event)
	{
		event.preventDefault();
		
			if(confirm("Are you sure to delete"))
			{
				Meteor.call("removeTest",event.currentTarget.id,function(err,result)
				{		



				});	
			}

	},	

	'click .edit':function(event)
	{
		event.preventDefault();
		Router.go("/edittest/"+event.currentTarget.id);
	},



});


Template.edittest.onRendered(function()
{
	Meteor.setTimeout(function()
	{
		if($(".testname").val()=="11+" || $(".testname").val()=="11+")
		{
			$("#skills").show();	

		}
		else
		{
			$("#skills").hide();

		}
		
		if($(".testname").val()=="10min")	$("#difficulytLevels").hide();	
		else							$("#difficulytLevels").show();

	},200);
});


Template.edittest.helpers({

	reteriveField:function(type,mval)
	{

		var questionData=ReactiveMethod.call("reteriveField");
		var html="";
		
	if(type=="difficultylevel")
	{
		/*var difficultyLevels=questionData[0]['difficulty_levels'];
		var len=difficultyLevels.length;
		*/

		 var levels=[1,2,3];
		 console.log("selected level" + mval);
		for(var i=0;i<levels.length;i++)
		{

			html+='<input type="checkbox" class="checkbtn-radiobtn" name="difficultylevel[]" value="'+levels[i]+'" ';

			console.log(levels[i]+"---"+mval);
			console.log($.inArray(levels[i],mval));
			if($.inArray(levels[i].toString(),mval)!=-1)
			{
				console.log("I am in if");
				html+= ' checked';
			}

			html+='><span>Level '+levels[i]+'</span>';
		}	

	}
	else if(type=="skill")
	{
		var years=questionData[0]['year_group'];
		var len=years.length;
	
		for(var i=0;i<len;i++)
		{

			html+='<input type="checkbox" class="checkbtn-radiobtn" name="skills[]" value="'+years[i]+'" ';
			if($.inArray(years[i],mval)!="-1")
			{
				html+= ' checked';
			}

			html+='><span>Year '+ years[i] +'</span>';
		}	

	}

	else if(type=="testname")
	{
		var testname=['10min','11+','FE','CQ'];

		for(var i=0;i<testname.length;i++)
		{
			html+='<option value="' + testname[i] +'" ';

			if(testname[i]==mval)
			{
				html+=' selected ';

			}
			html+='>'+testname[i]+'</option>';
		}	

	
	}

		

		return html;	
		
	},

	'testDetails':function()
	{


		return ReactiveMethod.call("testDetails",Router.current().params._id);	
		//console.log(test);
	},
	'setChecked':function(mval,fval)
	{
		if(mval==fval)
			return "checked";	
	},

	'timelimitSelect':function(mval)
	{
		console.log("time limit is"+mval);
		var timeslots=[10,20,30,40];

		var timeSelect="";

		for(i=0;i<timeslots.length;i++)
		{

			timeSelect+='<option value="'+timeslots[i]+'"';

			if(timeslots[i]==mval)
				timeSelect+=" selected";
			
			timeSelect+= '>'+timeslots[i]+'Minutes</option>';
								
		}
	
		return timeSelect;
	}
});



Template.edittest.events({


	'change .testname':function(event)
	{
		event.preventDefault();
		if($(".testname").val()=="11+" || $(".testname").val()=="FE")
		{
			$("#skills").show();			
		}
		else
		{
			$("#skills").hide();
		}

		if($(".testname").val()=="10min")	$("#difficulytLevels").hide();	
		else							$("#difficulytLevels").show();

	},

	'submit .editT':function(event)
	{

		event.preventDefault();
	
		var selectlevels=[];
		var selectskills=[];
		var noofQues=event.target.numofques.value;
	


	/** Get the selected level***/	

		$("[name='difficultylevel[]']").each(function()
		{
			if($(this).is(":checked"))
			{
				selectlevels.push(($(this).val()).toString());

			}

		});

	/*** Get Selected skills   ****/	

	$("[name='skills[]']").each(function()
	{
			if($(this).is(":checked"))
			{
				selectskills.push(($(this).val()).toString());

			}
	});


	
			
				var test={};
				test.testname=event.target.testname.value;
				test.no_of_questions=noofQues;
				test.timelimit=event.target.timelimit.value;
				test.skills=selectskills;
				test.selectlevels=selectlevels;
				test.quesrand=$("[name='questionrand']:checked").val();
				test.answerrand=$("[name='answerrand']:checked").val();



				Meteor.call("editTest",Router.current().params._id,test,function(err,result)
				{
					console.log(err);

					if(!err)
					{
						alert("Test has been updated succesfully");

					}


				});

			

	}


});

Template.registerHelper("testType",(typeoftest)=>{

		

		var testsData=tests.find({}).fetch();

		var testTypeHtml="";

		for(var i=0;i<testsData.length;i++)
		{
			testTypeHtml+='<option value="'+testsData[i]._id+'"';


			if(typeof(typeoftest)!="undefined")

			{
				for(var j=0;j<typeoftest.length;j++)
					{
						console.log(typeoftest[j].testname==testsData[i].testname);
						if(typeoftest[j].testname==testsData[i].testname)
						{
							
							testTypeHtml+='selected="selected';
							break;
						}	
					}

			}	


			testTypeHtml+='">'+testsData[i].testname+'</option>';

		}


		console.log("Working");

		return testTypeHtml;

});