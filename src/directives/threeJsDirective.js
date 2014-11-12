angular.module('Threeangular').
    directive('threeangular', function factory() {
        var threeangularDirective = {
            restrict: 'A',
            compile: function compile(tElement, tAttrs, transclude) {
                return function (s, e, a) {
                };
            },
            controller: 'threeangularCtrl',
            template:'<canvas id="{{config.id}}" width="{{config.width}}" height="{{config.height}}"></canvas>',
            scope: {
                directiveConfig:"=config",
                content:"="
            }
        };

        return threeangularDirective;
    }).
    controller('threeangularCtrl',['$scope','$attrs','three','$window',function(s,a,t,w){
        // Internal config
        s.config = {
            id: a.canvasid,
            width: a.width,
            height: a.height
        };

        // Creates new context for WebGL inside given element;
        var c3d = t.createNewContext(s.config);

        // Default camera properties
        var defaults = {
            // Let user choose between single, dual or quad mode. Dual mode not yet implemented.
            viewportMode: s.directiveConfig.mode || 'single',
            camera : {
                viewAngle: 45,
                aspectRatio: s.config.width / s.config.height,
                nearPlane: 0.1,
                farPlane: 20000,
                position: {
                    x: 0,
                    y: 150,
                    z: 400
                }
            }
        };

        // Set up Three JS application script
        // Always should be included before init.
        // It is for things that should be added just once, not updated on each refresh
        function startWebGL(){
            if(s.content.ready){

                switch(typeof s.content.program){
                    case 'function':
                        c3d.setContent(s.content.program);
                        break;
                    case 'object':
                        if (s.content.program.start != undefined)
                            c3d.start = s.content.program.start;
                        if (s.content.program.update != undefined)
                            c3d.start = s.content.program.update;
                        break;
                    default:
                        //Error
                        break;
                }
                c3d.init(defaults);
            }else{
                w.setTimeout(startWebGL,1000);
            }
        }

        startWebGL();

    }]);
