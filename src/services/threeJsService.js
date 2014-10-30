angular.module('Threeangular').
    factory('three', ['$window',function (w) {
        // Local reference to window.THREE object
        var three = w.THREE;
        var config = {};

        // Main program variable
        var program;

        var scene, camera, renderer, controls, stats;
        //var keyboard = new THREEx.KeyboardState();
        //var clock = new THREE.Clock();
        //var projector = new THREE.Projector();
        //var mouseVector = new THREE.Vector3();

        // Canvas element
        config.canvas = w.document.querySelector('canvas');

        // screen attributes
        config.screen = {
            width: 320,
            height: 240
        };

        // camera attributes
        config.camera = {
            viewAngle: 45,
            aspectRatio: function() {
                return config.screen.width / config.screen.height;
            },
            nearPlane: 0.1,
            farPlane: 20000,
            position: {
                x: 0,
                y: 150,
                z: 400
            }
        };

        // Function for the animation loop
        function animate(){
            w.requestAnimationFrame( animate );
            render();
            update();
            devTools();
        }

        function update(){

        }

        function devTools(){

        }

        function render(){
            renderer.render( scene, camera );
        }

        // Three service object
        var threeService = {
            THREE: three,
            init: function(){

                scene = new three.Scene();

                // set up camera
                camera = new three.PerspectiveCamera( config.camera.viewAngle, config.camera.aspectRatio(), config.camera.nearPlane, config.camera.farPlane);

                // add the camera to the scene
                scene.add(camera);

                camera.position.set(config.camera.position.x,config.camera.position.y,config.camera.position.z);
                camera.lookAt(scene.position);

                renderer = new three.WebGLRenderer( {canvas: config.canvas, antialias:true} );

                renderer.setSize(config.screen.width, config.screen.height);

                // Create default lights
                // It shouldn't be here or user should be able to remove them maybe returning an array with them
                var light = new three.PointLight(0xffffff);
                light.position.set(0,250,0);
                scene.add(light);
                var ambientLight = new three.AmbientLight(0x111111);
                scene.add(ambientLight);

                // create a set of coordinate axes to help orient user
                //    specify length in pixels in each direction
                var axes = new three.AxisHelper(10);
                scene.add( axes );

                program(scene,three);

            },
            animate: function (){
                animate();
            },
            setScreenWidth: function(newWidth){
                config.screen.width = newWidth;
            },
            getScreenWidth: function(){
                return config.screen.width;
            },
            setScreenHeight: function(newHeight){
                config.screen.height = newHeight;
            },
            getScreenHeight: function(){
                return config.screen.height;
            },
            setScreenSize: function(newWidth,newHeight){
                config.screen.width = newWidth;
                config.screen.height = newHeight;
            },
            // TODO: viewAngle setter and getter
            getCameraAspectRatio: function () {
                return config.camera.aspectRatio();
            },
            // TODO: nearPlane setter and getter
            // TODO: farPlane setter and getter
            getScene: function(){
                return scene;
            },
            getCamera: function(){
                return camera;
            },
            program: function (programFn) {
                program = programFn;
            }
        };

        return threeService;
    }]);