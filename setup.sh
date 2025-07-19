#!/bin/bash

echo "🚢 Setting up Voyage Graphics Simulation..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed. Please install Homebrew first:"
    echo "   https://brew.sh/"
    exit 1
fi

echo "📦 Installing dependencies..."
brew install cmake glew glfw glm libjpeg

echo "🔨 Building the project..."
./run.sh

echo "✅ Setup complete! You can now run './run.sh' to start the simulation." 