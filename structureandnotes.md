# Notes on the structure of threeangular

Threeangular can be used in an angular environment or as a standalone plugin, of course it requires angular but interacts with a global object used as namespace instead of local scope objects.

The first thing the directive does is to check the exec mode and getting the corresponding configuration object. Variables can be defined as attributes in both paths but object has precedence over attributes.

The configuration object has the following structure:

    config: {
        id: 'my-canvas',
        width: '800px',
        height: '800px',
        mode: 'PointCloud',
        viewports: 1,
        
    }
    
If viewportMode is single threeangular looks for a camera object, other way it looks for cameras array.

config.threenagular.autostart is used to start the script automatically, if the content is loaded async it should not be used

