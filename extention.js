// Basic Scratch 3.0 Extension for LEGO NXT using Web Bluetooth

class NXTBluetooth {
  constructor() {
    this.device = null;
    this.server = null;
    this.characteristic = null;
  }

  async connect() {
    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'NXT' }],
        optionalServices: ['battery_service', 'device_information']
      });

      this.server = await this.device.gatt.connect();
      console.log('Connected to NXT brick');
      // You may need to adjust service/characteristic UUIDs based on NXT's implementation
    } catch (error) {
      console.error('Connection failed', error);
    }
  }

  async sendCommand(command) {
    if (!this.server) {
      console.error('NXT not connected');
      return;
    }
    // Placeholder for sending command to NXT
    console.log(`Sending command: ${command}`);
    // You would send bytes over Bluetooth here, based on NXT's protocol
  }
}

const nxtBluetooth = new NXTBluetooth();

(function(Scratch) {
  'use strict';

  class NXTBlocks {
    getInfo() {
      return {
        id: 'nxtBluetooth',
        name: 'LEGO NXT',
        blocks: [
          {
            opcode: 'connectNXT',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Connect to NXT'
          },
          {
            opcode: 'moveForward',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Move forward'
          },
          {
            opcode: 'moveBackward',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Move backward'
          },
          {
            opcode: 'stopMotors',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Stop motors'
          }
        ]
      };
    }

    async connectNXT() {
      await nxtBluetooth.connect();
    }

    async moveForward() {
      await nxtBluetooth.sendCommand('MOVE_FORWARD');
    }

    async moveBackward() {
      await nxtBluetooth.sendCommand('MOVE_BACKWARD');
    }

    async stopMotors() {
      await nxtBluetooth.sendCommand('STOP');
    }
  }

  Scratch.extensions.register(new NXTBlocks());
})(Scratch);
