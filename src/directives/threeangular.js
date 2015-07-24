'use strict';

var threeangular = angular.module('Threeangular');

threeangular.directive('threeangular',['$window','three', function factory(w,t) {
  'use strict';

  var threeangularDirective = {
    restrict: 'A',
    controller: 'threeangularCtrl',
    scope: {
      directiveConfig:"=config",
      content:"="
    },
    link: function (s,e,a) {
      // Initialize canvas element
      var canvasElement = w.document.createElement('canvas');
      canvasElement.id = s.cfg.canvas.id;
      canvasElement.width = w.parseInt(s.cfg.canvas.width);
      canvasElement.height = w.parseInt(s.cfg.canvas.height);

      angular.element(canvasElement).css({
        width: s.cfg.canvas.width,
        height: s.cfg.canvas.height
      });

      e[0].appendChild(canvasElement);

      var context = t.createNewContext(canvasElement);

      // Set up Three JS application script
      // Always should be included before init.
      // It is for things that should be added just once, not updated on each refresh

      function startWebGL(){
        if(s.contentObj){

          switch(typeof s.contentObj.program){
            case 'function':
              context.setContent(s.contentObj.program);
              break;
            case 'object':
              if (typeof s.contentObj.program.start !== 'undefined')
                context.start = s.contentObj.program.start;
              if (typeof contentObj.program.update !== 'undefined')
                context.start = s.contentObj.program.update;
              break;
            default:
              //Error
              break;
          }
          context.init(s.cfg.env);
        }else{
          w.setTimeout(startWebGL,1000);
        }
      }

      startWebGL();
    }
  };

  return threeangularDirective;
}]);

threeangular.controller('threeangularCtrl',['$scope','$attrs','$window',function(s,a,w){
  'use strict';

  var execMode  = a.exec,
    instanceObj = a.obj,
    width       = a.width,
    height      = a.height,
    content     = a.content;

  s.configObj;
  s.contentObj;

  // Standalone mode
  if (execMode === 'standalone') {
    if (typeof instanceObj !== 'string') {
      // todo: throw exception
      console.log('Directive\'s data-obj attribute must be a string');
    } else {
      if (instanceObj === '') {
        // todo: throw exception
        console.log('Directive\'s data-obj attribute is of zero length');
      } else {
        if (typeof w[instanceObj] !== 'object') {
          // todo: throw exception
          console.log(instanceObj+' object should exist on global scope');
        } else {

          // todo: check for both objects to exist
          s.configObj = w[instanceObj].config;
          s.contentObj = w[instanceObj].content;

        }
      }
    }
  // Angular mode
  } else {
    if (execMode === 'angular') {
      console.log('Angular mode');
      //  todo: working on standalone mode
    } else {
      //  todo: throw exception unknown execution path
      console.log('Unknown execution path');
    }
  }

  // Internal configuration variable
  s.cfg = {};

  // todo: All of this should be created inside a function, with a default Threeangular object and extend

  // Canvas element configuration
  s.cfg.canvas = {
    id: s.configObj.canvas.id || 'demo',
    width: s.configObj.canvas.width || '640px',
    height: s.configObj.canvas.height || '480px'
  };

  s.cfg.env = {
    inputMode: s.configObj.threeangular.inputMode || 'free',
    viewportMode: s.configObj.threeangular.viewportMode || 'single',
    autostart: s.configObj.threeangular.autostart || true
  };

  if (s.cfg.env.viewportMode === 'single') {
    s.cfg.env.camera = {
      viewAngle: s.configObj.threeangular.camera.viewAngle || 45,
      aspectRatio: s.configObj.threeangular.camera.aspectRatio || s.cfg.canvas.width / s.cfg.canvas.height,
      nearPlane: s.configObj.threeangular.camera.nearPlane || 0.1,
      farPlane: s.configObj.threeangular.camera.farPlane || 20000,
      position: s.configObj.threeangular.camera.position || { x: 0, y: 150, z: 400 }
    }
  } else {
    // todo: multiple cameras
    s.cfg.env.cameras = [];
  }
}]);
