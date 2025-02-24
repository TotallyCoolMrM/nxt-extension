// LEGO NXT Full-Featured Extension for TurboWarp

(function(ext) {
  let device = null;

  // Cleanup
  ext._shutdown = function() {
    if (device) {
      device.close();
    }
  };

  ext._getStatus = function() {
    return device ? {status: 2, msg: 'Connected to NXT'} : {status: 1, msg: 'Disconnected'};
  };

  // Connect to NXT
  ext.connect_nxt = function(callback) {
    navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'NXT' }],
      optionalServices: [0x1101]
    })
    .then(dev => dev.gatt.connect())
    .then(server => {
      device = server;
      callback();
    })
    .catch(error => {
      console.error(error);
      alert('Failed to connect to NXT');
    });
  };

  // Motor Control
  ext.run_motor = function(port, speed, duration) {
    if (!device) return;
    let portMap = { 'A': 0x01, 'B': 0x02, 'C': 0x04 };
    let command = new Uint8Array([
      0x00, 0x04, // Direct command with response
      0x80,       // SetOutputState
      portMap[port],
      speed,
      0x01,       // Motor On
      0x00,       // Regulation Mode
      0x00, 0x00, // Turn Ratio
      0x20,       // RunState Running
      duration & 0xFF, (duration >> 8) & 0xFF, (duration >> 16) & 0xFF, (duration >> 24) & 0xFF
    ]);
    device.writeValue(command);
  };

  // Play Tone
  ext.play_tone = function(frequency, duration) {
    if (!device) return;
    let command = new Uint8Array([
      0x00, 0x03, // Direct command with response
      0x94,       // PlayTone
      frequency & 0xFF, (frequency >> 8) & 0xFF,
      duration & 0xFF, (duration >> 8) & 0xFF
    ]);
    device.writeValue(command);
  };

  // Touch Sensor
  ext.when_touch_sensor_pressed = function(port) {
    // Placeholder: Implement sensor polling logic
    return false;
  };

  // Extension Blocks
  var descriptor = {
    blocks: [
      ['w', 'connect to NXT', 'connect_nxt'],
      [' ', 'run motor %m.motorPort at speed %n for %n ms', 'run_motor', 'A', 50, 1000],
      [' ', 'play tone at %n Hz for %n ms', 'play_tone', 440, 500],
      ['b', 'when touch sensor on port %m.sensorPort pressed', 'when_touch_sensor_pressed', '1']
    ],
    menus: {
      motorPort: ['A', 'B', 'C'],
      sensorPort: ['1', '2', '3', '4']
    }
  };

  ScratchExtensions.register('NXT Full Extension', descriptor, ext);

})({});
