FROM ros:melodic

RUN apt update                                                  && \
    apt install -y ros-melodic-rosbridge-server                 && \
    mkdir -p /catkin_ws/src/ros_joy_js                          && \ 
    cd /catkin_ws/src/                                          && \ 
    catkin_make                                                 && \ 
    echo 'source /catkin_ws/src/devel/setup.bash' >> ~/.bashrc     ;

COPY . /catkin_ws/src/ros_joy_js

ENTRYPOINT ["bash", "-c"]
CMD ["bash"]

