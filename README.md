# Voyage Graphics Simulation

A 3D graphics simulation featuring ocean waves, boat physics, and interactive camera controls.

## 🚀 Quick Start (Recommended)

### Prerequisites
- **macOS**: [Homebrew](https://brew.sh/) installed
- **Linux**: `sudo apt-get install build-essential cmake libglew-dev libglfw3-dev libglm-dev libjpeg-dev`
- **Windows**: Install dependencies via vcpkg or similar

### Running the Simulation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Setup and run (macOS):**
   ```bash
   ./setup.sh  # First time only - installs dependencies and builds
   ./run.sh    # Run the simulation
   ```

   **Or manually:**
   ```bash
   brew install cmake glew glfw glm libjpeg  # Install dependencies
   ./run.sh  # Build and run
   ```

3. **For Linux users:**
   ```bash
   sudo apt-get install build-essential cmake libglew-dev libglfw3-dev libglm-dev libjpeg-dev
   ./run.sh
   ```

## 🎮 Controls

- **Camera Movement:**
  - `W/A/S/D` - Move camera forward/left/backward/right
  - `Arrow Keys` - Move camera up/down
  - `Mouse Drag` - Rotate camera view
  - `Q/E` - Roll camera clockwise/counterclockwise

- **Boat Controls:**
  - `I/K` - Move boat forward/backward
  - `J/L` - Rotate boat left/right

- **Special Features:**
  - `C` - Toggle FPS mode on/off
  - `B` - Toggle additive blending for over-water caustics
  - `Ctrl+T` - Generate huge tidal wave
  - `Ctrl+O` - Toggle ocean on/off
  - `Q` - Reset to default third-person view (must exit FPS mode first)

## 🌊 Features

- **Ocean Simulation:** Realistic wave physics with multiple wave components
- **Boat Physics:** Interactive boat that responds to ocean waves
- **Dynamic Lighting:** Real-time lighting and shadow effects
- **Camera System:** Flexible camera with multiple control modes
- **Visual Effects:** Caustics, reflections, and atmospheric effects

## 🔧 Technical Details

- **Graphics API:** OpenGL 4.1+ (with Metal support on macOS)
- **Dependencies:** GLFW, GLEW, GLM, JPEG
- **Language:** C++
- **Build System:** CMake

## 🐳 Alternative: Docker (Advanced)

If you prefer using Docker (for cross-platform compatibility):

```bash
# Build and run with Docker
docker-compose up --build

# Or run directly
docker build -t voyage-simulation .
docker run --rm -it --entrypoint="" voyage-simulation bash -c "export LD_LIBRARY_PATH=/usr/lib/aarch64-linux-gnu:\$LD_LIBRARY_PATH && Xvfb :99 -screen 0 1024x768x24 & export DISPLAY=:99 && cd /app/build/src && chmod +x menger && ./menger"
```

**Note:** Docker requires X11 forwarding setup on macOS/Windows.

## 🛠️ Troubleshooting

### Build Issues
- **macOS**: Make sure you have Xcode Command Line Tools installed (`xcode-select --install`)
- **Linux**: Install the required development packages
- **Windows**: Use vcpkg or install dependencies manually

### Performance Issues
- The simulation runs best on systems with dedicated graphics cards
- Reduce window size if experiencing lag
- Close other graphics-intensive applications

## 📁 Project Structure

- `src/` - Source code
- `cmake/` - CMake configuration files
- `lib/` - External dependencies
- `Dockerfile` - Docker configuration (alternative)
- `setup.sh` - Easy setup script for macOS
- `run.sh` - Build and run script

## 📄 License

This project was my (Amit Joshi) UT CS 378H (Computer Graphics Honors) Final Project