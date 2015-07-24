#Threeangular

Threeangular is an Angular wrapper for Three.js WebGL library.
It works by creating an Angular module with a directive.

## Features

## Installation

You should include all js files within the src dir, there is still no unified or minified version.

## Usage

Include the threeangular="" attribute in the canvas container element, and the directive will add it as a child.
The directive has the following attributes:

- exec: Defines where to expect directive configuration, 'standalone' looks for a global object, 'angular' looks for a controller. 
- width: Canvas element width
- height: Canvas element height
- canvasid: Canvas element id
- config: object for Three.js configuration
- content: object for Three.js scene initialization. Two required properties `ready: boolean` and `program: function(THREE,scene)`

```
<div id="canvas-container" threangular="" width="480" height="360" canvasid="mainCanvas" config="config" content="threeJSContent"></div>
```
#Modes

There are several execution modes:
- Free: You are free to do whatever you want.
- PointCloud: A point cloud is displayed with camera, controls and easy to access points and properties.
- Structure: Same as PointCloud but with lines between elements.
- Data: A collection of 3D data visualization tools.