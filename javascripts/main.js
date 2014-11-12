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
    controller('boidsExample',['$scope','$window',function (s,w) {
        s.config = {
            mode: 'quad'
        };

        var Bird = function () {

            var scope = this;

            THREE.Geometry.call( this );

            v(   5,   0,   0 );
            v( - 5, - 2,   1 );
            v( - 5,   0,   0 );
            v( - 5, - 2, - 1 );

            v(   0,   2, - 6 );
            v(   0,   2,   6 );
            v(   2,   0,   0 );
            v( - 3,   0,   0 );

            f3( 0, 2, 1 );
            // f3( 0, 3, 2 );

            f3( 4, 7, 6 );
            f3( 5, 6, 7 );

            this.computeFaceNormals();

            function v( x, y, z ) {

                scope.vertices.push( new THREE.Vector3( x, y, z ) );

            }

            function f3( a, b, c ) {

                scope.faces.push( new THREE.Face3( a, b, c ) );

            }

        };

        Bird.prototype = Object.create( THREE.Geometry.prototype );

        var Boid = function() {
            var vector = new THREE.Vector3(),
                _acceleration, _width = 500, _height = 500, _depth = 200, _goal, _neighborhoodRadius = 100,
                _maxSpeed = 4, _maxSteerForce = 0.1, _avoidWalls = false;
            this.position = new THREE.Vector3();
            this.velocity = new THREE.Vector3();
            _acceleration = new THREE.Vector3();

            this.setGoal = function ( target ) {
                _goal = target;
            };

            this.setAvoidWalls = function ( value ) {
                _avoidWalls = value;
            };

            this.setWorldSize = function ( width, height, depth ) {
                _width = width;
                _height = height;
                _depth = depth;
            };

            this.run = function ( boids ) {
                if ( _avoidWalls ) {
                    vector.set( - _width, this.position.y, this.position.z );
                    vector = this.avoid( vector );
                    vector.multiplyScalar( 5 );
                    _acceleration.add( vector );
                    vector.set( _width, this.position.y, this.position.z );
                    vector = this.avoid( vector );
                    vector.multiplyScalar( 5 );
                    _acceleration.add( vector );
                    vector.set( this.position.x, - _height, this.position.z );
                    vector = this.avoid( vector );
                    vector.multiplyScalar( 5 );
                    _acceleration.add( vector );
                    vector.set( this.position.x, _height, this.position.z );
                    vector = this.avoid( vector );
                    vector.multiplyScalar( 5 );
                    _acceleration.add( vector );
                    vector.set( this.position.x, this.position.y, - _depth );
                    vector = this.avoid( vector );
                    vector.multiplyScalar( 5 );
                    _acceleration.add( vector );
                    vector.set( this.position.x, this.position.y, _depth );
                    vector = this.avoid( vector );
                    vector.multiplyScalar( 5 );
                    _acceleration.add( vector );
                }/* else {
                 this.checkBounds();
                 }
                 */
                if ( Math.random() > 0.5 ) {
                    this.flock( boids );
                }
                this.move();
            };

            this.flock = function ( boids ) {
                if ( _goal ) {
                    _acceleration.add( this.reach( _goal, 0.005 ) );
                }
                _acceleration.add( this.alignment( boids ) );
                _acceleration.add( this.cohesion( boids ) );
                _acceleration.add( this.separation( boids ) );
            };

            this.move = function () {
                this.velocity.add( _acceleration );
                var l = this.velocity.length();
                if ( l > _maxSpeed ) {
                    this.velocity.divideScalar( l / _maxSpeed );
                }
                this.position.add( this.velocity );
                _acceleration.set( 0, 0, 0 );
            };

            this.checkBounds = function () {
                if ( this.position.x >   _width ) this.position.x = - _width;
                if ( this.position.x < - _width ) this.position.x =   _width;
                if ( this.position.y >   _height ) this.position.y = - _height;
                if ( this.position.y < - _height ) this.position.y =  _height;
                if ( this.position.z >  _depth ) this.position.z = - _depth;
                if ( this.position.z < - _depth ) this.position.z =  _depth;
            };

            //
            this.avoid = function ( target ) {
                var steer = new THREE.Vector3();
                steer.copy( this.position );
                steer.sub( target );
                steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );
                return steer;
            };

            this.repulse = function ( target ) {
                var distance = this.position.distanceTo( target );
                if ( distance < 150 ) {
                    var steer = new THREE.Vector3();
                    steer.subVectors( this.position, target );
                    steer.multiplyScalar( 0.5 / distance );
                    _acceleration.add( steer );
                }
            };

            this.reach = function ( target, amount ) {
                var steer = new THREE.Vector3();
                steer.subVectors( target, this.position );
                steer.multiplyScalar( amount );
                return steer;
            };

            this.alignment = function ( boids ) {
                var boid, velSum = new THREE.Vector3(),
                    count = 0;
                for ( var i = 0, il = boids.length; i < il; i++ ) {
                    if ( Math.random() > 0.6 ) continue;
                    boid = boids[ i ];
                    distance = boid.position.distanceTo( this.position );
                    if ( distance > 0 && distance <= _neighborhoodRadius ) {
                        velSum.add( boid.velocity );
                        count++;
                    }
                }
                if ( count > 0 ) {
                    velSum.divideScalar( count );
                    var l = velSum.length();
                    if ( l > _maxSteerForce ) {
                        velSum.divideScalar( l / _maxSteerForce );
                    }
                }
                return velSum;
            };

            this.cohesion = function ( boids ) {
                var boid, distance,
                    posSum = new THREE.Vector3(),
                    steer = new THREE.Vector3(),
                    count = 0;
                for ( var i = 0, il = boids.length; i < il; i ++ ) {
                    if ( Math.random() > 0.6 ) continue;
                    boid = boids[ i ];
                    distance = boid.position.distanceTo( this.position );
                    if ( distance > 0 && distance <= _neighborhoodRadius ) {
                        posSum.add( boid.position );
                        count++;
                    }
                }
                if ( count > 0 ) {
                    posSum.divideScalar( count );
                }
                steer.subVectors( posSum, this.position );
                var l = steer.length();
                if ( l > _maxSteerForce ) {
                    steer.divideScalar( l / _maxSteerForce );
                }
                return steer;
            };

            this.separation = function ( boids ) {
                var boid, distance,
                    posSum = new THREE.Vector3(),
                    repulse = new THREE.Vector3();
                for ( var i = 0, il = boids.length; i < il; i ++ ) {
                    if ( Math.random() > 0.6 ) continue;
                    boid = boids[ i ];
                    distance = boid.position.distanceTo( this.position );
                    if ( distance > 0 && distance <= _neighborhoodRadius ) {
                        repulse.subVectors( this.position, boid.position );
                        repulse.normalize();
                        repulse.divideScalar( distance );
                        posSum.add( repulse );
                    }
                }
                return posSum;
            };
        };

        // This function will be loaded with THREE object
        s.threeCode = {
            ready: true,
            program: function (scene, THREE) {
                var birds, bird;

                var boids, boid;

                var routines = {
                    start: function(scene, THREE){
                        birds = [];
                        boids = [];
                        for ( var i = 0; i < 200; i ++ ) {
                            boid = boids[ i ] = new Boid();
                            boid.position.x = Math.random() * 400 - 200;
                            boid.position.y = Math.random() * 400 - 200;
                            boid.position.z = Math.random() * 400 - 200;
                            boid.velocity.x = Math.random() * 2 - 1;
                            boid.velocity.y = Math.random() * 2 - 1;
                            boid.velocity.z = Math.random() * 2 - 1;
                            boid.setAvoidWalls( true );
                            boid.setWorldSize( 500, 500, 400 );
                            bird = birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xffffff, side: THREE.DoubleSide } ) );
                            bird.phase = Math.floor( Math.random() * 62.83 );
                            scene.add( bird );
                        }
                    },
                    update: function(scene, THREE){
                        for ( var i = 0, il = birds.length; i < il; i++ ) {
                            boid = boids[ i ];
                            boid.run( boids );
                            bird = birds[ i ];
                            bird.position.copy( boids[ i ].position );
                            color = bird.material.color;
                            color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;
                            bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
                            bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );
                            bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
                            bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;
                        }
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
        s.threeCode = {
            ready: true,
            program: function (scene, THREE) {
                var shaderUniforms;
                var mesh;

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
                        var geometry = new THREE.TorusGeometry();
                        var material = new THREE.ShaderMaterial({
                            uniforms: shaderUniforms,
                            vertexShader: w.document.querySelector('#vertex-shader').text,
                            fragmentShader: w.document.querySelector('#fragment-shader').text
                        });
                        mesh = new THREE.Mesh(geometry, material);

                        scene.add(mesh);
                    },
                    update: function (scene, THREE) {
                        var now = performance.now();
                        var timer = Date.now() * 0.0001;

                        shaderUniforms.time.value = now;
                        mesh.rotation.x = timer * 5;
                        mesh.rotation.y = timer * 2.5;

                    }
                };
                return routines;
            }
        };
    }]);
