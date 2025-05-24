# GLSL Shader to PNG

A web-based GLSL fragment shader editor that allows you to write, preview, and export shader code as PNG images. This tool runs entirely in your browser using WebGL technology.

## Web Deployment
https://marcusbloomfield.github.io/ShaderToPng/

## Features

- **Real-time Shader Editor**: Write and edit GLSL fragment shaders with immediate visual feedback
- **Live Preview**: See your shader rendered in real-time on a 1024x1024 canvas
- **PNG Export**: Save your shader output as high-quality PNG images
- **Error Handling**: Clear error messages for shader compilation issues
- **No Installation Required**: Runs directly in your web browser
- **Offline Capable**: Works without an internet connection once loaded

## How to Use

1. **Open the Application**: Simply open `index.html` in your web browser
2. **Edit Shader Code**: Modify the GLSL fragment shader code in the text area
3. **Render**: Click "Render Shader" to compile and display your shader
4. **Export**: Click "Save PNG" to download the rendered image

## Default Shader

The application comes with a simple example shader that creates a colorful gradient pattern:

```glsl
precision mediump float;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  gl_FragColor = vec4(uv, 0.5 + 0.5*sin(uv.x * 20.0), 1.0);
}
```

## Technical Specifications

- **Canvas Resolution**: 1024x1024 pixels
- **Shader Language**: GLSL ES (WebGL compatible)
- **Available Uniforms**:
  - `vec2 resolution`: Canvas resolution (1024.0, 1024.0)
  - `gl_FragCoord`: Fragment coordinates

## Browser Requirements

- **WebGL Support**: Required for shader rendering
- **Modern Browser**: Chrome, Firefox, Safari, Edge (recent versions)
- **Hardware**: GPU with WebGL capabilities

## Installation and Setup

### Option 1: Direct Usage
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start creating shaders!

### Option 2: Local Web Server
For development or if you encounter CORS issues:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## File Structure

```
ShaderToPng/
├── index.html          # Main application file
├── README.md           # This file
├── privacypolicy.md    # Privacy policy
└── LICENSE             # License information
```

## Shader Writing Tips

### Basic Structure
Every fragment shader must include:
```glsl
precision mediump float;
uniform vec2 resolution;

void main() {
  // Your shader code here
  gl_FragColor = vec4(r, g, b, a); // Output color
}
```

### Normalized Coordinates
```glsl
vec2 uv = gl_FragCoord.xy / resolution; // Gives coordinates from 0.0 to 1.0
```

### Time Animation
To add time-based animation, you would need to add a time uniform (not currently implemented).

## Troubleshooting

### Common Issues

1. **Black Screen**: Check for shader compilation errors - they will appear in an alert dialog
2. **WebGL Not Supported**: Ensure your browser and hardware support WebGL
3. **Shader Won't Compile**: Verify GLSL syntax and that all variables are properly declared

### Error Messages
- Compilation errors will show the specific line and issue
- Linking errors indicate problems with shader program creation
- Runtime errors may indicate WebGL context issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across different browsers
5. Submit a pull request

## Future Enhancements

Potential features for future development:
- Time uniform for animated shaders
- Multiple texture inputs
- Shader library with examples
- Vertex shader editing
- Custom resolution options
- Shader parameter controls (sliders, color pickers)

## License

This project is licensed under the terms specified in the LICENSE file.

## Technical Notes

- The application uses `preserveDrawingBuffer: true` to enable PNG export
- Shaders are compiled and linked for each render to support real-time editing
- Error handling prevents crashes from invalid shader code
- The vertex shader creates a fullscreen quad for fragment shader rendering

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome  | ✅ Full | Recommended |
| Firefox | ✅ Full | Recommended |
| Safari  | ✅ Full | WebGL support required |
| Edge    | ✅ Full | Modern versions |
| IE      | ❌ No  | Not supported |

---

**Note**: This application runs entirely client-side and does not collect or transmit any personal data. See `privacypolicy.md` for more information. 
