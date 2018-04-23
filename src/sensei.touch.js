//	........................................................................................................
//
//	visualizing touch-related properties
//
//  by xiangchen@acm.org, v1.0 04/2018
//
//	........................................................................................................

var SENSEI = SENSEI || {};

SENSEI.visualizations["touch"] = function() {
  var canvas = $("#canvasVis");
  var positionInfo = canvas[0].getBoundingClientRect();
  var top = positionInfo.top;
  var left = positionInfo.left;
  var width = positionInfo.width;
  var height = positionInfo.height;
  var enlargement = 1.5;
  paper.setup(canvas[0]);

  // convert a value into opacity
  var getOpacity = function(val) {
    var baseOpacity = 0.25;
    return baseOpacity + (1 - baseOpacity) * val;
  };

  // update visuals of a touch event
  SENSEI.updateTouchVis = function(e) {
    paper.project.activeLayer.removeChildren();

    for (t of e.targetTouches) {
      var tx = t.clientX;
      var ty = t.clientY;
      var rx = t.radiusX;
      var ry = t.radiusY;

      // use ellipse to represent each touch point
      var path = new paper.Path.Ellipse(
        new paper.Rectangle(
          new paper.Point(
            tx - left - rx * enlargement,
            ty - top - ry * enlargement
          ),
          new paper.Size(rx * enlargement * 2, ry * enlargement * 2)
        )
      );
      path.fillColor = "rgba(0, 0, 0, " + getOpacity(t.force) + ")";

      // show info as a label
      var xText = tx - left - rx * Math.log(width / 1.5 / rx);
      var yText = ty - top - ry * Math.log(height / 1.5 / ry);
      var text = new paper.PointText(
        new paper.Point(
          Math.max(25, Math.min(xText, width)),
          Math.max(25, Math.min(yText, height))
        )
      );
      text.justification = "center";
      text.fillColor = "black";
      text.content =
        "x: " + (tx - left).toFixed(0) + " y: " + (ty - top).toFixed(0);
      text.content += "\n size: " + ((t.radiusX + t.radiusY) / 2).toFixed(0);
      text.content += "\n force: " + t.force.toFixed(2);
      text.content += "\n angle: " + t.rotationAngle.toFixed(2);
    }
    e.preventDefault();
  };

  // add event handlers
  canvas.on("touchstart", SENSEI.updateTouchVis);
  canvas.on("touchmove", SENSEI.updateTouchVis);
  canvas.on("touchend", SENSEI.updateTouchVis);
};

SENSEI.clearings["touch"] = function() {
  paper.project.activeLayer.removeChildren();
  var canvas = $("#canvasVis");
  canvas.off("touchstart", SENSEI.updateTouchVis);
  canvas.off("touchmove", SENSEI.updateTouchVis);
  canvas.off("touchend", SENSEI.updateTouchVis);
};
