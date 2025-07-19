CMAKE_MINIMUM_REQUIRED(VERSION 3.5)

# Enable C++11
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

IF (WIN32)
	# VCPKG
	if(DEFINED ENV{VCPKG_ROOT} AND NOT DEFINED CMAKE_TOOLCHAIN_FILE)
		set(CMAKE_TOOLCHAIN_FILE "$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake" CACHE STRING "")
	endif()
ENDIF ()

project(GLSL)

# Add GLM experimental features
add_definitions(-DGLM_ENABLE_EXPERIMENTAL)

# Include platform-specific configurations
IF (APPLE)
    # macOS configuration
    INCLUDE(${CMAKE_SOURCE_DIR}/cmake/macos.cmake)
ELSE()
    # Linux/Windows configuration
    FILE(GLOB cmakes ${CMAKE_SOURCE_DIR}/cmake/*.cmake)
    FOREACH(cmake ${cmakes})
        INCLUDE(${cmake})
    ENDFOREACH(cmake)
ENDIF()

MESSAGE(STATUS "stdgl: ${stdgl_libraries}")

ADD_SUBDIRECTORY(src)

IF (EXISTS ${CMAKE_SOURCE_DIR}/sln/CMakeLists.txt)
	ADD_SUBDIRECTORY(sln)
ENDIF()
