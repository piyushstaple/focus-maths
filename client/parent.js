Template.signup.onRendered(function()
{
	

	
	$(".login-form").validate({
		
			rules:{
					email:{
							required:true,
						  },
					fname:{
							required:true,
						  },
					password:{
							required:true,
							minlength:6,
						
					},	  	
				    cpassword:
					{
				        equalTo:"#password"
				    },
				    terms:
				    {
						required:true,	
					}
						  	
			    },
			    
		   messages:{
			
			  email:
					{
						required:"You must enter an email address"
				    },
			  fname:
				  {
					  required:"You must enter first name"
				  },
			  password:
			  {
					required:"You must enter password",
					minlength:"Your password must be atleast {0} characters"
			  },
			  cpassword:
			  {
					equalTo:"Password didn't match"
			  },
			  terms:
			  {
					required: "Terms and conditions required"
			  }
		
			  	  
		   
		   }		
	});

		
	
});
	


/***
 * Function for signup the users
 * Author: Balwinder Kumar
 * Created:29-02-2016
  * */

Template.signup.events({
	
	
	"submit .login-form":function(event)
	{
		event.preventDefault();
		var user={};
		user.first_name=event.target.fname.value;
		user.last_name=event.target.lname.value;
		user.email=event.target.email.value;
		user.password=event.target.password.value;
		user.user_type="p";

		Accounts.createUser({
        email:user.email,
        password:user.password,
        profile:{
             first_name:user.first_name,
             last_name:user.last_name,
             email:user.email,
             user_type:'p',
          
          }
              
        },function(err)
        {
        	if(!err)
        	{
        		Router.go("dashboard");
        	}	
        	else
        	{
        		$(".error-msg").text(err.reason).fadeIn(2000).fadeOut(1000);	
        	}	
        

        });

		
		/*if(userId)
		{
				Router.go("dashboard");

		}
		else
		{
			$(".error-msg").text(err.reason).fadeIn(2000).fadeOut(1000);

		}
	
		Meteor.call("createuser",user,function(err,result){
				if(err)
				{
					$(".error-msg").text(err.reason).fadeIn(2000).fadeOut(1000);

						
				}
				else
				{	
					/*
					console.log(result);
					Session.set('notificationMessage','We have send you verification link in an email. Please verify the link to login');
					Session.set('notificationTitle','Verify Email');
					
					Router.go("dashboard");
				}
		


		});*/

		
				
			
			
	
	},

	"click .close-form":function(event)
	{
		event.preventDefault();	
		Router.go("/");

	}
	
});



Template.login.onRendered(function()
{
	
		jQuery(".login-form").validate({
		
			rules:{
					email:{
							required:true,
					},
					password:{
							required:true,
					}		
				},
				
			messages:{
				
				email:{
						required:"email required"
				},
				password:
				{
						required:"password required"
				}			
			}	
		
		});	
	
});

/**
 * Function to login the user 
 * Author:Balwinder Kumar
 * Created:29-02-2016
**/

Template.login.events({
	
	
	"submit .login-form":function(event)
	{

		event.preventDefault();

		var isexist=Meteor.users.findOne({"profile.email":event.target.email.value});

		if(typeof(isexist)!="undefined")
		{



		var userType=Meteor.users.findOne({"profile.email":event.target.email.value}).profile.user_type;	

		if(userType=="a")
		{
			alert("You can't login admin in parent dashboard");
			return false;
		}
		else if(userType=="c")
		{
			alert("You can't login child in parent dashboard");
			return false;
		}

		}

		Meteor.loginWithPassword(event.target.email.value,event.target.password.value,function(err)
		{
			console.log(err);
			if(!err)
			{
				document.cookie='testtttt=test;path=/'
				Accounts._autoLoginEnabled=false;
				if(!$(event.target.rememberme).is(":checked"))
				{
					localStorage.setItem("rememberme","0");
						
				}
				else
				{

					localStorage.setItem("rememberme","1");

				}
				Router.go('dashboard');	
				
			}
			else
			{
				if(err=="Error: Verify Email first! [403]")
				{
					$(".error-msg").text("Please verify Email first").fadeIn(2000).fadeOut(1000);		

				}
				else
				{	
					$(".error-msg").text("User name or password do not match").fadeIn(2000).fadeOut(1000);	
				}
					
			}			
		});


		
	},

	"click .facebook-login":function(event)
	{
			event.preventDefault();
			Meteor.loginWithFacebook({},function(err){

				if(err)
				{

					throw new Meteor.Error("Facebook Login Failed");
				}
				else
				{
					Router.go('dashboard');

				}

			});
	},

	"click .close-form":function(event)
	{
		console.log("Clicked on the close button");
		event.preventDefault();	
		Router.go("/");

	}

	
});




Template.dashboard.helpers({

	username:function()
	{

		if(Meteor.user().profile.first_name.length>=9)
		{
			
			return Meteor.user().profile.first_name.slice(0,6)+"..";
		}


		return Meteor.user().profile.first_name;

	}	


});



Template.parentmenu.helpers({

	username:function()
	{
		if(Meteor.user().profile.first_name.length>=9)
		{
			
			return Meteor.user().profile.first_name.slice(0,6)+"..";
		}


		return Meteor.user().profile.first_name;
	},

	'menus':function()
	{
		// Get child of current user to show in menu Listing
		var getChilds=Meteor.users.find({'profile.user_type':'c','profile.created_by':Meteor.userId()}).fetch();

		var childReport = []

		for(j=0;j<getChilds.length; j++)
		{	
			var childDetail={};
			var childId = getChilds[j]._id;
			var childName = getChilds[j].profile.first_name;

			childDetail.href='/reports/'+childId;
			childDetail.title=childName;
			childReport.push(childDetail);
		}
		
		// Menu to be show in parent section
        var menuOptions=[{href:"/dashboard",title:"Dashboard",class:"flaticon-tool"},{href:"",title:"Reports",class:"flaticon-business-1",submenus:childReport},{href:"",title:"Family Setting",class:"flaticon-two",submenus:[{href:"/familysetting",title:"Manage Children"}]},{href:"",title:"Memberships",class:"icon-img",img:"/images/members-icon.png",submenus:[{href:"/subscriptiondetail",title:"Subscription details"},{href:"/invoicedetail",title:"Invoices"},{href:"/billingdetails",title:"Billing Information"}]},{href:"/profile",title:"Profile",class:"flaticon-people-5"},{href:"",title:"Help",img:"/images/help-icon.png"},{href:"",title:"Logout",class:"flaticon-symbol-1"}];

        // Create Menu Html
        var menuHtml="";

        var selectedHref=Router.current().route.path(this);

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
        			menuHtml+='<li><a href="'+menuOptions[i].submenus[j].href+'">'+menuOptions[i].submenus[j].title+'</a></li>';

        		}
				menuHtml+='</ul>';

        	}

        	menuHtml+='</li>';	
        	
        }

        	return menuHtml;  

	}	


});



/***
 * Function for logout for the users
 * Author:Balwinder Kumar
 * Created:29-02-2016
 */
 
Template.parentmenu.events({
		
	"click .logout":function(event)
	{
		event.preventDefault();
		Meteor.logout();
		Router.go("login");
					
	}	
		
	
});




Template.forgot.onRendered(function()
{
	
		jQuery(".login-form").validate({
		
			rules:{
					email:{
							required:true,
					},
						
				},
				
			messages:{
				
				email:{
						required:"Email required"
				},
							
			}	
		
		});	
	
});





Template.forgot.events({


	"submit .forgot-password":function(event)
	{
		event.preventDefault();
		Accounts.forgotPassword({email:event.target.email.value},function(err)
		{
				console.log(err);	
				if(err)
				{

					if(err=="Error: User not found [403]")
					{

						$(".error-msg").text("User not found").fadeIn(2000).fadeOut(1000);
					}
					else
					{
						$(".error-msg").text("Error while reset password").fadeIn(2000).fadeOut(1000);	
				
					}	
				}	
				else
				{
					Session.set('notificationMessage','We have send you reset password link in an email. Please open the link to reset the password');
					Session.set('notificationTitle','Reset Password');	
					Router.go('verification');

				}

		});

	},

	"click .close-form":function(event)
	{
		event.preventDefault();
		Router.go("/login");

	}


});

Template.reset.onRendered(function()
{
	

	
	$(".login-form").validate({
		
			rules:{
					
					password:{
							required:true,
							minlength:6,
						
					},	  	
				    cpassword:
					{
				        equalTo:"#password"
				    },
				    
						  	
			    },
			    
		   messages:{
			
			
			  password:
			  {
					required:"You must enter password",
					minlength:"Your password must be atleast {0} characters"
			  },
			  cpassword:
			  {
					equalTo:"Password didn't match"
			  },
			
		
			  	  
		   
		   }		
	});

		
	
});
	



Template.reset.events({

	"submit .login-form":function(event)
	{
		event.preventDefault();
		console.log(Session.get('resetPasswordToken'));
		console.log(event.target.password.value);	

		Accounts.resetPassword(Session.get('resetPasswordToken'),event.target.password.value,function(err)

		{
			if(err)
			{
				$(".error-msg").text("Something went wrong while reset password").fadeIn(2000).fadeOut(1000);
			
			}
			else
			{
				Router.go("dashboard");

			}


		});



	}
});


Template.verification.helpers(
{
	'notificationMessage':function()
	{
		return Session.get("notificationMessage");

	},
	'notificationTitle':function()
	{

		return Session.get("notificationTitle");
	}



});



Template.changepassword.events({

	'submit .login-form':function(event)
	{
		event.preventDefault();

		Accounts.changePassword(event.target.oldpassword.value,event.target.newpassword.value,function(err)
		{
				if(err)
				{

					$(".error-msg").text("Incorrect old password").fadeIn(2000).fadeOut(1000);
				}
				else
				{
					$(".error-msg").text("Password Changed successfully").fadeIn(2000).fadeOut(1000);	
					Router.go("login");

				}


		});
	}

});

Template.updateprofile.helpers({

	'profiledata':function()
	{
	    	return ReactiveMethod.call('profileinfo',Meteor.userId());
		 
	}
	

});


Template.updateprofile.events({

	'submit .login-form':function(event)
	{
		event.preventDefault();
		var profileData={'user_id':Meteor.userId(),
						'first_name':event.target.first_name.value,
						'last_name':event.target.last_name.value};	

		Meteor.call('updateProfileinfo',profileData,function(err,result)
		{
			console.log(result);	
			if(err)
			{
				$(".error-msg").text("Error While updating the profile").fadeIn(2000).fadeOut(1000);
			}
			else
			{
				$(".error-msg").text("Profile Updated Successfully").fadeIn(2000).fadeOut(1000);
			}
			return result
		});

		/*********** Calling Server Side method to update the profile ********/
	}

});

Template.dashboard.onRendered(function(){

/*** Adding The Scroller Bar on Dashboard ***/

		$(".mCustomScrollbar").mCustomScrollbar({
					theme:"minimal"
				});


			var chart = AmCharts.makeChart( "skill-level-chart", {
			  "type": "pie",
			  "theme": "light",
			  "color":"#626262",
			  "fontSize":"12",
			  "dataProvider": [ {
			    "title": "Not Started",
			    "value": 10,
				"labeltext": "Not Started 25%"
			  }, {
			    "title": "Started",
			    "value": 10,
				"labeltext": "Started 25%"
			  } ,  {
			    "title": "Mastered",
			    "value": 20,
				"labeltext": "Mastered 50%"
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
		});



});


/*
**
*/

/*Template.reports.onRendered(function()
{
	Meteor.setTimeout(function()
	{

		$(".mCustomScrollbar").mCustomScrollbar({
					theme:"minimal"
				});

	},1000);

});*/

Template.reports.helpers({
	'childData': function ()
	{
		
		var currentChildId=Router.current().params.childId; 
		var resultData=ReactiveMethod.call("currentChildDetails",currentChildId);
		return resultData[0].profile;
	}
});



Template.addchild.events({

	"submit .new-member-add-form":function(event)
	{
		event.preventDefault();
		var username=Random.id();
		var password=Random.secret();

		var user={
			'username':Random.id(),
			'password':Random.secret(),
			'first_name':event.target.first_name.value,
			'last_name':event.target.last_name.value,
			'date_of_birth':event.target.date_of_birth.value
		}

		Meteor.call('addchild',user,function(err,response){
			
			if(!err)
			{
				console.log("User Added Successfully");	
				jQuery(".no-acc-msg").html("Child Added successfully").fadeIn(2000).fadeOut(1000);

			}

		});
	
	}



});

Template.addchild.onRendered(function(){

	jQuery("#dob").datepicker();

		$(".new-member-add-form").validate({
		
			rules:{
					first_name:{
							required:true,
						  },
					date_of_birth:{
							required:true,
						  }
					  	
			    },
			    
		   messages:{
			
			  first_name:
					{
						required:"first name required"
				    },
			  date_of_birth:
				  {
					  required:"D.O.B required"
				  }
			 }		
	})


	


});

Template.addchild.helpers({

	'notificationmessage':function()
	{
		if(ReactiveMethod.call('getchild_count')==0)
		{
			return 'No children have been added to your Account !';
		}
	}	


});


Template.familysetting.onRendered(function()
{

	$('#dob').datepicker();

		jQuery.validator.addMethod("noSpace", function(value, element) { 
	 	console.log(value.indexOf(" ") < 0 && value != "");	
	 	 return value.indexOf(" ") < 0 && value != ""; 
	}, "No space please and don't leave it empty");


	jQuery(".rpassword").validate({
		
			rules:{
					
					rpassword:{
							required:true,
							noSpace:true,
							maxlength: 8,
							minlength:6
					}		
				},
				
			messages:{
				
				rpassword:
				{
						required:"Reset Password required",
						
				},


			}	
		
		});		

	jQuery(".add-child-acc").validate({
		
			rules:{
					firstname:{
							required:true,
					},

					lastname:{
						required:true,
					}, 

					dob:{
						'required':true
					},

				},
				
			messages:{
				
				firstname:
				{
						required:"first name required"
				},
				
				'lastname':
				{
						required:"last name required"
				},

				dob:{
						required:"D.O.B required"
				},

			}	
		
	});	


	Meteor.setTimeout(function()
	{

		$(".mCustomScrollbar1").mCustomScrollbar({
					theme:"minimal"
				});
	},1000);
	

});

Template.familysetting.helpers({

	'nochildMessage':function()
	{
		if(Meteor.users.find({'profile.user_type':'c'}).count()==0)
		{	
			return '<p class="no-acc-msg">No children have been added to your Account !</p>'; 
		}

		return '';
	},

	'childs':function()
	{
		return Meteor.users.find({'profile.user_type':'c','profile.created_by':Meteor.userId()}).fetch();
	},

	'reterivePassword':function(password)
	{
		
		return password.slice(0,7);
	}


});

Template.familysetting.events({

	'click .removeusers':function(event)
	{

		var status=confirm("Are you Sure to delete it!!");
	
		if(status==1)
		{	
			event.preventDefault();
			Meteor.call('removechild',event.currentTarget.id,function(err,result)
			{
				console.log(result);
				console.log(err);

				if(!err)
				{
					alert("Child is deleted succesfully");
				}

			});
		}
	
   },

   "submit .add-child-acc":function(event)
   {
   	   
   	event.preventDefault();
	var username=""	;
	var loop=true;

	var letters=['fuzil','quipu','zingy','jiggy','jaggy','jibbs','juicy','quiff','quack','zippy','tazza','tazze','zazen','pizza','mezzo','huzza','frizz','scuzz','whizz','muzzy','fuzzy','abuzz','cylix','fique','jakes','vizor','jalap','wizen','vizir','qubit','zooks','judge','pique','zincs','fujis'];
	
	/** Getting the unique username ***/



	var password=letters[Math.floor(Math.random()*34)]+("0"+Math.floor(Math.random()*99)).slice("-2");


	while(loop)
	{

		username=$("[name='firstname']").val().slice(0,1)+$("[name='lastname']").val().slice(0,1)+Math.ceil(Math.random()*10000);
		console.log(Meteor.users.find({'username':username}).count());
		if(Meteor.users.find({'username':username}).count()==0)
		{
			loop=false;	
		}
		
	}
	
	
	var user={};
	user.firstname=event.target.firstname.value;
	user.lastname=event.target.lastname.value;
	user.dob=event.target.dob.value;
	user.username=username;
	user.profilepass=password+Math.random()*10000;
	var pass=Accounts._hashPassword(password);
	user.password=pass.digest;
	user.id=Meteor.userId();
	
	Meteor.call("addchildUser",user,function(err,result)
	{
		console.log(err);
		console.log(result);

		if(!err)
		{
				alert("User has been added succesfully");

		}


	});
   },

   "click .reset":function(event)
   {
   		event.preventDefault()
   		$("[name='ruserid']").val(event.currentTarget.id);
   		$(".resetpass-popup").slideDown();
   	
   },

   'submit .rpassword':function(event)
   {
   		event.preventDefault();
   		
   		var pass=Accounts._hashPassword(event.target.rpassword.value);
		var hashpass=pass.digest;

		Meteor.call("resetcPassword",event.target.ruserid.value,hashpass,event.target.rpassword.value,function(err,result)
		{
			console.log(err);
			console.log(result);

				$(".resetpass-popup").slideUp();


		});
    },

    'submit .updateUser': function(event)
    {
    	event.preventDefault();

    	var user={};
    	var userId=event.target.userid.value;
    	user.first_name=event.target.fname.value;
    	user.last_name=event.target.lname.value;
    	user.dob=event.target.dobpop.value;



    	Meteor.call("editchildUser",user,userId,function(err,result)
		{
			console.log(err);
			console.log(result);

			if(!err)
			{		
					$(".update-user").slideUp();
					alert("User has been edited succesfully");

			}


		});
    },

    "click .canceluser":function(event)
    {
    	event.preventDefault();
    	$(".update-user").slideUp();
    },	

    "click .resetcancel":function(event)
    {
    	event.preventDefault();
    	$(".resetpass-popup").slideUp();
    },

    "click .edit":function(event)
    {
    	event.preventDefault();	
    	
    	var userId=event.currentTarget.id;

    	var userInfo = Meteor.users.find({'_id':userId}).fetch();
    	//console.log(userInfo[0].profile.first_name);

    	$("[name='userid']").val(userId);
    	$("[name='fname']").val(userInfo[0].profile.first_name);
    	$("[name='lname']").val(userInfo[0].profile.last_name);
    	$("[name='dobpop']").val(userInfo[0].profile.dob);
    	$('#dobpop').datepicker('remove');
    	$('#dobpop').datepicker();

    	$(".update-user").slideDown();

    },

    "click .delete":function(event)
    {
    	event.preventDefault();

    	var userID = event.currentTarget.id;
    	
    }


});

Template.stripepayment.events({


	'submit .paymentform':function(event)
	{
		Stripe.setPublishableKey('pk_test_9l8SnzwLwTY5fnZa6rboV0kL');	
		event.preventDefault();
		var ccNum = $('#ccnum').val();
		var cvc = $('#cvc').val();
		var expMo = $('#exp-month').val();
		var	expYr = $('#exp-year').val();

	Stripe.card.createToken({
		number: ccNum,
		cvc: cvc,
		exp_month: expMo,
		exp_year: expYr,
		
	}, 
	function(status, response) {
		console.log(status);
	stripeToken = response.id;
	Meteor.call('chargeCard', stripeToken,$('#coupan').val(),function(err,result)
	{
		console.log(result);

	});

	
	});

	}
});

Template.paypalCreditCardForm.events({

	'submit #paypal-payment-form':function(event)
	{
		event.preventDefault();
		var card_data = Template.paypalCreditCardForm.card_data();	
		
		console.log(card_data);
		console.log("Working");

	    Meteor.Paypal.purchase(card_data, {total: '100', currency: 'USD'}, function(err, results){
        if (err) console.error(err);
        else console.log(results);
      });	
	}



});




Template.parentmenu.events({

	"click .logout":function(event)
	{
		event.preventDefault();
		Meteor.logout();
		Router.go("/login");

	}
});