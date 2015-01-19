/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: straight_line
 *
 * A StraighLine knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "circle_dragger", "point_dragger", "jquery"],
    (function (Util, vec2, Scene, CircleDragger, PointDragger, $) {

        "use strict";

        /**
         *  A simple straight line that can be dragged
         *  around by its endpoints.
         *  Parameters:
         *  - point0 and point1: array objects representing [x,y] coordinates of start and end point
         *  - lineStyle: object defining width and color attributes for line drawing,
         *       begin of the form { width: 2, color: "#00FF00" }
         */

        var Circle = function (center, radius, lineStyle) {

            //console.log("creating circle line with center at [" +
            //center[0] + "," + center[1] + "] with an radius of [" +
            //radius + "].");

            // draw style for drawing the line
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

            // initial values in case either point is undefined
            this.p0 = center || [10, 10];
            this.radius = radius || 4;


        };

        // draw this line into the provided 2D rendering context
        Circle.prototype.draw = function (context) {

            // draw actual line
            context.beginPath();

            // set points to be drawn
            context.arc(this.p0[0], this.p0[1], // position
                this.radius,    // radius
                0.0, Math.PI * 2,           // start and end angle
                true);

            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;

            // actually start drawing
            context.stroke();

        };

        // test whether the mouse position is on this line segment
        Circle.prototype.isHit = function (context, pos) {

            // project point on line, get parameter of that projection point
            var t = vec2.projectPointOnCircle(pos, this.p0, this.radius);

            // outside the line segment?
            if (t - this.radius <= (this.lineStyle.width / 2) + 2 && t - this.radius >= ((this.lineStyle.width / 2) + 2) * -1) {
                return true;
            } else {
                return false;
            }

        };

        // return list of draggers to manipulate this line
        Circle.prototype.createDraggers = function () {

            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true}
            var draggers = [];

            // create closure and callbacks for dragger
            var _circle = this;
            var getP0 = function () {
                return _circle.p0;
            };

            var getP1 = function () {
                var pos = [_circle.p0[0] + (_circle.radius / 2), _circle.p0[1] + (_circle.radius / 2)];
                return pos;
            };
            var setP0 = function (dragEvent) {
                _circle.p0 = dragEvent.position;
            };


            var setRad = function (dragEvent) {
                ((_circle.radius += dragEvent.radius) <= 0 ? _circle.radius = 0 : _circle.radius += dragEvent.radius);
                $('#radius').val(_circle.radius);
            };

            draggers.push(new PointDragger(getP0, setP0, draggerStyle));
            draggers.push(new CircleDragger(getP1, setRad, draggerStyle));

            return draggers;

        };

        // this module only exports the constructor for Circle objects
        return Circle;

    })); // define

    
