var option=3;
var min=9;
var sec=59;
Session.setDefault("question","0");
Session.setDefault("questionPage",1);
Session.setDefault("questionSort","");
Session.setDefault("users","");


    Accounts.onResetPasswordLink(function()
    {

   		if(Accounts._resetPasswordToken)
	    {
    	
    		Session.set("resetPasswordToken",Accounts._resetPasswordToken);
			Router.go("reset");    	
    	}
    });
  

/***
	 * Signup Validation for the user
	 * Author: Balwinder Kumar
	 * OnRendered Hook for implement the validation
	 * Create Date:29-02-2016
* */






Template.profile.onRendered(function()
{

	$(".edit-profile-out").validate({
		
			rules:{
					
					firstname:{
							required:true,
						  },
					password:{
							required:true,
							minlength:6,
					},	  	
				    cpassword:
					{
				        equalTo:"#password"
				    }
				    
			},
			    
		   messages:{
			
		
			  firstname:
				  {
					  required:"You must enter first name"
				  },
			  password:
			  {
					required:"You must enter password",
					minlength:"Password must be {0} characters long"
			  },
			  cpassword:
			  {
					equalTo:"Password didn't match"
			  }
		   
		   }


});

});	


Template.profile.helpers({

	'profileData':function()
	{
		var profileData=ReactiveMethod.call('profileinfo',Meteor.userId());
		return profileData;
	},

	'checkUserTypeAdmin':function()
	{
		var userData=Meteor.users.findOne({"_id":Meteor.userId()});

		if(userData.profile.user_type=="a")
		{
			return true;
		}
		else
		{
			return false;
		}
		
	},

	'checkUserType':function()
	{
		var userData=Meteor.users.findOne({"_id":Meteor.userId()});

		if(userData.profile.user_type=="p")
		{
			return true;
		}
		else
		{
			return false;
		}
		
	},

	'isChild':function()
	{
		var userData=Meteor.users.findOne({"_id":Meteor.userId()});
	
		console.log("Profile data is");

		console.log(userData.profile);

		if(userData.profile.user_type=="c")
				return true;
	
		return false;
		

	}

});

Template.profile.events({

	'submit .edit-profile-out':function(event)
	{
		event.preventDefault();
		var adminPass=Accounts._hashPassword(event.target.password.value); 


		var user={};
		user.first_name=event.target.firstname.value;
		user.last_name=event.target.lastname.value;
		user.password=adminPass.digest;
		user.id=Meteor.userId();

		console.log(user);


  
		Meteor.call('updateProfile',user,function(err,result)
		{
			console.log(err);	
				if(!err)
				{
					$("[name=password],[name=cpassword]").val("")	
					$("#message").removeClass("notification-error").addClass("notification-success").html("you changed password successfully").fadeIn().fadeOut(5000);
				}
				else
				{
					$("#message").removeClass("notification-success").addClass("notification-error").html("Error while changing the password").fadeIn().fadeOut(5000);
				}
		});

	}
});	





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



