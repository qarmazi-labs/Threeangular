angular.module('Threeangular').
    factory('three', ['$window',function (w) {
        // Local reference to window.THREE object
        var THREE = w.THREE;

        // A variable for saving WebGL contexts
        // should be used and object with constructor
        var contexts = [];

        /**
         * WebGLContext constructor
         * @param canvasID - Canvas selector for new context
         * @constructor
         */

        function WebGLContext(config){
            var prueba = 'prueba';
            // Canvas element
            this.canvas = w.document.querySelector('#'+config.id) || w.document.querySelector('canvas');
            this.width = config.width || 480;
            this.height = config.height || 360;
        }

        /**
         *
         * @type {{}}
         */
        WebGLContext.prototype = {
            // Object for keeping global variables
            globals: {},
            scene: null,
            cameras: [],
            lights: [],
            init: function(config){

                // Object variables to local
                var width = this.width,
                    height = this.height;

                var scene, mainCamera, renderer, light, ambientLight;

                // todo: dual or quad mode, this should be optionally selectable
                // dual/quad mode block start
                var secondaryCamera, // Top Right Camera
                    thirdCamera, // Bottom Left Camera
                    fourthCamera; // Bottom Right Camera
                // dual/quad mode block end

                scene = new THREE.Scene();
                mainCamera = new THREE.PerspectiveCamera(config.camera.viewAngle, config.camera.aspectRatio, config.camera.nearPlane, config.camera.farPlane);
                mainCamera.position.set(config.camera.position.x,config.camera.position.y,config.camera.position.z);
                mainCamera.lookAt(scene.position);

                // add the main camera to the scene
                scene.add(mainCamera);
                this.cameras.push(mainCamera);

                // todo: dual or quad mode, this should be optionally selectable
                // dual/quad mode block start

                if(config.viewportMode=='quad'){
                    // Secondary camera normally Top Right
                    secondaryCamera = new THREE.OrthographicCamera(
                        width / -4, width / 4, height / 4, height / -4, // Left, Right, Top, Bottom
                        -5000, 10000 );           			// Near Far Planes
                    secondaryCamera.lookAt( new THREE.Vector3(0,-1,0) );
                    scene.add(secondaryCamera);
                    this.cameras.push(secondaryCamera);

                    // Third camera normally Bottom Left
                    thirdCamera = new THREE.OrthographicCamera(
                        width / -4, width / 4, height / 4, height / -4, // Left, Right, Top, Bottom
                        -5000, 10000 );           			// Near Far Planes
                    thirdCamera.lookAt( new THREE.Vector3(0,0,-1) );
                    scene.add(thirdCamera);
                    this.cameras.push(thirdCamera);

                    // Fourth camera normally Bottom Right
                    fourthCamera = new THREE.OrthographicCamera(
                        width / -4, width / 4, height / 4, height / -4, // Left, Right, Top, Bottom
                        -5000, 10000 );           			// Near Far Planes
                    fourthCamera.lookAt( new THREE.Vector3(1,0,0) );
                    scene.add(fourthCamera);
                    this.cameras.push(fourthCamera);
                }

                // dual/quad mode block end

                renderer = new THREE.WebGLRenderer( {canvas: this.canvas, antialias:true, alpha: true} );

                renderer.setSize(width, height);

                // Create default lights
                // It shouldn't be here or user should be able to remove them maybe returning an array with them
                light = new THREE.PointLight(0xffffff);
                light.position.set(0,250,0);
                scene.add(light);
                this.lights.push(light);

                ambientLight = new THREE.AmbientLight(0x111111);
                scene.add(ambientLight);
                this.lights.push(ambientLight);

                // Runs user initialization just once
                if(this.start){
                    this.start(scene, THREE);
                }

                // Assign local variable to object's ones
                this.scene = scene;

                function render(){

                    // todo: dual or quad mode, this should be optionally selectable

                    if(config.viewportMode=='single'){
                        renderer.render( scene, mainCamera );
                    }

                    // dual/quad mode block start

                    if(config.viewportMode=='quad'){
                        // Check view-source:http://mrdoob.github.io/three.js/examples/webgl_multiple_views.html

                        // Top left corner
                        renderer.setViewport( 1, 0.5 * height + 1, 0.5 * width, 0.5 * height );
                        renderer.setScissor( 1, 0.5 * height + 1, 0.5 * width, 0.5 * height );
                        renderer.enableScissorTest ( true );
                        mainCamera.updateProjectionMatrix();
                        renderer.setClearColor( new THREE.Color().setRGB( 1.0, 1.0, 1.0 ), 0.0 );
                        renderer.render( scene, mainCamera );

                        // Top right corner
                        renderer.setViewport( 0.5 * width, 0.5 * height, 0.5 * width, 0.5 * height );
                        renderer.setScissor( 0.5 * width, 0.5 * height, 0.5 * width, 0.5 * height );
                        renderer.enableScissorTest ( true );
                        secondaryCamera.updateProjectionMatrix();
                        renderer.setClearColor( new THREE.Color().setRGB( 0.5, 0.3, 0.5 ), 0.5 );
                        renderer.render( scene, secondaryCamera );

                        // Bottom left corner
                        renderer.setViewport( 0, 0,   0.5 * width, 0.5 * height );
                        renderer.setScissor( 0, 0,   0.5 * width, 0.5 * height );
                        renderer.enableScissorTest ( true );
                        thirdCamera.updateProjectionMatrix();
                        renderer.setClearColor( new THREE.Color().setRGB( 0.5, 0.5, 0.3 ), 0.5 );
                        renderer.render( scene, thirdCamera );

                        // Bottom right corner
                        renderer.setViewport( 0.5 * width, 0,   0.5 * width, 0.5 * height );
                        renderer.setScissor( 0.5 * width, 0,   0.5 * width, 0.5 * height );
                        renderer.enableScissorTest ( true );
                        fourthCamera.updateProjectionMatrix();
                        renderer.setClearColor( new THREE.Color().setRGB( 0.3, 0.5, 0.5 ), 0.5 );
                        renderer.render( scene, fourthCamera );
                    }

                    // dual/quad mode block end

                }

                var localizedUpdate = this.update;
                var localizeddevTools = this.devTools;

                function animate(){
                    w.requestAnimationFrame( animate );
                    render();
                    localizedUpdate( scene, THREE );
                    localizeddevTools( scene, THREE );
                }

                animate();

            },
            setContent: function(program){
                var content = program(this.scene,THREE);
                this.start = content.start;
                this.update = content.update;
            },
            start: function () {
                console.log('Just once...')
                // Todo: Instead of overwriting this function add an array of functions and run foreach
            },
            update: function () {
                //console.log('Every frame request...')
                // Todo: Instead of overwriting this function add an array of functions and run foreach
            },
            devTools: function () {
                //console.log('Did you set development tools...?')
                // Todo: Add functions to start and update stacks...
            }
        };

        // create a set of coordinate axes to help orient user
        //    specify length in pixels in each direction
        //var axes = new three.AxisHelper(10);
        //scene.add( axes );

        ////var keyboard = new THREEx.KeyboardState();
        ////var clock = new THREE.Clock();
        ////var projector = new THREE.Projector();
        ////var mouseVector = new THREE.Vector3();

        // Three service object
        var threeService = {
            createNewContext: function(config){
                var context;

                // Maybe a name variable as context ID
                context = new WebGLContext(config);
                contexts.push(context);

                return context;
            }
        };

        return threeService;
    }]);