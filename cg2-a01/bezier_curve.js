/* requireJS module definition */
define(["util", "vec2", "scene", "bezier_dragger","parametric_curve"],
    (function (Util, vec2, Scene, BezierDragger,ParametricCurve) {
        // "use strict"
        /**
         * a bezier curve is a parametric curve with a control polygon that can be dragged
         */
        var bezier_curve = function (p0, p1, p2, p3, segment, lineStyle) {

            //points of the control polygon
            this.p0 = p0;
            this.p1 = p1;
            this.p2 = p2;
            this.p3 = p3;
            this.points=[];

            // Kubische Bernstein-Polynome
            this.b0 = function (t) {
                return Math.pow(1 - t, 3);
            }

            this.b1 = function (t) {
                return 3 * Math.pow(1 - t, 2) * t;
            }

            this.b2 = function (t) {
                return 3 * (1 - t) * Math.pow(t, 2);
            }

            this.b3 = function (t) {
                return Math.pow(t, 3);
            }
            //function of bezier curve with the polygon points and polynoms
            this.bezierCurve = function (coord, t) {
                return (this.b0(t) * this.p0[coord]) + (this.b1(t) * this.p1[coord]) + (this.b2(t) * this.p2[coord]) + (this.b3(t) * this.p3[coord]);
            };
            //describes the distance of the curve
            this.min_t = 0;
            this.max_t = 5;
            //how many segments has the curve
            this.segment = segment || 20;
            this.marks = false;
            //console.log("creating parametric curve: " +
            //"\np0 " + this.p0 +
            //"\np1 " + this.p1 +
            //"\np2 " + this.p2 +
            //"\np3 " + this.p3 +
            //"\nt_max " + this.max_t +
            //"\nt_min " + this.min_t +
            //"\nsegments " + this.segment);

            // draw style for drawing the line
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};
        };

        // get the method drawCurve from ParametricCurve
        bezier_curve.prototype.drawCurve = ParametricCurve.prototype.drawCurve;
        // draw this line into the provided 2D rendering context
        bezier_curve.prototype.draw = function (context) {
            //calculating the Points
            this.points=[];
            this.points.push([this.p0[0], this.p0[1]]);
            for (var i = 1; i <= this.segment; i++) {
                var t = 1 / this.segment * i;
                var px = this.bezierCurve(0, t);
                var py = this.bezierCurve(1, t);
                this.points.push([px, py]);
            }
            //drawing the Curve with method form parametricCurve
            this.drawCurve(context,this.points,this.segment,this.marks);

        };
        //checks if the user hits the curve
        bezier_curve.prototype.isHit = function (context, point) {
            var t = 0;
            for (var i = 0; i < this.points.length -1; i++) {
                t = vec2.projectPointOnLine(point, this.points[i], this.points[i + 1]);
                if (t >= 0 && t <= 1) {
                    var pos = vec2.add(this.points[i], vec2.mult(vec2.sub(this.points[i + 1], this.points[i]), t));
                    var distance = vec2.length(vec2.sub(pos, point));
                    if (distance <= (this.lineStyle.width / 2) + 2){
                        return true;
                    }
                }
            }
            return false;
        };

        // return list of draggers to manipulate this line
        bezier_curve.prototype.createDraggers = function () {
            var draggerStyle = {radius: 4, color: "#FF0000", width: 0, fill: true}
            var draggers = [];
            // create closure and callbacks for dragger
            var _line = this;
            var getP0 = function () {
                return _line.p0;
            };
            var getP1 = function () {
                return _line.p1;
            };
            var getP2 = function () {
                return _line.p2;
            };
            var getP3 = function () {
                return _line.p3;
            };
            var setP0 = function (dragEvent) {
                _line.p0 = dragEvent.position;
            };
            var setP1 = function (dragEvent) {
                _line.p1 = dragEvent.position;
            };
            var setP2 = function (dragEvent) {
                _line.p2 = dragEvent.position;
            };
            var setP3 = function (dragEvent) {
                _line.p3 = dragEvent.position;
            };
            var points = [getP0, getP1, getP2, getP3];
            draggers.push(new BezierDragger(getP0, setP0, draggerStyle, points));
            draggers.push(new BezierDragger(getP1, setP1, draggerStyle, points));
            draggers.push(new BezierDragger(getP2, setP2, draggerStyle, points));
            draggers.push(new BezierDragger(getP3, setP3, draggerStyle, points));
            return draggers;
        };
        // this module only exports the constructor for Circle objects
        return bezier_curve;

    }));// define



