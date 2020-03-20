import StaticUtils from "../StaticUtils";

export function isValid(buf, start = 0) {
   return Array.isArray(buf)
      && (buf.length - start) >= 5
      && buf[start] == 0x55
      && buf[start + 1] >= 5
      && (buf.length - start) >= buf[start + 1]
      && calcCrc(buf, start + 1, start + buf[start + 1] - 2) == ((buf[start + buf[start + 1] - 1] << 8) | buf[start + buf[start + 1] - 2]);
}

function calcCrc(buf, start = 0, end = buf.length) {
   let crc = 0;
   
   for (let i = start; i < end; i++) {
      crc += buf[i];
   }
   
   return crc;
}

export default class ZX55Packet {
   /**
    * Creates a packet. Valid invocation variants:
    *  1) new ZX55Packet(command number),
    *  2) new ZX55Packet(command number, byte1, ..., byteN),
    *  3) new ZX55Packet(byte array[, start])
    */
   constructor() {
      const check = Array.isArray(arguments[0]);
      
      if (check) {
         this._buf = arguments[0].slice(arguments[1], arguments[1] + arguments[0][arguments[1] + 1]);
         
         StaticUtils.verify(isValid(this._buf), `${arguments[0]} is not a valid packet.`);
         
         this._cmd = this._buf[2];
      } else {
         const params = Array.from(arguments);
         
         this._cmd = params.shift();
         this._buf = [1 + 1 + 1 + params.length + 2, this._cmd].concat(params);
         
         const crc = calcCrc(this._buf);
         
         this._buf.unshift(0x55);
         this._buf.push(crc & 0xFF);
         this._buf.push(crc >> 8);
      }
   }
   
   getBuffer() {
      return this._buf;
   }
   
   getCommandNumber() {
      return this._cmd;
   }
   
   _assertCmdValidity(typeName, cmd) {
      StaticUtils.verify(this.getCommandNumber() == cmd, `${typeName} instances must have the command number of ${cmd}.`);
   }
   
   _assertSizeValidity(typeName, size) {
      StaticUtils.verify(this.getBuffer().length == size, `${typeName} instances must have the size of ${size}, not of ${this.getBuffer().length}.`);
   }
}
