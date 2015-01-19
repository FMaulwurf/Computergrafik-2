/**
 * Created by Sprotte on 27.11.2014.
 */
define(['vbo', 'models/parametric'],
    (function(vbo, ParametricSurface) {
        'use strict';
        var Sphere = function(gl, solid, program) {
            console.log(typeof( program));
            this.program = program;
            var config = {
                "uMin": 0,
                "uMax": Math.PI,
                "vMin": 0,
                "vMax":  2 * Math.PI,
                "uSegments": 20,
                "vSegments": 20,
                "drawStyle": "triangles"
            };
            var configWire = {
                "uMin": 0,
                "uMax": Math.PI,
                "vMin": 0,
                "vMax":  2 * Math.PI,
                "uSegments": 20,
                "vSegments": 20,
                "drawStyle": "wireframe"
            };

            var positionFunc = function(u,v) {
                return [Math.sin(u) * Math.cos(v),
                    Math.cos(u),
                    Math.sin(u) * Math.sin(v) ];
            };
            if (solid) {
                this.sphere = new ParametricSurface(gl, positionFunc, config);
            } else {
                this.sphere = new ParametricSurface(gl, positionFunc, configWire);
            }
        };
        Sphere.prototype.draw = function(gl) {
            this.sphere.draw(gl, this.program);
        };
        return Sphere;
    }));