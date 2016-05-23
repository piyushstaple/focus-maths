var OnBeforeActions;

OnBeforeActions = {
    loginRequired: function(pause) {

     var currUrl= pause.url.split("/")[1];	
      if (!Meteor.userId()) {
        
       if(currUrl=="dashboard" || currUrl=="subscriptiondetail" || currUrl=="invoicedetail" || currUrl=="billingdetails" || currUrl=="familysetting" || currUrl=="reports")
       {
       		this.render('login');
       		return pause;
       }
       else if(currUrl=="admindashboard" || currUrl=="questionbank" || currUrl=="testtype" || currUrl=="admingamrification" || currUrl=="adminmanagement" || currUrl=="editquestion" || currUrl=="edittest" || currUrl=="createquestion")
       {
       		this.render('adminlogin');
       		return pause;
       }
       else if(currUrl=="childdashboard" || currUrl=="childpasttest" || currUrl=="childselectskills" || currUrl=="childpastreports" || currUrl=="childbadges" || currUrl=="testquestions")
       {
       		this.render('childlogin')
       		return pause;	
       } 	
      	 	  
      }
      else
      {
      	 var userType=Meteor.users.findOne({"_id":Meteor.userId()}).profile.user_type;
      	
      	 console.log("current url is "+ currUrl);
      	 if(currUrl=="dashboard" || currUrl=="subscriptiondetail" || currUrl=="invoicedetail" || currUrl=="billingdetails" || currUrl=="familysetting" || currUrl=="reports")
      	 {

      	 	 if(userType=='c') 
      	 	 {
      	 	 	 Router.go("/childdashboard");
      	 	 	 return pause();	
      	 	 }
      	 	 else if(userType=='a')
      	 	 {
      	 	 	 Router.go("/admindashboard");	
      	 	 	 return pause();	
      	 	 }

   	 		
      	 	 
     	 }

      	 else if(currUrl=="admindashboard" || currUrl=="questionbank" || currUrl=="testtype" || currUrl=="admingamrification" || currUrl=="adminmanagement" || currUrl=="editquestion" || currUrl=="edittest" || currUrl=="createquestion")
      	 {
      	 	 if(userType=='c')
      	 	 {
      	 		 	Router.go("/childdashboard");
      	 	 		return pause();
      	 	 }
      	 	 else if(userType=='p')
      	 	 {
      	 		 	Router.go("/dashboard");
      	 	 		return pause();
      	 	 }
      	 	
      	 	
      	 }
      	 else if(currUrl=="childdashboard" || currUrl=="childpasttest" || currUrl=="childselectskills" || currUrl=="childpastreports" || currUrl=="childbadges" || currUrl=="testquestions")
      	 {
      	 	 if(userType=='a')
      	 	 {
      	 		 	Router.go("/admindashboard");
      	 	 		return pause();
      	 	 }
      	 	 else if(userType=='p')
      	 	 {

      	 		 	Router.go("/dashboard");
      	 	 		return pause();
      	 	 }
      	 	
  
      	 }
      	 

      	 
      	 
      		
      	 //	window.history.back();
      	
       }
      	 		return this.next();	

      
      }
      
     
};

Router.onBeforeAction(OnBeforeActions.loginRequired);



Router.route("/",function(){

	/*if(Meteor.userId())
	{
	
		this.render('dashboard',{replaceState: true});
	}
	else
	{*/
		this.render('home',{replaceState: true});

	/*}*/
});

Router.route("/login",function(){
		this.render("login",{replaceState: true});
		
	});


Router.route("/verification",function(){
		this.render("verification",{replaceState: true});
		
	});

Router.route("/signup",function()
{
	this.render('signup',{replaceState: true});	
});

Router.route("/forgot",function()
{
	this.render("forgot",{replaceState: true});

});



Router.route('/reset',function(){
		this.render("reset",{replaceState: true})
});

Router.route("/changepassword",function()
{
		this.render("changepassword");

});

Router.route('/createuser',function(){
		this.render("createuser",{replaceState: true})
});


Router.route("/updateprofile",function()
{
	this.render("updateprofile")

});

Router.route("/userrecords",function()
{
	this.render("userrecords");

});

Router.route("/childdashboard",function()
{
	this.render("childdashboard");

});

Router.route("/childpastreports",function()
{
	this.render("childpastreports");

});

Router.route("/childpasttest/:testId",function()
{
	this.render("childpasttest");

});

Router.route("/childbadges",function()
{
	this.render("childbadges");
});

Router.route("/childselectskills",function()
{
	this.render("childselectskills");

});

Router.route("/childlogin",function()
{	
	this.render("childlogin");

});


Router.route("/familysetting",function()
{
	this.render("familysetting");
});

Router.route("/stripepayment",function()
{
	this.render("stripepayment");

});

Router.route("/paypalCreditCardForm",function()
{
	this.render("paypalCreditCardForm");

});	

Router.route("/adminlogin",function()
{
	this.render("adminlogin");

});

Router.route("/admindashboard",function()
{
	this.render("admindashboard");
});

Router.route("/settings",function()
{
	this.render("settings");

});

Router.route("/addquestion",function()
{
	this.render("addquestion");

});

Router.route("/test",function()
{
	this.render("test");

});

Router.route("/questionbank",function()
{
	this.render("questionbank");

});
Router.route("/editquestion/:_id",function()
{
	this.render("editquestion");
});

Router.route("/edittest/:_id",function()
{
	this.render("edittest");
});

Router.route("/adminmanagement",function()
{

	this.render("adminmanagement");
});

Router.route("/adminnotification",function()
{
	this.render("adminnotification");

});

Router.route("/admingamrification",function()
{

	this.render("admingamrification");

});

Router.route("/createquestion",function()
{

	this.render("createquestion");
});

Router.route("/profile",function()
{
	this.render("profile");

});

Router.route("/testtype",function()
{
	this.render("testtype");

});

Router.route("/addchild",function()
{
	this.render("addchild");

});

Router.route("/testdetails/:_id",function()
{
	this.render("testdetails");


});



Router.route("/testquestions",function()
{
	this.render("testquestions");

});


Router.route("/testsummary/:testid",function()
{

	this.render("testsummary");

});


Router.route("/subscriptiondetail",function()
{
	this.render("subscriptiondetail");

});

Router.route("/billingdetails",function()
{
	this.render("billingdetails");

});

Router.route("/invoicedetail",function()
{
	this.render("invoicedetail");

});


Router.route("/reports/:childId",function()
{
	this.render("reports");
});


Router.route("/adminprofile",function()
{
	this.render(adminprofile);

})
/*Router.route("/testquestions",function()
{
	this.render("testquestions");

});
*/

Router.route("/dashboard",function()
{
	
	if(Meteor.userId())
	{
	if(Meteor.user().services)
	{
				this.render('dashboard',{replaceState: true});	

	}
	else
	{
	 if((Meteor.user() && ! Meteor.user().emails[0].verified)){
		this.render("verification",{replaceState: true});
	}
	else if(Meteor.user() && Meteor.user().emails[0].verified)
	{
		this.render('dashboard',{replaceState: true});	

	}
	}
	}
	else
	{
		this.render('login',{replaceState: true});
	}	
});


