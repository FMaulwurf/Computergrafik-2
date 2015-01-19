/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger"],
    (function (Util, vec2, Scene, PointDragger) {
        // "use strict"
        /*
         * @param f_t function f(t)
         * @param g_t function g(t)
         */
        var parametric_curve = function (min_t, max_t, f_t, g_t, segment, lineStyle) {
            this.min_t = min_t || 0;
            this.max_t = max_t || 5;
            this.f = f_t || ("350+100*Math.sin(t);");
            this.g = g_t || ("150+100*Math.cos(t);");
            this.segment = segment || 20;
            this.array = [];
            this.evalFunc = function (source, t) {
                return eval(source);
            }
            this.marks = false;
            //console.log("creating parametric curve: " +
            //"\nt_min " + this.min_t +
            //"\nt_max " + this.max_t +
            //"\nsegments " + this.segment);
            // draw style for drawing the line
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};
        };
        // draw this line into the provided 2D rendering context
        parametric_curve.prototype.draw = function (context) {
            try {
                var err = [this.evalFunc(this.f, this.min_t), this.evalFunc(this.g, this.min_t)];
            } catch (e) {
                alert("Please check the formula.");
                return;
            }
            this.array = [];
            //t = t_min + i/N * (t_max-t_min)
            //um wie viel wird t bei jedem Durchlauf erhöht
            var delta = (this.max_t - this.min_t) / this.segment;
            for (var i = 0; i <= this.segment; i++) {
                var t = (i * delta + this.min_t);
                //errechnet Punkte für jedes t, werden in array gelegt
                this.array[i] = [this.evalFunc(this.f, t), this.evalFunc(this.g, t)];
            } ;
            this.drawCurve(context,this.array,this.segment,this.marks);
        };
        //drawing the curve and marks if mark == true
        parametric_curve.prototype.drawCurve = function(context,points,segment,marks){
            //start drawing the curve
            context.beginPath();
            for(var i = 0; i < points.length;i++){
                if (i == 0) {
                    context.moveTo(points[0][0], points[0][1]);
                } else {
                    context.lineTo(points[i][0], points[i][1]);
                };
            }
            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;

            // actually start drawing
            context.stroke();
            //if true draws the marks
            if (marks) {
                context.beginPath();
                for (var i = 1; i < segment; i++) {
                    //Mitte des Segments
                    var appr = vec2.sub(points[(i + 1)], points[(i - 1)]);
                    var norm = [appr[1] * (-1), appr[0]];
                    var normalizedVecN = vec2.mult(norm, (1 / vec2.length(norm)));
                    var tick0 = vec2.add(points[i], vec2.mult(normalizedVecN, 10));
                    var tick1 = vec2.sub(points[i], vec2.mult(normalizedVecN, 10));
                    context.moveTo(tick0[0], tick0[1]);
                    context.lineTo(tick1[0], tick1[1]);
                }
                ;
                // draw style
                context.lineWidth = 1;
                context.strokeStyle = "#123456";
                // start drawing
                context.stroke();
            }
        };
        //check if user hits the curve
        parametric_curve.prototype.isHit = function (context, point) {
            var t = 0;
            for (var i = 0; i < this.array.length -1; i++) {
                t = vec2.projectPointOnLine(point, this.array[i], this.array[i + 1]);
                if (t >= 0 && t <= 1) {
                    var pos = vec2.add(this.array[i], vec2.mult(vec2.sub(this.array[i + 1], this.array[i]), t));
                    var distance = vec2.length(vec2.sub(pos, point));
                    if (distance <= (this.lineStyle.width / 2) + 2){
                        return true;
                    }
                }
            }
            return false;
        };

        // return list of draggers to manipulate this line
        parametric_curve.prototype.createDraggers = function () {
            return [];
        };
        // this module only exports the constructor for Circle objects
        return parametric_curve;
    }));// define



