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
                owConfig:"=config",
                content:"="
            }
        };

        return threeangularDirective;
    }).
    controller('threeangularCtrl',['$scope','$attrs','three','$window',function(s,a,t,w){
        s.config = {
            id: a.canvasid,
            width: a.width,
            height: a.height
        };
        console.log('Hi inside Three JS directive.');
        t.setScreenSize(s.config.width,s.config.height);

        // Set up Three JS application script
        // Always should be included before init.
        // It is for things that should be added just once, not updated on each refresh

        function startWebGL(){
            if(s.content.ready){
                t.program(s.content.program);

                t.init();
                t.animate();
            }else{
                w.setTimeout(startWebGL,1000);
            }
        }

        startWebGL();

    }]);
