
function rosFactory (on_connected_cb) {

    fetch("host").then(res => res.text()).then(hostname => {
        var ros = new ROSLIB.Ros({url: `ws://${hostname}:9090`})

        ros.on('close', ()    => { console.log('ROS ws closed.')      })
        ros.on('error', (err) => { console.log('ROS ws error: ', err) })
        ros.on('connection', () => {
            console.log('Connected to websocket server.')
            on_connected_cb(ros)
        })
    })

}


function topicFactory (ros, on_ready_cb) {

    fetch("topic").then(res => res.text()).then( topicname => {
        topic = new ROSLIB.Topic({
            ros : ros,
            name : topicname,
            messageType : 'geometry_msgs/TwistStamped'
        })
        on_ready_cb(topic)
    })

}


function joystickFactory (html_pos, joy_out_cb, halt=true, rate_ms=25, color="blue") {
    /**
     *  Instance a joystick and attach a callback that is fired every 25 ms
     * 
     *      joy_out_cb( (x,y) => {} )
     */

    let hor_val = 0
    let ver_val = 0
    let interval = null
    let max_distance = 75.0;

    let joy = nipplejs.create({
        zone: document.getElementById(html_pos), // "zone_joystick_l"),
        color: color,
        mode: 'static',
        position: {left: '50%', top: '50%'},
    })

    joy.on("start", (evt, data) => {
        interval = setInterval(() => {
            joy_out_cb(hor_val, ver_val) 
        }, rate_ms)
    })
    
    joy.on("end", () => {
        clearInterval(interval)
        if (halt === true) {
            joy_out_cb(0, 0)
        }
    })

    joy.on("move", (evt, data) => {
        hor_val = Math.cos(data.angle.radian) * data.distance / max_distance
        ver_val = Math.sin(data.angle.radian) * data.distance / max_distance
    })

}




LINEAR_GAIN  = 1.0
ANGULAR_GAIN = 5.0

rosFactory((ros) => {
    topicFactory(ros, (topic) => {  

        right = joystickFactory ("zone_joystick_r", (hor,ver) => {
                topic.publish(new ROSLIB.Message({
                    twist: {
                        linear: {
                            x: hor * LINEAR_GAIN,
                            y: ver * LINEAR_GAIN,
                            z: 0.0
                        }
                    }})
                )
            }
        ) 
        
        left = joystickFactory ("zone_joystick_l", (hor,ver) => {
                topic.publish(new ROSLIB.Message({
                    twist: { 
                        linear: {
                            x: 0.0,
                            y: 0.0,
                            z: ver * LINEAR_GAIN
                        },
                        angular: {
                            x: 0.0,
                            y: 0.0,
                            z: hor * ANGULAR_GAIN 
                        }            
                    }})
                )
            }
        )

    })
})