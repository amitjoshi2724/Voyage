#!/bin/bash

# Set library path for GLEW and other libraries
export LD_LIBRARY_PATH=/usr/lib/aarch64-linux-gnu:$LD_LIBRARY_PATH

echo "🚢 Starting Voyage Graphics Simulation..."

if [ -z "$DISPLAY" ]; then
    echo "No display detected. Starting Xvfb..."
    Xvfb :99 -screen 0 1024x768x24 &
    export DISPLAY=:99
    sleep 1
fi

echo "Display set to: $DISPLAY"
echo "Starting simulation..."

cd /app/build/bin
echo "Current directory: $(pwd)"
echo "Binary exists: $(ls -la menger)"
echo "Library path: $LD_LIBRARY_PATH"

# Ensure binary is executable
chmod +x menger

# Try to run the binary with explicit path
exec /app/build/bin/menger 