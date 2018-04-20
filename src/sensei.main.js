//	........................................................................................................
//
//	main js
//
//  by xiangchen@acm.org, v1.0 04/2018
//
//	........................................................................................................

var SENSEI = SENSEI || {};

SENSEI.visualizations = {};

//
//  jquery ready function
//
$(document).ready(function() {
  // load config file
  YAML.load("config.yml", function(result) {
    Object.assign(SENSEI, result);
    SENSEI.initUI();
  });
});

//
//  initialize ui
//
SENSEI.initUI = function() {
  // load ui layout from template
  var mainTable = $("<table></table>");
  mainTable.css("height", "100%");
  mainTable.prop("border", SENSEI.borderMainTable);
  $(document.body).append(mainTable);
  mainTable.load(SENSEI.mainTablePath, function(e) {
    // create a dropdown list to select different sensors
    var selSensors = $("#selSensors");
    selSensors.append($('<option selected="selected"> - </option>'));
    for (sensor of SENSEI.sensors) {
      var option = $("<option/>");
      option.html(Object.keys(sensor)[0]);
      selSensors.append(option);
    }

    selSensors.selectmenu({
      change: function(e, ui) {
        var nameSensor = ui.item.label;
        var visualize = SENSEI.visualizations[nameSensor];
        if (visualize != undefined) visualize();
      }
    });
    selSensors.selectmenu("option", "width", "100%");
  });
};
