SET(pwd ${CMAKE_CURRENT_LIST_DIR})

SET(src "")
AUX_SOURCE_DIRECTORY(${pwd} src)

# Add debuggl.cc from lib/utgraphicsutil
list(APPEND src ${CMAKE_SOURCE_DIR}/lib/utgraphicsutil/debuggl.cc)

add_executable(menger ${src})
message(STATUS "menger added")

# Add include directories
target_include_directories(menger PRIVATE ${CMAKE_SOURCE_DIR}/lib/utgraphicsutil)

# Link libraries
target_link_libraries(menger ${stdgl_libraries})

# Add JPEG library if available
IF (APPLE)
    target_link_libraries(menger ${JPEG_LIBRARIES})
ENDIF()
