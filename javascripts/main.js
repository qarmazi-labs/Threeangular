angular.module('ThreeangularGH', ['Threeangular']).
    controller('basicWebGLExample',['$scope','$window',function (s,w) {
        s.config = {
            mode: 'single'
        };

        // This function will be loaded with THREE object
        s.threeCode = {
            ready: true,
            program: function (scene, THREE) {
                var mesh;

                var routines = {
                    start: function (scene, THREE) {
                        var geometry = new THREE.TorusGeometry();
                        var material = new THREE.MeshPhongMaterial({color: 0x4715D, wireframe: false});
                        mesh = new THREE.Mesh(geometry, material);

                        scene.add(mesh);
                    },
                    update: function (scene, THREE) {
                        var timer = Date.now() * 0.0001;
                        mesh.rotation.x = timer * 5;
                        mesh.rotation.y = timer * 2.5;
                    }
                };
                return routines;
            }
        };
    }]).
    controller('basicShaderExample',['$scope','$window',function (s,w) {
        s.config = {
            mode: 'single'
        };

        // This function will be loaded with THREE object
        s.threeJSContent = {
            ready: true,
            program: function (scene, THREE) {
                var shaderUniforms;

                var routines = {
                    start: function (scene, THREE) {

                        shaderUniforms = {
                            time: {type: "f", value: 1.0},
                            mouse: {type: "v2", value: new THREE.Vector2(200, 200)},
                            resolution: {type: "v2", value: new THREE.Vector2(800, 800)}
                        };

                        document.addEventListener('mousemove', function (event) {
                            shaderUniforms.mouse.value = new THREE.Vector2(event.clientX, event.clientY);
                        }, false);

                        //Eventually Material would be easily created inside three service
                        var geometry = new THREE.PlaneBufferGeometry(100, 100);
                        //var material = new THREE.MeshPhongMaterial({wireframe: false});
                        var material = new THREE.ShaderMaterial({
                            uniforms: shaderUniforms,
                            vertexShader: w.document.querySelector('#vertex-shader').text,
                            fragmentShader: w.document.querySelector('#fragment-shader').text
                        });
                        var mesh = new THREE.Mesh(geometry, material);

                        scene.add(mesh);
                    },
                    update: function (scene, THREE) {
                        var now = performance.now();
                        shaderUniforms.time.value = now;
                        // Eventually Material would be easily created inside three service
                        //var geometry = new THREE.BoxGeometry(100,100,100);
                        //var material = new THREE.MeshPhongMaterial({wireframe: false});
                        //var mesh = new THREE.Mesh( geometry,material );
                        //
                        //scene.add(mesh);
                    }
                };
                return routines;
            }
        };
    }]);
