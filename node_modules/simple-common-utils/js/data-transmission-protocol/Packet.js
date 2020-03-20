import StaticUtils from "../StaticUtils";

export default class Packet {
   constructor(format, commandNumber, params = []) {
      this._format = format;
      
      if (arguments.length > 1) {
         this._buf = [];
         
         this._format.setStartMarker(this._buf);
         this._format.setCommandNumber(this._buf, commandNumber);
         
         this.setParams(params);
      }
   }
   
   wrap(buffer, start = 0, end = buffer.length) {
      this._buf = buffer.slice(start, end);

      StaticUtils.verify(this._format.isValid(this._buf), `[ ${this._buf.join(", ")} ] is not a valid packet.`);
      
      return this;
   }
   
   setParams(params) {
      this._format.setParams(this._buf, params);
   }
   
   getRawBuffer() {
      return this._buf;
   }
   
   _verifyCmdValidity(cmd) {
      const commandNumber = this._format.getCommandNumber(this._buf);
      
      StaticUtils.verify(commandNumber == cmd, `${this.constructor.name}: the command number must be ${cmd}, not ${commandNumber}.`);
   }
   
   _verifySizeValidity(size) {
      const packetSize = this._format.getPacketSize(this._buf);
      
      StaticUtils.verify(this._buf.length == packetSize, `${this.constructor.name}: the internal buffer length (${this._buf.length}) isn't equal to the packet size stored in it (${packetSize}).`);
      
      const wholeSize = size + this._format.getMinPacketSize();
      
      StaticUtils.verify(packetSize == wholeSize, `${this.constructor.name}: the packet size must be ${wholeSize}, not ${packetSize}.`);
   }
}
