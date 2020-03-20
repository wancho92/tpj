import StaticUtils from "../../StaticUtils";

export default class BaseFormat {
   constructor(
      startMarker,
      startMarkerSize,
      sizeFieldSize,
      cmdFieldSize,
      crcFieldSize)
   {
      this._startMarkerOffset = 0;
      this._startMarker = startMarker;
      this._startMarkerSize = startMarkerSize;
      
      this._sizeFieldOffset = this._startMarkerOffset + this._startMarkerSize;
      this._sizeFieldSize = sizeFieldSize;
      
      this._cmdFieldOffset = this._sizeFieldOffset + this._sizeFieldSize;
      this._cmdFieldSize = cmdFieldSize;
      
      this._paramsOffset = this._cmdFieldOffset + this._cmdFieldSize;
      
      this._crcFieldSize = crcFieldSize;
      
      this._minPacketSize = startMarkerSize + sizeFieldSize + cmdFieldSize + crcFieldSize;
      
      if (startMarkerSize > 1) {
         throw new Error("Not implemented yet.");
      }
   }
   
   getPacketStartIndex(buf, offset) {
      return buf.indexOf(this._startMarker, offset);
   }
   
   hasEnoughBytes(buf, offset) {
      const remaining = buf.length - offset;
      
      return remaining >= this._minPacketSize && remaining >= this.getPacketSize(buf, offset);
   }
   
   getMinPacketSize() {
      return this._minPacketSize;
   }
   
   getPacketSize(buf, offset = 0) {
      return this._getNumber(buf, offset + this._sizeFieldOffset, this._sizeFieldSize);
   }
   
   getCommandNumber(buf, offset = 0) {
      return this._getNumber(buf, offset + this._cmdFieldOffset, this._cmdFieldSize);
   }
   
   getParamsOffset() {
      return this._paramsOffset;
   }
   
   isValid(buf) {
      if (!Array.isArray(buf)
         || buf.length < this._minPacketSize
         || this._getNumber(buf, this._startMarkerOffset, this._startMarkerSize) != this._startMarker)
      {
         return false;
      }
      
      const packetSize = this.getPacketSize(buf);
      const crcFieldOffset = packetSize - this._crcFieldSize;
      
      return packetSize >= this._minPacketSize
         && buf.length >= packetSize
         && this._getNumber(buf, crcFieldOffset, this._crcFieldSize) == this._calcCrc(buf, this._sizeFieldOffset, crcFieldOffset);
   }
   
   setStartMarker(buf) {
      this._setNumber(buf, this._startMarkerOffset, this._startMarker, this._startMarkerSize);
   }
   
   setCommandNumber(buf, commandNumber) {
      this._setNumber(buf, this._cmdFieldOffset, commandNumber, this._cmdFieldSize);
   }
   
   setParams(buf, params) {
      this._setNumber(buf, this._sizeFieldOffset, this._minPacketSize + params.length, this._sizeFieldSize);
      
      let offset = this._paramsOffset;
      
      for (const param of params) {
         buf[offset++] = param;
      }
      
      this._setNumber(buf, offset, this._calcCrc(buf, this._sizeFieldOffset, offset), this._crcFieldSize);
   }
   
   _getNumber(buf, offset, size) {
      let number = 0;
      
      for (let i = 0; i < size; i++) {
         number |= buf[offset + i] << (i * 8);
      }
      
      return number;
   }
   
   _setNumber(buf, offset, number, size) {
      for (let i = 0; i < size; i++) {
         buf[offset + i] = number & 0xFF;
         number >>= 8;
      }
   }
   
   _calcCrc(buf, start, end) {
      let crc = 0;
      
      for (let i = start; i < end; i++) {
         crc += buf[i];
      }
      
      return crc;
   }
}
