define(
    [
        'gl-matrix',
        'vbo',
        'scene_node',
        'models/band',
        'models/triangle',
        'models/cube',
        'models/parametric',
        'models/ellipsoid',
        'models/cylinder',
        'models/sphere',
        'models/drop'
    ],
    (function(
        glmatrix,
        vbo,
        SceneNode,
        Band,
        Triangle,
        Cube,
        ParametricSurface,
        Ellipsoid,
        Cylinder,
        Sphere,
        Drop
        ){
        'use strict';
        var Robot = function (gl, program) {

            //Colors
            var bodyColor = program.uniColor;
            var jointColor = program.red;
            var hatColor = program.uniColor;
            var headColor = program.blue;

            //Sizes
            var headSize = [0.2, 0.2, 0.2];
            var bodySize = [0.2, 0.2, 0.2];
            var hatSize = [bodySize[0] / 2, bodySize[1] / 2, bodySize[2] / 2];
            var shoulderSize = [0.1, 0.1, 0.1];
            var upperArmSize = [bodySize[0] / 3, bodySize[1] / 3, bodySize[2] / 3];
            var elbowSize = upperArmSize;
            var lowerArmSize = [bodySize[0], bodySize[1], bodySize[2]];
            var handSize = [bodySize[0] / 2, bodySize[0] / 2, bodySize[0] / 2];
            var upperLegSize = [bodySize[0], bodySize[0], bodySize[0]];
            var kneeSize = elbowSize;
            var lowerLegSize = lowerArmSize;
            var eyeSize = [bodySize[0] / 6, bodySize[1] / 6, bodySize[2] / 6];

            //Objects
            var sphere = new Sphere(gl, true, jointColor);
            var headsphere = new Sphere(gl, true, headColor);
            var wireSphere = new Sphere(gl, false, bodyColor);
            var cylinder = new Cylinder(gl, true, bodyColor);
            var bodyCylinder = new Cylinder(gl, true, jointColor);
            var ellipsoid = new Ellipsoid(gl, true, false, bodyColor);
            var wireEllipsoid = new Ellipsoid(gl, false, false, jointColor);
            var cube = new Cube(gl, bodyColor);
            var drop = new Drop(gl, true, bodyColor);
            var band = new Band(gl, {
                    drawStyle: 'wireframe',
                    height: 0.4
                }
            );


            //Translations
            var bodySphereTranslate = [0, 0, bodySize[2]*1.5];
            var headSphereTranslate = [0, 0, bodySize[0]*1.8];

            var rEyeTranslate = [bodySize[0] * 30, bodySize[0] * 15, bodySize[0] * 5];
            var lEyeTranslate = [bodySize[0] * 30, bodySize[0] * -15, bodySize[0] * 5];

            var rUpperLegTrans = [0, bodySize[0] * 3, bodySize[0] * -10];
            var rKneeTrans = [0, rUpperLegTrans[1] * 3, rUpperLegTrans[2] * 4.5];
            var rLowerLagTrans = [0, rUpperLegTrans[1], rUpperLegTrans[2] * 2];

            var lUpperLegTrans = [0, bodySize[0] * -3, bodySize[0] * -10];
            var lKneeTrans = [0, lUpperLegTrans[1] * 3, lUpperLegTrans[2] * 4.5];
            var lLowerLagTrans = [0, lUpperLegTrans[1], lUpperLegTrans[2] * 2];


            //Skeleton
            //Hat
            this.hat = new SceneNode("Hat");

            //Head
            this.head = new SceneNode("headSphere");
            this.rightEye = new SceneNode("rightEye");
            this.leftEye = new SceneNode("leftEye");

            //Body
            this.body = new SceneNode("body");
            this.bodySphere = new SceneNode("bodySphere");

            //Arm
            this.rightShoulder = new SceneNode("rightShoulder");
            this.rightUpperArm = new SceneNode("rightUpperArm");
            this.rElbow = new SceneNode("rightElbow");
            this.rLowerArm = new SceneNode("rightLowerArm");
            this.rHand = new SceneNode("rightHand");

            this.leftShoulder = new SceneNode("leftShoulder");
            this.leftUpperArm = new SceneNode("leftUpperArm");
            this.leftElbow = new SceneNode("leftElbow");
            this.leftLowerArm = new SceneNode("leftLowerArm");
            this.leftHand = new SceneNode("leftHand");

            //Legs
            this.rUpperLeg = new SceneNode("rightUpperLeg");
            this.rKnee = new SceneNode("rightKnee");
            this.rLowerLeg = new SceneNode("rightLowerLeg");


            this.lUpperLeg = new SceneNode("leftUpperLeg");
            this.lKnee = new SceneNode("leftKnee");
            this.lLowerLeg = new SceneNode("leftLowerLeg");

            this.body.add(this.bodySphere);
            this.bodySphere.add(this.head);
            this.head.add(this.hat);

            this.head.add(this.rightEye);
            this.head.add(this.leftEye);

            this.bodySphere.add(this.rightShoulder);
            this.rightShoulder.add(this.rightUpperArm);
            this.rightUpperArm.add(this.rElbow);
            this.rElbow.add(this.rLowerArm);
            this.rLowerArm.add(this.rHand);

            this.bodySphere.add(this.leftShoulder);
            this.leftShoulder.add(this.leftUpperArm);
            this.leftUpperArm.add(this.leftElbow);
            this.leftElbow.add(this.leftLowerArm);
            this.leftLowerArm.add(this.leftHand);

            this.body.add(this.rUpperLeg);
            this.rUpperLeg.add(this.rKnee);
            this.rKnee.add(this.rLowerLeg);

            this.body.add(this.lUpperLeg);
            this.rUpperLeg.add(this.lKnee);
            this.rKnee.add(this.lLowerLeg);

            //Skin
            //Drop
            var hatSkin = new SceneNode("hatSkin");
            hatSkin.add(drop, hatColor);
            mat4.scale(hatSkin.transform(), hatSize);
            mat4.translate(this.hat.transform(), [0, 0, headSize[2]]);
            this.hat.add(hatSkin);

            //Head
            var headSkin = new SceneNode("headSkin");
            headSkin.add(headsphere, headColor);
            mat4.scale(headSkin.transform(), headSize);
            mat4.translate(this.head.transform(), headSphereTranslate);
            this.head.add(headSkin);

            var rEyeSkin = new SceneNode("rEyeSkin");
            rEyeSkin.add(sphere, jointColor);
            mat4.scale(rEyeSkin.transform(), eyeSize);
            mat4.translate(rEyeSkin.transform(), rEyeTranslate);

            var lEyeSkin = new SceneNode("lEyeSkin");
            lEyeSkin.add(sphere, jointColor);
            mat4.scale(lEyeSkin.transform(), eyeSize);
            mat4.translate(lEyeSkin.transform(), lEyeTranslate);

            //Body
            var bodySkin = new SceneNode("bodySkin");
            bodySkin.add(bodyCylinder, jointColor);
            mat4.scale(bodySkin.transform(), bodySize);
            this.body.add(bodySkin);

            var bodySphereSkin = new SceneNode("bodySphereSkin");
            bodySphereSkin.add(sphere, jointColor);
            mat4.scale(bodySphereSkin.transform(), bodySize);
            mat4.translate(this.bodySphere.transform(), bodySphereTranslate);

            //Arm
            var rShoulderSkin = new SceneNode("rShoulderSkin");
            rShoulderSkin.add(sphere, jointColor);
            rShoulderSkin.add(wireSphere, bodyColor);
            mat4.scale(rShoulderSkin.transform(), shoulderSize);
            mat4.translate(this.rightShoulder.transform(), [0, shoulderSize[0] * 2.8, shoulderSize[0]]);

            var rUpperArmSkin = new SceneNode("rUpperArmSkin");
            rUpperArmSkin.add(cylinder, bodyColor);
            mat4.scale(rUpperArmSkin.transform(), upperArmSize);
            mat4.translate(this.rightUpperArm.transform(), [0, 0, -1.8 * shoulderSize[0]]);

            var rElbowSkin = new SceneNode("rElbowSkin");
            rElbowSkin.add(sphere, jointColor);
            mat4.scale(rElbowSkin.transform(), elbowSize);
            mat4.translate(this.rElbow.transform(), [0, 0, -2 * upperArmSize[0]]);

            var rLowerArmSkin = new SceneNode("rLowerArmSkin");
            rLowerArmSkin.add(ellipsoid, bodyColor);
            rLowerArmSkin.add(wireEllipsoid, jointColor);
            mat4.scale(rLowerArmSkin.transform(), lowerArmSize);
            mat4.translate(this.rLowerArm.transform(), [0, 0, -1 * lowerArmSize[0]]);

            var rHandSkin = new SceneNode("rHandSkin");
            rHandSkin.add(cube, bodyColor);
            rHandSkin.add(band, jointColor);
            mat4.scale(rHandSkin.transform(), handSize);
            mat4.translate(this.rHand.transform(), [0, 0, -2 * handSize[0]]);

            ///////////////

            var lShoulderSkin = new SceneNode("lShoulderSkin");
            lShoulderSkin.add(sphere, jointColor);
            lShoulderSkin.add(wireSphere, bodyColor);
            mat4.scale(lShoulderSkin.transform(), shoulderSize);
            mat4.translate(this.leftShoulder.transform(), [0, -shoulderSize[0] * 2.8, shoulderSize[0]]);

            var lUpperArmSkin = new SceneNode("lUpperArmSkin");
            lUpperArmSkin.add(cylinder, bodyColor);
            mat4.scale(lUpperArmSkin.transform(), upperArmSize);
            mat4.translate(this.leftUpperArm.transform(), [0, 0, -1.8 * shoulderSize[0]]);

            var lElbowSkin = new SceneNode("lElbowSkin");
            lElbowSkin.add(sphere, jointColor);
            mat4.scale(lElbowSkin.transform(), elbowSize);
            mat4.translate(this.leftElbow.transform(), [0, 0, -2 * upperArmSize[0]]);

            var lLowerArmSkin = new SceneNode("lLowerArmSkin");
            lLowerArmSkin.add(ellipsoid, bodyColor);
            lLowerArmSkin.add(wireEllipsoid, jointColor);
            mat4.scale(lLowerArmSkin.transform(), lowerArmSize);
            mat4.translate(this.leftLowerArm.transform(), [0, 0, -1 * lowerArmSize[0]]);

            var lHandSkin = new SceneNode("lHandSkin");
            lHandSkin.add(cube, bodyColor);
            lHandSkin.add(band, jointColor);
            mat4.scale(lHandSkin.transform(), handSize);
            mat4.translate(this.leftHand.transform(), [0, 0, -2 * handSize[0]]);


            //Leg
            var rUpperLegSkin = new SceneNode("rUpperLegSkin");
            rUpperLegSkin.add(ellipsoid, bodyColor);
            mat4.scale(rUpperLegSkin.transform(), upperLegSize);
            mat4.translate(rUpperLegSkin.transform(), rUpperLegTrans);


            var rKneeSkin = new SceneNode("rKneeSkin");
            rKneeSkin.add(sphere, jointColor);
            mat4.scale(rKneeSkin.transform(), kneeSize);
            mat4.translate(rKneeSkin.transform(), rKneeTrans);

            var rLowerLegSkin = new SceneNode("rLowerLegSkins");
            rLowerLegSkin.add(ellipsoid, bodyColor);
            rLowerLegSkin.add(wireEllipsoid, jointColor);
            mat4.scale(rLowerLegSkin.transform(), lowerLegSize);
            mat4.translate(rLowerLegSkin.transform(), rLowerLagTrans);

            /////////

            var lUpperLegSkin = new SceneNode("lUpperLegSkin");
            lUpperLegSkin.add(ellipsoid, bodyColor);
            mat4.scale(lUpperLegSkin.transform(), upperLegSize);
            mat4.translate(lUpperLegSkin.transform(), lUpperLegTrans);


            var lKneeSkin = new SceneNode("lKneeSkin");
            lKneeSkin.add(sphere, jointColor);
            mat4.scale(lKneeSkin.transform(), kneeSize);
            mat4.translate(lKneeSkin.transform(), lKneeTrans);

            var lLowerLegSkin = new SceneNode("lLowerLegSkins");
            lLowerLegSkin.add(ellipsoid, bodyColor);
            lLowerLegSkin.add(wireEllipsoid, jointColor);
            mat4.scale(lLowerLegSkin.transform(), lowerLegSize);
            mat4.translate(lLowerLegSkin.transform(), lLowerLagTrans);

            //Verbinde Skelett und Skin
            this.rightEye.add(rEyeSkin);
            this.leftEye.add(lEyeSkin);
            this.rHand.add(rHandSkin);
            this.rLowerArm.add(rLowerArmSkin);
            this.rElbow.add(rElbowSkin);
            this.rightUpperArm.add(rUpperArmSkin);
            this.rightShoulder.add(rShoulderSkin);

            this.leftHand.add(lHandSkin);
            this.leftLowerArm.add(lLowerArmSkin);
            this.leftElbow.add(lElbowSkin);
            this.leftUpperArm.add(lUpperArmSkin);
            this.leftShoulder.add(lShoulderSkin);

            this.head.add(headSkin);
            this.bodySphere.add(bodySphereSkin);
            this.rUpperLeg.add(rUpperLegSkin);
            this.rKnee.add(rKneeSkin);
            this.rLowerLeg.add(rLowerLegSkin);

            this.lUpperLeg.add(lUpperLegSkin);
            this.lKnee.add(lKneeSkin);
            this.lLowerLeg.add(lLowerLegSkin);
            //rotation
        };

        Robot.prototype.rightArmUp = function (angle) {
                mat4.rotate(this.rightShoulder.transform(), angle, [-1, 0, 0]);
            }
            Robot.prototype.rightArmDown = function (angle) {
                mat4.rotate(this.rightShoulder.transform(), angle, [0, 1, 0]);
            }
            Robot.prototype.rightLowerArmUp = function (angle) {
                mat4.rotate(this.rElbow.transform(), angle, [-1, 0, 0]);
            }
            Robot.prototype.rightLowerArmDown = function (angle) {
                mat4.rotate(this.rElbow.transform(),angle, [0, 1, 0]);
            }
            Robot.prototype.leftArmUp = function (angle) {
                mat4.rotate(this.leftShoulder.transform(), angle, [0, 1, 0]);
            }
            Robot.prototype.leftArmDown = function (angle) {
                mat4.rotate(this.leftShoulder.transform(), angle, [0, 1, 0]);
            }
            Robot.prototype.leftLowerArmUp = function (angle) {
                mat4.rotate(this.leftElbow.transform(), angle, [0, 1, 0]);
            }
            Robot.prototype.leftLowerArmDown = function (angle) {
                mat4.rotate(this.leftElbow.transform(), angle, [0, 1, 0]);
            }
            Robot.prototype.rotateLeftHand = function(angle) {
                mat4.rotate(this.leftHand.transform(), angle, [0, 1, 0]);
            }
            Robot.prototype.rotateRightHand = function(angle) {
                mat4.rotate(this.rHand.transform(), angle, [0, 1, 0]);
            }
            Robot.prototype.rotateHeadRight = function(angle) {
                mat4.rotate(this.head.transform(), angle, [0, 0, 1]);
            }
            Robot.prototype.rotateHeadLeft = function(angle) {
                mat4.rotate(this.head.transform(), angle, [0, 0, 1]);
            }
            Robot.prototype.rotateHeadLeft = function(angle) {
            mat4.rotate(this.head.transform(), angle, [0, 0, 1]);
            }

            Robot.prototype.wave = function() {
                mat4.rotate(this.head.transform(), 0.1, [0, 0, 1]);
            }

        // draw method: activate buffers and issue WebGL draw() method
            Robot.prototype.draw = function(gl, program, transformation) {
                this.body.draw(gl, null, transformation);
            };
            return Robot;

        })); // define



