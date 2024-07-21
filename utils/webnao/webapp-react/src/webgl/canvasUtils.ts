const vertexShaderSource = `
attribute vec4 a_position;

varying vec2 v_texCoord;

void main() {
  gl_Position = a_position;
  v_texCoord = a_position.xy * vec2(0.5, -0.5) + 0.5;
}
`;

const yuvyShaderSource = `
precision mediump float;
uniform sampler2D u_image;

varying vec2 v_texCoord;



void main() {
  vec4 c = texture2D(u_image, v_texCoord);
  float ym = c.r * 1.1643828125;
  gl_FragColor = vec4(
    ym + 1.59602734375 * c.b - 0.87078515625,
    ym - 0.39176171875 * c.g - 0.81296875 * c.b + 0.52959375,
    ym + 2.017234375   * c.g - 1.081390625,
    1
  );
}
`;

const saliencyShaderSource = `
precision mediump float;
uniform sampler2D u_image;

varying vec2 v_texCoord;



void main() {
  vec4 c = texture2D(u_image, v_texCoord);
  
  gl_FragColor = vec4(
    c.r * 255.0,
    c.r * 255.0,
    c.r * 255.0,
    1
  );
}
`;
const JPEGvertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_texCoord;
    }
  `;

// Fragment shader source code
const JPEGfragmentShaderSource = `
    precision mediump float;
    uniform sampler2D u_texture;
    varying vec2 v_texCoord;

    void main() {
      gl_FragColor = texture2D(u_texture, v_texCoord);
    }
  `;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Couldn't create the shader");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const err = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(err || 'something');
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) {
    throw new Error("Couldn't create the GL program");
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const err = gl.getShaderInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(err || 'error');
  }
  return program;
}

export function drawImage(gl: WebGLRenderingContext, image: Uint8Array, width: number, height: number) {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export function drawRGBImage(gl: WebGLRenderingContext, image: Uint8Array, width: number, height: number) {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export function initSaliencyGLContext(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('NO WEBGL SUPPORT!');
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, saliencyShaderSource);

  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = new Float32Array([1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  // YUV last last one is trash is trash.
  gl.activeTexture(gl.TEXTURE0);
  const imageTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, imageTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  return gl;
}

export function initYUVYGLContext(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('NO WEBGL SUPPORT!');
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, yuvyShaderSource);

  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = new Float32Array([1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  // YUV last last one is trash is trash.
  gl.activeTexture(gl.TEXTURE0);
  const imageTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, imageTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  return gl;
}

export function initJPEGGLContext(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('NO WEBGL SUPPORT!');
  }
  // Create vertex shader
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, JPEGvertexShaderSource);

  // Create fragment shader
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, JPEGfragmentShaderSource);
  // Create shader program
  const program = createProgram(gl, vertexShader, fragmentShader);

  // Specify vertices and texture coordinates for a rectangle
  const vertices = [
    -1,
    1, // top left
    -1,
    -1, // bottom left
    1,
    -1, // bottom right
    1,
    1, // top right
  ];

  const texCoords = [
    0,
    0, // top left
    0,
    1, // bottom left
    1,
    1, // bottom right
    1,
    0, // top right
  ];

  // Create vertex buffer
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Create texture coordinate buffer
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

  // Specify attribute locations and enable them
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
  gl.enableVertexAttribArray(positionLocation);
  gl.enableVertexAttribArray(texCoordLocation);

  // Set the vertex buffer as the current buffer and specify its layout
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Set the texture coordinate buffer as the current buffer and specify its layout
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  // Create a texture
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters for the texture
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

  return gl;
}
/**
 *
 * @param yuvy Y'UYV,...
 * @returns Y'UV0,YUV0,...
 */
export function padYUV(yuvy: Uint8Array): Uint8Array {
  const res = [];
  for (let i = 0; i < yuvy.length; i += 4) {
    const y1 = yuvy[i]; // Y'
    const u = yuvy[i + 1]; // U
    const y2 = yuvy[i + 2]; // Y
    const v = yuvy[i + 3]; // V
    res.push(y1, u, v, 0);
    res.push(y2, u, v, 0);
  }
  return new Uint8Array(res);
}
