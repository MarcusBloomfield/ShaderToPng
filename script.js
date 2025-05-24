const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
const errorConsoleOverlay = document.getElementById("errorConsoleOverlay");
const errorConsoleMessage = document.getElementById("errorConsoleMessage");
const shaderTextarea = document.getElementById("shaderInput"); // Renamed for clarity

let shaderEditor; // Will hold the CodeMirror instance

const MAX_SHADER_LENGTH = 10000; // Max characters for shader code

// Rate limiting for shader compilation
const COMPILE_RATE_LIMIT_MS = 500; // Minimum 0.5 seconds between compiles
let lastCompileTimestamp = 0;

const vertexShaderSrc = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }`;

const quadVertices = new Float32Array([
  -1, -1, 1, -1, -1, 1,
  -1, 1, 1, -1, 1, 1
]);

const quadBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

let currentProgram = null;

function initializeShaderEditor() {
    if (shaderTextarea) {
        shaderEditor = CodeMirror.fromTextArea(shaderTextarea, {
            lineNumbers: true,
            mode: "x-shader/x-fragment",  
            theme: "material-darker", 
            matchBrackets: true,
            indentUnit: 2,
            smartIndent: true,
            tabSize: 2,
            indentWithTabs: false
        });
        const cmElement = shaderEditor.getWrapperElement();
        cmElement.style.height = "70.5vh";
        cmElement.style.width = "33%";
        shaderEditor.refresh(); 
        console.log("CodeMirror initialized.");
    } else {
        console.error("shaderInput textarea not found for CodeMirror initialization.");
    }
}

function compileShader(src, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function renderShader() {
  hideErrorConsole();

  const now = Date.now();
  if (now - lastCompileTimestamp < COMPILE_RATE_LIMIT_MS) {
    showErrorConsole("Please wait a moment before rendering again.");
    console.warn("Rate limit hit for shader compilation.");
    return;
  }

  const fragmentShaderSrc = shaderEditor ? shaderEditor.getValue() : (shaderTextarea ? shaderTextarea.value : '');

  if (fragmentShaderSrc.length > MAX_SHADER_LENGTH) {
    showErrorConsole(`Shader code is too long. Maximum length is ${MAX_SHADER_LENGTH} characters.`);
    console.error("Shader length error: Exceeded maximum length.");
    return;
  }

  try {
    const vert = compileShader(vertexShaderSrc, gl.VERTEX_SHADER);
    const frag = compileShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);

    const prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog));
    }

    gl.useProgram(prog);
    currentProgram = prog;

    const positionLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(prog, "resolution");
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    lastCompileTimestamp = Date.now();
    console.log("Shader rendered successfully.");  
  } catch (err) {
    const sanitizedMessage = err.message.replace(/[\r\n\t]/g, ' ').substring(0, 200);
    console.error("Shader compilation error:", err);
    showErrorConsole(sanitizedMessage);
  }
}

function showErrorConsole(message) {
  errorConsoleMessage.textContent = message;
  errorConsoleOverlay.style.display = "flex";
}

function hideErrorConsole() {
  errorConsoleOverlay.style.display = "none";
}

function saveImage() {
  requestAnimationFrame(() => {
    const link = document.createElement("a");
    link.download = "shader_output.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    console.log("Image save initiated."); 
  });
}
 
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        renderShader();
        console.log("Ctrl+S / Cmd+S pressed, shader rendered.");
    }
});
 
document.addEventListener('DOMContentLoaded', () => {
    initializeShaderEditor();
    renderShader(); 

    const buttons = document.querySelectorAll('button');
    let renderButton, saveButton;
    buttons.forEach(button => {
        if (button.textContent === 'Render Shader') {
            renderButton = button;
        }
        if (button.textContent === 'Save PNG') {
            saveButton = button;
        }
    });

    if (renderButton) {
        renderButton.addEventListener('click', renderShader);
    }
    if (saveButton) {
        saveButton.addEventListener('click', saveImage);
    }
    const closeButton = document.querySelector('.error-console-close-button');
    if (closeButton) {
        closeButton.addEventListener('click', hideErrorConsole);
    }
}); 