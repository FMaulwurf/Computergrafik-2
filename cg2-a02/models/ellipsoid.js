/**
 * Created by Sprotte on 27.11.2014.
 */
define(['vbo', 'models/parametric'],
    (function(vbo, ParametricSurface) {
        'use strict';
        var Ellipsoid = function(gl, solid,point, program) {
            this.program = program;
            var config = {
                "uMin": -Math.PI,
                "uMax":  Math.PI,
                "vMin": -Math.PI,
                "vMax":  Math.PI,
                "uSegments": 40,
                "vSegments": 20,
                "drawStyle": "triangles"
            };
            var configWire = {
                "uMin": -Math.PI,
                "uMax":  Math.PI,
                "vMin": -Math.PI,
                "vMax":  Math.PI,
                "uSegments": 40,
                "vSegments": 20,
                "drawStyle": "wireframe"
            };
            var configPoint = {
                "uMin": -Math.PI,
                "uMax":  Math.PI,
                "vMin": -Math.PI,
                "vMax":  Math.PI,
                "uSegments": 40,
                "vSegments": 20,
                "drawStyle": "points"
            };

            var positionFunc = function(u,v) {
                return [ 0.5 * Math.sin(u) * Math.cos(v),
                    0.3 * Math.sin(u) * Math.sin(v),
                    0.9 * Math.cos(u) ];
            };
            if (solid) {
                this.ellipsoid = new ParametricSurface(gl, positionFunc, config);
            }else if (point) {
                this.ellipsoid = new ParametricSurface(gl, positionFunc, configPoint);
            } else {
                this.ellipsoid = new ParametricSurface(gl, positionFunc, configWire);
            }
        };
        Ellipsoid.prototype.draw = function(gl) {
            this.ellipsoid.draw(gl, this.program);
        };
        return Ellipsoid;
    }));