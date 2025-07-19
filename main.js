// "use strict" is recommended.
"use strict";

/*
  This file is a WebGL translation of your project.
  It translates the C++ camera (using GLM) and many shaders into a simplified WebGL version.
  Note: WebGL doesn't support geometry/tessellation shader stages,
  so here we use only a basic vertex shader + fragment shader.
*/

/* ===================== Camera Class ===================== */
// (This is a JavaScript version of your camera.cc/camera.h code.)
class Camera {
  constructor() {
    this.panSpeed = 0.1;
    this.rollSpeed = 0.1;
    this.rotationSpeed = 0.05;
    this.zoomSpeed = 0.1;
    this.camera_distance = 3.0;

    // Initialize with the same values as in your C++ code.
    this.eye = vec3.fromValues(0.0, 10.0, 10.0);
    this.look = vec3.fromValues(0.0, -10.0, -10.0);
    this.camUp = vec3.fromValues(0.0, 1.0, 0.0);
    this.update();
  }

  update() {
    // Compute right vector: camRight = normalize(cross(look, camUp))
    this.camRight = vec3.create();
    vec3.cross(this.camRight, this.look, this.camUp);
    vec3.normalize(this.camRight, this.camRight);
    
    // Compute the camera's center point: center = eye + (camera_distance * look)
    let scaledLook = vec3.create();
    vec3.scale(scaledLook, this.look, this.camera_distance);
    this.center = vec3.create();
    vec3.add(this.center, this.eye, scaledLook);
  }

  getViewMatrix() {
    // Build a view matrix (like glm::lookAt)
    let viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, this.eye, this.center, this.camUp);
    return viewMatrix;
  }

  left() {
    let move = vec3.create();
    vec3.scale(move, this.camRight, -this.panSpeed);
    vec3.add(this.eye, this.eye, move);
    this.update();
  }
  right() {
    let move = vec3.create();
    vec3.scale(move, this.camRight, this.panSpeed);
    vec3.add(this.eye, this.eye, move);
    this.update();
  }
  forward() {
    let move = vec3.create();
    vec3.scale(move, this.look, this.zoomSpeed);
    vec3.add(this.eye, this.eye, move);
    this.update();
  }
  backward() {
    let move = vec3.create();
    vec3.scale(move, this.look, -this.zoomSpeed);
    vec3.add(this.eye, this.eye, move);
    this.update();
  }
  up() {
    let move = vec3.create();
    vec3.scale(move, this.camUp, this.panSpeed);
    vec3.add(this.eye, this.eye, move);
    this.update();
  }
  down() {
    let move = vec3.create();
    vec3.scale(move, this.camUp, -this.panSpeed);
    vec3.add(this.eye, this.eye, move);
    this.update();
  }
  clockwise() {
    // Rotate camera's up vector around the look vector (roll)
    let q = quat.create();
    quat.setAxisAngle(q, this.look, this.rollSpeed);
    let newUp = vec3.create();
    vec3.transformQuat(newUp, this.camUp, q);
    this.camUp = newUp;
    this.update();
  }
  counterclockwise() {
    let q = quat.create();
    quat.setAxisAngle(q, this.look, -this.rollSpeed);
    let newUp = vec3.create();
    vec3.transformQuat(newUp, this.camUp, q);
    this.camUp = newUp;
    this.update();
  }
  swivel(dir) {
    // Swivel the camera based on mouse delta (dir is an array: [dx, dy])
    let turn = vec3.create();
    let temp1 = vec3.create();
    let temp2 = vec3.create();
    vec3.scale(temp1, this.camRight, dir[0]);
    vec3.scale(temp2, this.camUp, dir[1]);
    vec3.sub(turn, temp1, temp2);
    let axis = vec3.create();
    vec3.cross(axis, turn, this.look);
    let q = quat.create();
    quat.setAxisAngle(q, axis, this.rotationSpeed);
    vec3.transformQuat(this.look, this.look, q);
    vec3.transformQuat(this.camUp, this.camUp, q);
    this.update();
  }
}

/* ===================== Shader Sources ===================== */
// Since WebGL does not support advanced stages (geometry, tesselation),
// we define a basic vertex shader and fragment shader:
const vertexShaderSource = `
  attribute vec4 a_Position;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * a_Position;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0); // Orange color
  }
`;

/* ===================== Shader & Program Setup ===================== */
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('Shader compile error: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

/* ===================== Geometry Creation ===================== */
// A simple translation of your CreateFloorTriangles (from main.cc)
function createFloorTriangles() {
  const vertices = new Float32Array([
    0.0, -2.0,  0.0, 1.0,
   -20.0, -2.0, -20.0, 1.0,
   -20.0, -2.0,  20.0, 1.0,
    20.0, -2.0, -20.0, 1.0,
    20.0, -2.0,  20.0, 1.0,
  ]);
  const indices = new Uint16Array([
    0, 2, 1,
    0, 4, 2,
    0, 3, 4,
    0, 1, 3,
  ]);
  return { vertices, indices };
}

// A simple translation of your CreateSphere function (from main.cc)
// (Using an icosahedron as an approximation)
function createSphere() {
  const t = (1.0 + Math.sqrt(5.0)) / 2.0;
  const vertices = new Float32Array([
    -1,  t, 0, 1,
     1,  t, 0, 1,
    -1, -t, 0, 1,
     1, -t, 0, 1,
     0, -1,  t, 1,
     0,  1,  t, 1,
     0, -1, -t, 1,
     0,  1, -t, 1,
     t,  0, -1, 1,
     t,  0,  1, 1,
    -t,  0, -1, 1,
    -t,  0,  1, 1,
  ]);
  const indices = new Uint16Array([
     0, 11, 5,
     0, 5, 1,
     0, 1, 7,
     0, 7, 10,
     0, 10, 11,
     1, 5, 9,
     5, 11, 4,
     11, 10, 2,
     10, 7, 6,
     7, 1, 8,
     3, 9, 4,
     3, 4, 2,
     3, 2, 6,
     3, 6, 8,
     3, 8, 9,
     4, 9, 5,
     2, 4, 11,
     6, 2, 10,
     8, 6, 7,
     9, 8, 1,
  ]);
  return { vertices, indices };
}

/* ===================== Global Variables & Initialization ===================== */
let gl;
let shaderProgram;
let programInfo;
let camera = new Camera();
let floorBuffers = null;
let sphereBuffers = null;

function main() {
  const canvas = document.getElementById('glCanvas');
  gl = canvas.getContext('webgl');
  if (!gl) {
    alert("WebGL isn't available, please use a different browser.");
    return;
  }
  
  // Initialize the shader program.
  shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
  programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'a_Position'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'u_ProjectionMatrix'),
      viewMatrix: gl.getUniformLocation(shaderProgram, 'u_ViewMatrix'),
    },
  };
  
  // Create geometry buffers.
  floorBuffers = initBuffers(gl, createFloorTriangles());
  sphereBuffers = initBuffers(gl, createSphere());
  
  // Setup event listeners.
  setupEventListeners(canvas);
  
  // Start the render loop.
  requestAnimationFrame(render);
}

// Initialize buffers given a geometry object (with vertices and indices)
function initBuffers(gl, geometry) {
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);
  
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);
  
  return {
    vertex: vertexBuffer,
    index: indexBuffer,
    vertexCount: geometry.indices.length,
  };
}

/* ===================== Render Loop ===================== */
function render(now) {
  now *= 0.001; // convert to seconds
  
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  
  // Set up the projection matrix.
  const fieldOfView = 45 * Math.PI / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1, zFar = 100.0;
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  
  // Get the view matrix from our Camera.
  const viewMatrix = camera.getViewMatrix();
  
  // Use the shader program.
  gl.useProgram(programInfo.program);
  
  // Set the shader uniforms.
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, viewMatrix);
  
  // Draw the floor.
  drawObject(floorBuffers);
  
  // Draw the sphere.
  drawObject(sphereBuffers);
  
  requestAnimationFrame(render);
}

function drawObject(buffers) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    4,             // components per vertex (x, y, z, w)
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);
  gl.drawElements(gl.TRIANGLES, buffers.vertexCount, gl.UNSIGNED_SHORT, 0);
}

/* ===================== Event Handling ===================== */
function setupEventListeners(canvas) {
  // Keyboard events for camera movements.
  window.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'a': // pan left
        camera.left();
        break;
      case 'd': // pan right
        camera.right();
        break;
      case 'w': // move forward
        camera.forward();
        break;
      case 's': // move backward
        camera.backward();
        break;
      case 'ArrowUp': // pan up
        camera.up();
        break;
      case 'ArrowDown': // pan down
        camera.down();
        break;
      case 'q': // rotate clockwise
        camera.clockwise();
        break;
      case 'e': // rotate counterclockwise
        camera.counterclockwise();
        break;
    }
  });
  
  // Mouse events for camera swivel.
  let isDragging = false;
  let prevMouse = [0, 0];
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouse = [e.clientX, e.clientY];
  });
  canvas.addEventListener('mouseup', () => {
    isDragging = false;
  });
  canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
      let newMouse = [e.clientX, e.clientY];
      let dx = newMouse[0] - prevMouse[0];
      let dy = newMouse[1] - prevMouse[1];
      camera.swivel([dx, dy]);
      prevMouse = newMouse;
    }
  });
}

/* ===================== Start ===================== */
window.onload = main; 