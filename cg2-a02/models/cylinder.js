/**
 * Created by Sprotte on 27.11.2014.
 */
define(['vbo', 'models/parametric'],
    (function(vbo, ParametricSurface) {
        'use strict';
        var Cylinder = function(gl, solid,program) {

            this.program = program;

            var config = {
                "uMin": -Math.PI,
                "uMax": Math.PI,
                "vMin": 0,
                "vMax":  3,
                "uSegments": 20,
                "vSegments": 20,
                "drawStyle": "triangles"
            };
            var configWire = {
                "uMin": -Math.PI,
                "uMax": Math.PI,
                "vMin": 0,
                "vMax":  3,
                "uSegments": 20,
                "vSegments": 20,
                "drawStyle": "wireframe"
            };

            var positionFunc = function(u,v) {
                return [ 1 * Math.cos(u),
                     1 * Math.sin(u),
                    0.5 * v ];
            };
            if (solid) {
                this.cylinder = new ParametricSurface(gl, positionFunc, config);
            } else {
                this.cylinder = new ParametricSurface(gl, positionFunc, configWire);
            }
        };
        Cylinder.prototype.draw = function(gl) {
            this.cylinder.draw(gl, this.program);
        };
        return Cylinder;
    }));