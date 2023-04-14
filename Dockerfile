FROM ros:melodic

RUN apt update                                                  && \
    apt install -y ros-melodic-rosbridge-server nodejs             ; 


COPY . /catkin_ws/src/ros_joy_js
WORKDIR /catkin_ws  
RUN /bin/bash -c '. /opt/ros/melodic/setup.bash; catkin_make'     && \
    echo 'source /catkin_ws/devel/setup.bash' >> ~/.bashrc           ;


ENTRYPOINT ["bash", "-c"]
CMD ["/catkin_ws/src/ros_joy_js/entrypoint.sh"]

