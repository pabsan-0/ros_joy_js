#! /bin/bash

sleep 1
xdg-open http://127.0.0.1:"$1"
rostopic echo "$2"

