/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "straight_line", "circle", "parametric_curve", "bezier_curve"],
    (function ($, StraightLine, Circle, ParaCurve, BezierCurve) {

        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function (context, scene, sceneController) {


            // generate random X coordinate within the canvas
            var randomX = function () {
                return Math.floor(Math.random() * (context.canvas.width - 10)) + 5;
            };

            // generate random Y coordinate within the canvas
            var randomY = function () {
                return Math.floor(Math.random() * (context.canvas.height - 10)) + 5;
            };

            // generate random color in hex notation
            var randomColor = function () {

                // convert a byte (0...255) to a 2-digit hex string
                var toHex2 = function (byte) {
                    var s = byte.toString(16); // convert to hex string
                    if (s.length == 1) s = "0" + s; // pad with leading 0
                    return s;
                };

                var r = Math.floor(Math.random() * 25.9) * 10;
                var g = Math.floor(Math.random() * 25.9) * 10;
                var b = Math.floor(Math.random() * 25.9) * 10;

                // convert to hex notation
                return "#" + toHex2(r) + toHex2(g) + toHex2(b);
            };
            // random min_t and max_t
            var randomMinMax_t = function () {
                var mini = Math.floor(Math.random() * 50);
                var maxi = Math.floor(Math.random() * 50);
                var t_min = Math.min(mini, maxi);
                var t_max = Math.max(mini, maxi);

                return [t_min, t_max];
            };

            // random amount of segments
            var randomIntValue = function (min, max) {
                var delta = max - min;
                return (Math.floor(Math.random() * delta)) + min;
            };
            /*
             * event handler for "new line button".
             */
            $("#btnNewLine").click((function () {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random() * 3) + 1,
                    color: randomColor()
                };

                var line = new StraightLine([randomX(), randomY()],
                    [randomX(), randomY()],
                    style);
                scene.addObjects([line]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(line); // this will also redraw

            }));
            $("#btnNewCircle").click((function () {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random() * 20) + 1,
                    color: randomColor()
                };

                var circle = new Circle([randomX(), randomY()],
                    (Math.floor((Math.random() * 100) + 10)),
                    style);
                scene.addObjects([circle]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(circle); // this will also redraw

            }));
            $('#color').on('input', function () {
                if (sceneController.getSelectedObject() !== null) {
                    sceneController.getSelectedObject().lineStyle.color = $(this).val();
                    sceneController.select(sceneController.getSelectedObject());
                }
            });
            $('#width').on('input', function () {

                if (sceneController.getSelectedObject() !== null) {
                    sceneController.getSelectedObject().lineStyle.width = $(this).val();
                    sceneController.select(sceneController.getSelectedObject());
                }

            });
            $('#radius').on('input', function () {

                if (sceneController.getSelectedObject() !== null) {
                    var ix = parseInt($(this).val());
                    sceneController.getSelectedObject().radius = (ix <= 0 ? ix = 0 : ix);
                    sceneController.select(sceneController.getSelectedObject());
                }

            });
            $('#btnNewParametric').click(function () {
                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random() * 20) + 1,
                    color: randomColor()
                };

                var x = randomX();
                var y = randomY();

                var minMax_t = randomMinMax_t();
                var f_t = x + "+100*Math.sin(t);";
                var g_t = y + "+100*Math.cos(t);";

                var paraC = new ParaCurve(1, 6.28, f_t, g_t, randomIntValue(5, 30), style);
                //console.log(paraC);
                scene.addObjects([paraC]);


                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(paraC); // this will also redraw
                sceneController.getSelectedObject().marks = $("#marks").is(':checked');
                sceneController.select(paraC);
            });

            $('#btnNewBezier').click(function () {
                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random() * 20) + 1,
                    color: randomColor()
                };
                var p0 = [randomX(), randomY()];
                var p1 = [randomX(), randomY()];
                var p2 = [randomX(), randomY()];
                var p3 = [randomX(), randomY()];


                var bezierC = new BezierCurve(p0, p1, p2, p3, randomIntValue(5, 30), style);
                //console.log(bezierC);
                scene.addObjects([bezierC]);


                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(bezierC); // this will also redraw
                sceneController.getSelectedObject().marks = $("#marks").is(':checked');
                sceneController.select(bezierC);
            });
            $('#xt').on('input', function () {

                if (sceneController.getSelectedObject() !== null) {
                    var ix = parseInt($(this).val());
                    sceneController.getSelectedObject().f_t = (ix <= 0 ? ix = 0 : ix);
                    sceneController.select(sceneController.getSelectedObject());
                }

            });
            $('#yt').on('input', function () {

                if (sceneController.getSelectedObject() !== null) {
                    var ix = parseInt($(this).val());
                    sceneController.getSelectedObject().g_t = (ix <= 0 ? ix = 0 : ix);
                    sceneController.select(sceneController.getSelectedObject());
                }

            });
            $('#mint').on('input', function () {

                if (sceneController.getSelectedObject() !== null) {
                    var ix = parseInt($(this).val());
                    sceneController.getSelectedObject().min_t = (ix <= 0 ? ix = 0 : ix);
                    sceneController.select(sceneController.getSelectedObject());
                }

            });
            $('#maxt').on('input', function () {

                if (sceneController.getSelectedObject() !== null) {
                    var ix = parseInt($(this).val());
                    sceneController.getSelectedObject().max_t = (ix <= 0 ? ix = 0 : ix);
                    sceneController.select(sceneController.getSelectedObject());
                }

            });
            $('#seg').on('input', function () {

                if (sceneController.getSelectedObject() !== null) {
                    var ix = parseInt($(this).val());
                    sceneController.getSelectedObject().segment = (ix <= 0 ? ix = 0 : ix);
                    sceneController.select(sceneController.getSelectedObject());
                }

            });
            $("#marks").change(( function () {
                if (sceneController.getSelectedObject() !== null) {
                    console.log($("#marks").is(':checked'));
                    sceneController.getSelectedObject().marks = $("#marks").is(':checked');
                    sceneController.select(sceneController.getSelectedObject());

                }

            }));


        };

        // return the constructor function
        return HtmlController;


    })); // require



            
