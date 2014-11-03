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
            camera: null,
            lights: [],
            init: function(config){
                var scene, camera, renderer, light, ambientLight;

                scene = new THREE.Scene();
                camera = new THREE.PerspectiveCamera(config.camera.viewAngle, config.camera.aspectRatio, config.camera.nearPlane, config.camera.farPlane);

                // add the camera to the scene
                scene.add(camera);

                camera.position.set(config.camera.position.x,config.camera.position.y,config.camera.position.z);
                camera.lookAt(scene.position);

                renderer = new THREE.WebGLRenderer( {canvas: this.canvas, antialias:true} );

                renderer.setSize(this.width, this.height);

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
                this.camera = camera;

                function render(){
                    renderer.render( scene, camera );
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