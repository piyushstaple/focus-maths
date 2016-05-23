    (function($){

         jQuery('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');
 
        // Show/Hide Tabs
        jQuery('.tabs ' + currentAttrValue).show().siblings().hide();
 
        // Change/remove current tab to active
        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
 
        e.preventDefault();
    }); 

      $(window).load(function(){
          $(".mCustomScrollbar").mCustomScrollbar({
          theme:"minimal",

        });
      });

          $(window).load(function(){
          $(".mCustomScrollbar1").mCustomScrollbar({
          theme:"minimal",
          
        });
      });
    });
    
    
    var chart = AmCharts.makeChart("admin-dash-map", {
    "type": "serial",
    "theme": "light",
    "legend": {
        "useGraphSettings": true
    },
    "dataProvider": [{
        "year": 1930,
        "italy": 1,
        "germany": 5,
        "uk": 3
    }, {
        "year": 1934,
        "italy": 1,
        "germany": 2,
        "uk": 6
    }, {
        "year": 1938,
        "italy": 2,
        "germany": 3,
        "uk": 1
    }, {
        "year": 1950,
        "italy": 3,
        "germany": 4,
        "uk": 1
    }, {
        "year": 1954,
        "italy": 5,
        "germany": 1,
        "uk": 2
    }, {
        "year": 1958,
        "italy": 3,
        "germany": 2,
        "uk": 1
    }, {
        "year": 1962,
        "italy": 1,
        "germany": 2,
        "uk": 3
    }, {
        "year": 1966,
        "italy": 2,
        "germany": 1,
        "uk": 5
    }, {
        "year": 1970,
        "italy": 3,
        "germany": 5,
        "uk": 2
    }, {
        "year": 1974,
        "italy": 4,
        "germany": 3,
        "uk": 6
    }, {
        "year": 1978,
        "italy": 1,
        "germany": 2,
        "uk": 4
    }],
    "valueAxes": [{
        "integersOnly": true,
        "maximum": 6,
        "minimum": 1,
        "reversed": true,
        "axisAlpha": 0,
        "dashLength": 5,
        "gridCount": 10,
        "position": "left",
        "title": "Number"
    }],
    "startDuration": 0.5,
    "graphs": [{
        "balloonText": "place taken by Italy in [[category]]: [[value]]",
        "bullet": "round",
        "hidden": true,
        "title": "Parent",
        "valueField": "italy",
    "fillAlphas": 0
    }, {
        "balloonText": "place taken by Germany in [[category]]: [[value]]",
        "bullet": "round",
        "title": "Free child",
        "valueField": "germany",
    "fillAlphas": 0
    }, {
        "balloonText": "place taken by UK in [[category]]: [[value]]",
        "bullet": "round",
        "title": "Paid child",
        "valueField": "uk",
    "fillAlphas": 0
    }],
    "chartCursor": {
        "cursorAlpha": 0,
        "zoomable": false
    },
    "categoryField": "year",
    "categoryAxis": {
        "gridPosition": "start",
        "axisAlpha": 0,
        "fillAlpha": 0.05,
        "fillColor": "#000000",
        "gridAlpha": 0,
        "position": "top"
    },
    "export": {
      "enabled": true,
        "position": "bottom-right"
     }
});

var chart = AmCharts.makeChart( "strong-skill-chart", {
  "type": "pie",
  "theme": "light",
  "color":"#626262",
  "fontSize":"12",
  "dataProvider": [ {
    "title": "Time Management",
    "value": 4852,
  "labeltext": "Time Management"
  }, {
    "title": "Study Habits",
    "value": 9850,
  "labeltext": "Study Habits"
  } ,  {
    "title": "Awareness",
    "value": 9850,
  "labeltext": "Awareness"
  }
  ],
  "titleField": "title",
  "valueField": "value",
  "labelRadius": 5,

  "radius": "30%",
  "innerRadius": "60%",
  "labelText": "[[labeltext]]",
  "export": {
    "enabled": true
  }
} );

var chart = AmCharts.makeChart( "weak-skill-chart", {
  "type": "pie",
  "theme": "none",
  "color":"#626262",
  "fontSize":"12",
  "dataProvider": [ {
    "title": "Studying Outside",
    "value": 4852,
  "labeltext": "Studying Outside"
  }, {
    "title": "Study Guide",
    "value": 9850,
  "labeltext": "Study Guide"
  } ,  {
    "title": "Reading Skills",
    "value": 9850,
  "labeltext": "Reading Skills"
  }
  ],
  "titleField": "title",
  "valueField": "value",
  "labelRadius": 5,

  "radius": "30%",
  "innerRadius": "60%",
  "labelText": "[[labeltext]]",
  "export": {
    "enabled": true
  }
} );


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
  



  var chart = AmCharts.makeChart( "skill-level-chart", {
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
    
    
   
 /*   var chart = AmCharts.makeChart( "skill-level-chart", {
  "type": "pie",
  "theme": "light",
  "color":"#626262",
  "fontSize":"12",
  "dataProvider": [ {
    "title": "Not Started",
    "value": 4852,
  "labeltext": "Not Started 25%"
  }, {
    "title": "Started",
    "value": 9850,
  "labeltext": "Started 25%"
  } ,  {
    "title": "Mastered",
    "value": 9850,
  "labeltext": "Mastered 70%"
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


$(document).ready(function(){
  $('.menu-icon img').click(function(){
    $('.dashboard-nav').slideToggle();
  });
  


});