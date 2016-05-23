Meteor.startup(function () {

   var NpmModuleBcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;
   var bcrypt = NpmModuleBcrypt;                                                                                          // 3
   var bcryptHash = Meteor.wrapAsync(bcrypt.hash);                                                                        // 4
   var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);       
  
   
   Meteor.publish("users",function users()
   {

        return Meteor.users.find({});

   });


  //Stripe.setPublishableKey('9l8SnzwLwTY5fnZa6rboV0kL');	

/*	
	 if (Accounts._verifyEmailToken) {
		 
		Accounts.verifyEmail(Accounts._verifyEmailToken, function(error) {
		Accounts._enableAutoLogin();

		Router.go("login");
      // XXX show something if there was an error.
    });
  }	*/

 /*** Setting the smtp configuration setting ****/	

 /*** Setting the smtp for the mailgun ***/
 
 	process.env.MAIL_URL="smtp://postmaster@sandboxf4772f5aa75e4e13b63553c2ec02e13c.mailgun.org:9cef6ed109e05c768d13b6fb4747ee4d@smtp.mailgun.org:465/"; 
 

  /*var smtp = {
    username: 'bkbalwinder956@gmail.com',   // eg: server@gentlenode.com
    password: 'bali131313',   // eg: 3eeP1gtizk5eziohfervU
    server:   'smtp.gmail.com',  // eg: mail.gandi.net
    port: 465
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
 */

//  process.env.MAIL_URL="smtp://"+encodeURIComponent("balwinder.developerz@gmail.com")+":balwinder123@smtp.gmail.com:465";
	

  Accounts.emailTemplates.from = 'balwinder.developerz@gmail.com';
	Accounts.emailTemplates.siteName = 'k12';
	Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Confirm Your Email Address for K2 Login';
  };


	/*** Email text for an email ****/
	Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'Thank you for registering.  Please click on the following link to verify your email address: \r\n' + url;
  };

	Accounts.emailTemplates.resetPassword.subject = function(user) {
    return 'Reset Your password';
  };
	

/*** Send the verification code. .when account will be created ****/	

/*Accounts.config({
   sendVerificationEmail: true,
})
*/
	
	Meteor.methods({
    'removeallusers':function(){
    
        	Meteor.users.remove({});
           	return Meteor.users.find().fetch();
    },

    'createuser':function(user)
    {
        var userId= Accounts.createUser({
        email:user.email,
        password:user.password,
        profile:{
             first_name:user.first_name,
             last_name:user.last_name,
             email:user.email,
             user_type:'p',
          
          }
              
        });


     /*** remove the comment from the following line if you want to send verficaition email to user ***/    

   //  Accounts.sendVerificationEmail(userId);

         return userId;

     }, 

    'adduser':function(user)
    {
        var userid=Accounts.createUser({

          username:user.username,
          password:user.password,
          profile:{

                'first_name':user.name,
                'user_type':user.role

          }

        });


        return userid;


    },

    'deleteuser':function(userId)
    {

     
       return Meteor.users.remove({"_id":userId});

    },

     "addfield":function(fieldValue,fieldType)
     {


        if(questionOptions.find({}).count()==0)
        {
      
          /** If Question options document not exist then add the new document ****/
             questionOptions.insert({

                'year_group':[],
                'strand':[],
                'type_of_test':[],
                'skill':[],
                'difficulty_levels':[]
              });
        }

        /**** Push the options in for the questions options collection *********/
        var quesOption=questionOptions.find({}).fetch();
     
        OptionsId=quesOption[0]._id;
       
      if(fieldType=="add_year")
      {  

        return  questionOptions.update({
            '_id':OptionsId},
           
             { 
                $push:{
                        "year_group":fieldValue
                   }}      
        );
      } 
      else if(fieldType=="strand")
      {  

        return  questionOptions.update({
            '_id':OptionsId},
           
             { 
                $push:{
                        "strand":fieldValue
                   }}      
        );
      }
      else if(fieldType=="add_test_type")
      {  

        return  questionOptions.update({
            '_id':OptionsId},
           
             { 
                $push:{
                        "type_of_test":fieldValue
                   }}      
        );
      }
      else if(fieldType=="add_skill")
      {  

        return  questionOptions.update({
            '_id':OptionsId},
           
             { 
                $push:{
                        "skill":fieldValue
                   }}      
        );
      }
      else if(fieldType=="add_difficulty")
      {  

        return  questionOptions.update({
            '_id':OptionsId},
           
             { 
                $push:{
                        "difficulty_levels":fieldValue
                   }}      
        );
      }


     },

     'reteriveField':function()
     {
  


        var cursorResult=questionOptions.find({}).fetch();

          return cursorResult;
          
    },

    'getTestReports':function(userId,sortCol,sortVal)
    {

        var testResultData="";
        if(sortCol=="")
        {
           testResultData = testResults.find({"user_id":userId}).fetch();
        }
        else
        {
           if(sortCol=="testname")
           {
              testResultData = testResults.find({"user_id":userId},{sort:{'testname':sortVal}}).fetch();
           }
           else if(sortCol=="testtype"){
              testResultData = testResults.find({"user_id":userId},{sort:{'testtype':sortVal}}).fetch();
           }
           else if(sortCol=="points"){ 
              testResultData = testResults.find({"user_id":userId},{sort:{'points':sortVal}}).fetch();
           }
        }
        


        var months=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];

        var dateObj="";
        for(var i=0;i<testResultData.length;i++)
        {
              console.log("Working");
              var testData=tests.findOne({"_id":testResultData[i].test_id});
              testResultData[i].number_of_questions=testData.no_of_questions;
              dateObj=new Date(parseInt(testResultData[i].createdAt));
              testResultData[i].date= months[dateObj.getMonth()]+" "+dateObj.getDate()+", "+dateObj.getFullYear();
              testResultData[i].correctper=parseInt((testResultData[i].correctAnswer/testData.no_of_questions)*100);

            //  testResultData[i].Object(testResultData[i]._id).getTimestamp();

        }

        return testResultData;
    
    },

    'testResultDetails':function(testResultId)
    {
        var resultDetails=testResults.findOne({"_id":testResultId});  
        var questionAnswers=resultDetails.questionAnswers;
        var questionDetails=[];
        var srno=0;
        var questinData="";
        for(i=0;i<questionAnswers.length;i++)
        {
           questinData=questions.findOne({'_id':questionAnswers[i].questionId});
           questionDetails.push({'srno':++srno,'question':questinData.question,'userAns':questionAnswers[i].answer,'correctAnswer':questinData.answerVals.join(","),"skill":questinData.skill});
        }
        return questionDetails;
    },

    'testbasicDetail':function(testResultId)
    {
          var resultDetails=testResults.findOne({"_id":testResultId});  
          var testData=tests.findOne({"_id":resultDetails.test_id});

          return {'testname':testData.testname,'correctAnswer':resultDetails.correctAnswer,'no_of_ques':testData.no_of_questions,'corrctPer':parseInt((resultDetails.correctAnswer/testData.no_of_questions)*100),'testTimeTaken':resultDetails.testTimeTaken}
    },

    'removeuser':function(type)
    {
       Meteor.users.remove({"profile.user_type":type});
       return Meteor.users.find().fetch();

    },
    'addchild':function(user)
    {
       return Meteor.users.insert({
          username:user.username,
          password:user.password,
          profile:{
            first_name:user.first_name,
            last_name:user.last_name,
            date_of_birth:user.date_of_birth, 
            user_type:'c'

         }
        });
    },

    'getPointDetails':function(userId)
    {

        return Meteor.users.find({"_id":userId}).fetch();

    },

    'suggestedSkills':function(userId,userYear)
    { 
        
        // var testTotal=tests.find({'year':userYear}).count();
        
         var testTotal=4;
        
         /** Caclulating the distnict count ***/

       /* var testResultData=testResults.find({'user_id':userId}).fetch();
        var testResultD=[];
        var uTestData=[];

        for(var i=0;i<testResultData.length;i++)
        {
            $.inArray(testResultData[i].test_id,testResultD=="-1")
            {

                testResultD.push(testResultData[i].test_id);
                uTestData.push(testResultData);        
            }
        } 


       
        console.log("result is"+testResultD.length);

        return uTestData;
        
        var testResultCount=testResults.distinct('test_id',{'user_id':userId});
      
        console.log(testResultCount);
        return testResultCount;
       if(testResultCount==0)
       {
              return tests.find({},{limit:3}).fetch();

       }
       else if(testResultCount==testTotal)
       {
           return 'f';
       }

       */

    
    },
    'addquestion':function(ques)
    {
        return questions.insert(ques);
    },
    'totalQuestions':function()
    {

        return questions.find({}).count();
    },
    'deletequestion':function(questionId)
    {
      return questions.remove({"_id":questionId});

    },
    'questions':function(page,limit)
    {
        return  questions.find({},{limit:limit,skip:page}).fetch()
       
    },
    'getallQuestions':function()
    {
        return questions.find({}).fetch();
    },
    'checkquesReq':function(levels,skills,skillsChecked)
    {
        
        if(skillsChecked==1)
        {
           return  questions.find({'difficulty_level':{$in:levels},'year_group':{$in:skills}}).count();
        }

        return  questions.find({'difficulty_level':{$in:levels}}).count();
        
       // return levels;
       // return skills;
        
        //    db.questions.find({'difficulty_level':{$in:['1','2','3']},'year_group':{$in:['1','3','2']}})
    },
    'insertTest':function(test)
    {
        return tests.insert(test);

    },

    'updateTest':function(testId,test)
    {

        return tests.update({"_id":testId},{$set:test });

    },

    'removeTest':function(testId)
    {
        return tests.remove({"_id":testId});
    },
    'testDetails':function(testId)
    {


       return tests.findOne({"_id":testId});

    },    

    'insertTempData':function(questionData)
    {

        return tempResults.insert({
            'testId':questionData.testId,
            'userId':questionData.userId,
            'questionId':questionData.questionId,
            'userAnswer':questionData.userAnswer,
            'points':questionData.points,
            "correctanswer":questionData.correctanswer,
            "userRating":questionData.userRating,
            "reportError":questionData.reportError
        });

       
    },

     'storeQuestion':function(userId,testId,questionsData)
     {
       
        return tempCollection.insert({
          questionsData,
          'userId':userId,
          'testId':testId
        });


     }, 

    'insertResulttest':function(resultData)
    {

        return testResults.insert(resultData);

    },

    'removeTempCollection':function(userId,testId)
    {
       tempCollection.remove({'userId':userId,'testId':testId});
       return  tempResults.remove({'userId':userId,'testId':testId});
    },

    'evaluateExam':function(userId,testId)
    {
       var tempData=tempCollection.find({'userId':userId,'testId':testID}).fetch();
       var points=0;
       for(var i=0;i<tempData.length;i++)
       {
          var quesData=questions.findOne({'_id':tempData[i].questionId});


       }  


    },

    'editTest':function(testId,test)
    {
       
      return tests.update({'_id':testId},{$set:test});
    },
    'getchild_count':function()
    {
        return  Meteor.users.find({'profile.user_type':'c'}).count()
    },

    'profileinfo':function(userid)
    {
       
        return Meteor.users.findOne(userid);

    },
    'updateadminProfile':function(user)
    { 


      
    var currentToken = Accounts._getLoginToken(this.connection.id);  
   
                                            
    var  password= bcryptHash(user.password, Accounts._bcryptRounds);     
    return   Meteor.users.update({ _id: user.id }, {                                                                    
        $set: { 'services.password.bcrypt': password ,'profile.first_name':user.first_name,'profile.last_name':user.last_name},                                                              
        $pull: {                                                                                                      
          'services.resume.loginTokens': { hashedToken: { $ne: currentToken } }                                      
        },                                                                                                           
        $unset: { 'services.password.reset': 1 }                                                                       
      });    

        
       

       //return Meteor.users.update(user.user_id,{$set:{'emails.0.address':user.email,'profile.email':user.email,'profile.first_name':user.first_name,'profile.last_name':user.last_name}});
    },

    'updateProfile':function(user)
    { 


      
      var currentToken = Accounts._getLoginToken(this.connection.id);  
                                             
      var  password= bcryptHash(user.password, Accounts._bcryptRounds);     
      return   Meteor.users.update({ _id: user.id }, {                                                                    
          $set: { 'services.password.bcrypt': password ,'profile.first_name':user.first_name,'profile.last_name':user.last_name},                                                              
          $pull: {                                                                                                      
            'services.resume.loginTokens': { hashedToken: { $ne: currentToken } }                                      
          },                                                                                                           
          $unset: { 'services.password.reset': 1 }                                                                       
        });    

        
       

       //return Meteor.users.update(user.user_id,{$set:{'emails.0.address':user.email,'profile.email':user.email,'profile.first_name':user.first_name,'profile.last_name':user.last_name}});
    },
    'updateUser':function(user)
    {
         var  password= bcryptHash(user.password, Accounts._bcryptRounds);     
        return   Meteor.users.update({ _id: user.user_id }, {                                                                    
          $set: { 'services.password.bcrypt': password ,'profile.first_name':user.first_name,'profile.user_type':user.role}
      
        });    

    },

    'updateSkillInfo':function(skillsData)
    {
      
      return Meteor.users.update({
              _id: skillsData.userId } ,
              { $set:{
               'profile.year':skillsData.year,
               'profile.skills':skillsData.skills
             }

           });
       
    },

    userProficiencyupdate:function(userId,userprofData)
    {
        var userData=Meteor.users.findOne({"_id":userId});
        var skillsData="";

        if(typeof(userData.profile.skillsproficiency)!="undefined")
        {
             skillsData=userData.profile.skillsproficiency;

            for(i=0;i<skillsData.length;i++)
            {
               if(skillsData[i].skill==userprofData.skill)
               {
                  skillsData[i].difficultylevel=userprofData.difficultylevel;
                  skillsData[i].proficiency=userprofData.proficiency;
               }

            }
          
        }
        else
        {
            skillsData=[userprofData];

        }

        return Meteor.users.update({
              _id: userId } ,
              { $set:{
               'profile.skillsproficiency':skillsData,
             
             }

           });
    },

    'addchildUser':function(user)
    {
       var  password= bcryptHash(user.password, Accounts._bcryptRounds);    
       
       return Meteor.users.insert({
          username:user.username,
          services:{
              password:{
                  bcrypt:password
              }
          },
          profile:{
            'first_name': user.firstname,
            'last_name': user.lastname,
            'dob': user.dob,
            'user_type':'c',
            'encyptpasswprd':user.profilepass,
            'created_by':user.id
          
          },
          acheivements : {
            point_earned : 0,
            badges_earned :0,
            certificates : 0 

         },
          
      });
       
    },

    'editchildUser': function(user,userId)
    {
      return Meteor.users.update({ _id: userId }, {
        $set: { 
          'profile.first_name': user.first_name,
          'profile.last_name': user.last_name,
          'profile.dob': user.dob
          }
      });
    },
    

    resetuPassword:function(userId,uPassword)
    {
        
        var  password= bcryptHash(uPassword, Accounts._bcryptRounds);     
          return   Meteor.users.update({ _id: userId }, {                                                                    
          $set: { 'services.password.bcrypt': password }
      
        });    
        
    },

    resetcPassword:function(userId,uPassword,pass)
    {

        var  password= bcryptHash(uPassword, Accounts._bcryptRounds);     
          return   Meteor.users.update({ _id: userId }, {                                                                    
           $set: { 'services.password.bcrypt': password ,'profile.encyptpasswprd':pass}
      
        });    
        
    },



    'updateProfileinfo':function(profileData)
    {



        //return profileData.user_id+  "  "+profileData.first_name+"   "+profileData.last_name;
        return Meteor.users.update(profileData.user_id,{$set:{'profile.first_name':profileData.first_name,'profile.last_name':profileData.last_name}});

    },
    'updateQuestion':function(questionid,question)
    {

        return questions.update(questionid,{$set:question});
    },
    'questionDetails':function(quesid)
    {
      return questions.findOne({"_id":quesid});
    },
    'childUsers':function()
    {
        return Meteor.users.find({'profile.user_type':'c'}).fetch();
        
    },

    'removechild':function(id)
    {

       Meteor.users.remove({"_id":id});
       return Meteor.call('childUsers');
      
    },

    'total_users':function()
    {
      return Meteor.users.find().count();

    },

    'setexpriation':function()
    {

    },
    'testfunction':function()
    {
    		return "Working";	

    },
    'chargeCard': function(stripeToken,coupan) {
   

     var Stripe = StripeAPI('sk_test_lJJ69ns1RbcszuV9ffyCbEk2');
     console.log(coupan);
    
    if(coupan!="")
     {


    Stripe.customers.create({
       plan: 'goldmontly',
       source: stripeToken,
      'coupon':coupan
    }, function(err, charge) {

      console.log(err, charge);
    });

    }
    else
    {
          Stripe.customers.create({
       plan: 'goldmontly',
       source: stripeToken
       
    }, function(err, charge) {

      console.log(err, charge);
    });

   }
  },

  'currentChildDetails':function(childId)
  {
    return Meteor.users.find({"_id":childId}).fetch();
  },

	});





/*
Accounts.validateLoginAttempt(function(attemptInfo) {

//  Meteor.users.find({email})

 

/* if(attemptInfo.user.profile.user_type=='a')
 {
      return true;
 
 }






 if (attemptInfo.methodName == 'login' && attemptInfo.type!="resume") {

            var verified = false;
            var email = attemptInfo.methodArguments[0].user.email;
             attemptInfo.user.emails.forEach(function(value, index) {
                if (email == value.address && value.verified) verified = true;
            });
            if (!verified)  throw new Meteor.Error(403, 'Verify Email first!');
        }

        return true; 
 
   /*  if(attemptInfo.type=="resume")
     {
        return false;

     }   
  
    //    return true;
     
 }); */

});	

