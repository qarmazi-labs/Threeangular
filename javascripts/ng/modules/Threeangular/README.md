#Threeangular

Threeangular is an Angular wrapper for Three.js WebGL library.
It works by creating an Angular module with a directive.

## Features

- Multiple instances (planned)
- Scene Initialization
- No need to modify the directive itself
- Components (planned)
- Injection at several stages (planned)

## Installation

You should include all js files within the src dir, there is still no unified or minified version.

## Usage

Include the threeangular="" attribute in the canvas container element, and the directive will add it as a child.
The directive has the following attributes:

- width: Canvas element width
- height: Canvas element height
- canvasid: Canvas element id
- config: object for Three.js configuration
- content: object for Three.js scene initialization. Two required properties `ready: boolean` and `program: function(THREE,scene)`

```
<div id="canvas-container" threangular="" width="480" height="360" canvasid="mainCanvas" config="config" content="threeJSContent"></div>
```
