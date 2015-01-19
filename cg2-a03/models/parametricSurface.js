/*
 * WebGL core teaching framwork
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 *
 * Module: ParametricSurface
 *
 * This function creates an object to draw any parametric surface.
 *
 */
/* requireJS module definition */
define(["vbo"],
    (function (vbo) {

        "use strict";

        var ParametricSurface = function (gl, posFunc, config, normalFunc) {

            config = config || {};
            var uSegments     = config.uSegments || 40;
            var vSegments     = config.vSegments || 20;
            this.drawStyle   = config.drawStyle || "points";


            var uStep = (config.uMax - config.uMin) / uSegments;
            var vStep = (config.vMax - config.vMin) / vSegments;

            var uMax = config.uMin + uStep * uSegments;
            var vMax = config.vMin + vStep * vSegments;

            var coordinates = [];
            var normals = [];
            var triangles = [];
            var wireframeIndices = [];
            var textCoords = [];

            for (var i = 0; i <= uSegments; i++) {
                for (var j = 0; j <= vSegments; j++) {
                    var u = config.uMin + uStep * i;
                    var v = config.vMin + vStep * j;

                    var position = posFunc(u, v);
                    coordinates.push(position[0], position[1], position[2]);

                    var normal = normalFunc(u, v);
                    normals.push(normal[0], normal[1], normal[2]);

                    textCoords.push( v / vMax, 1 - u / uMax);

                    if ( i > 0 && j > 0) {
                        var point1 = coordinates.length / 3 - 1;
                        var point2 = point1 - 1;
                        var point3 = point1 - vSegments - 1;
                        var point4 = point3 - 1;

                        triangles.push( point3, point2, point1,point3, point4, point2 );
                        wireframeIndices.push( point2, point1,point1, point3,point3, point4,point4, point2);
                    }
                }
            }

            this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                "dataType": gl.FLOAT,
                "data": coordinates
            } );

            this.textCoordBuffer = new vbo.Attribute(gl, {  "numComponents": 2,
                "dataType": gl.FLOAT,
                "data": textCoords
            } );

            this.normalBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                "dataType": gl.FLOAT,
                "data": normals
            } );

            this.triangleBuffer = new vbo.Indices(gl, { "indices": triangles } );
            this.wireFrameBuffer = new vbo.Indices(gl, { "indices": wireframeIndices } );
        };

        // draw method: activate buffers and issue WebGL draw() method
        ParametricSurface.prototype.draw = function (gl, material) {
            material.apply();
            var program = material.getProgram();
            this.textCoordBuffer.bind(gl, program,  "vertexTexCoords");
            this.coordsBuffer.bind(gl, program, "vertexPosition");
            this.normalBuffer.bind(gl, program, "vertexNormal");

            if(this.triangleBuffer)
                this.triangleBuffer.bind(gl);

            if(this.wireFrameBuffer)
                this.wireFrameBuffer.bind(gl);

            if (this.drawStyle == "points") {
                gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices());
            }else if (this.drawStyle == "surface") {

                gl.enable(gl.POLYGON_OFFSET_FILL);
                gl.polygonOffset(1.0, 1.0);
                this.triangleBuffer.bind(gl)
                gl.drawElements(gl.TRIANGLES, this.triangleBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
                gl.disable(gl.POLYGON_OFFSET_FILL);
            } else if(this.drawStyle == "wireframe"){
                gl.drawElements(gl.LINES, this.wireFrameBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
            } else {
                window.console.log("Parametric: draw style " + this.drawStyle + " not implemented.");
            }
        };

        // this module only returns the Band constructor function
        return ParametricSurface;

    })); // define