# Use Ubuntu 20.04 as base image
FROM ubuntu:20.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    pkg-config \
    libglew-dev \
    libglfw3-dev \
    libglm-dev \
    libjpeg-dev \
    libxrandr-dev \
    libxinerama-dev \
    libxcursor-dev \
    libxi-dev \
    mesa-utils \
    xvfb \
    file \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Fix GLM version issue by updating the cmake configuration
RUN sed -i 's/FIND_PACKAGE(glm 0.9.9.0 QUIET)/FIND_PACKAGE(glm QUIET)/' cmake/glm.cmake

# Fix GLFW library path to use dynamic library instead of static
RUN sed -i 's|set(GLFW3_STATIC_LIBRARIES "/usr/local/lib/libglfw3.a")|set(GLFW3_STATIC_LIBRARIES "/usr/lib/aarch64-linux-gnu/libglfw.so")|' cmake/gl3.cmake

# Create build directory and build the project
RUN mkdir -p build && \
    cd build && \
    cmake .. && \
    make -j$(nproc) && \
    ls -la bin/ && \
    file bin/menger

# Create a script to run the simulation with X11 forwarding
COPY run_simulation.sh /app/run_simulation.sh
RUN chmod +x /app/run_simulation.sh

# Set environment variables for library paths
ENV LD_LIBRARY_PATH=/usr/lib/aarch64-linux-gnu:$LD_LIBRARY_PATH

# Set the entrypoint
ENTRYPOINT ["/app/run_simulation.sh"] 