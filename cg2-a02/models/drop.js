/**
 * Created by Angi on 27.11.2014.
 */
define(['vbo', 'models/parametric'],
    (function(vbo, ParametricSurface) {
        'use strict';
        var Drop = function(gl, solid, program) {
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
                return [ 1.0 * ((1.0 - Math.cos(u)) * Math.sin(u) * Math.cos(v)),
                        1.0 * ((1.0 - Math.cos(u)) * Math.sin(u) * Math.sin(v)),
                    Math.cos(u) ];
            };
            if (solid) {
                this.ellipsoid = new ParametricSurface(gl, positionFunc, config);
            } else {
                this.ellipsoid = new ParametricSurface(gl, positionFunc, configWire);
            }
        };
        Drop.prototype.draw = function(gl) {
            this.ellipsoid.draw(gl, this.program);
        };
        return Drop;
    }));