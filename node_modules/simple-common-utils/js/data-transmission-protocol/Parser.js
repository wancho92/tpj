import Packet from "./Packet";

export default class Parser {
   static Handler = class {
      constructor(type, handler) {
         this._type = type;
         this._handler = handler;
      }
   }
   
   constructor(format, defaultPacketType = Packet) {
      this._buf = [];
      this._handlers = new Map();
      this._format = format;
      this._defaultPacketType = defaultPacketType;
      
      this.parse = this.parse.bind(this);
   }
   
   addHandler(handler) {
      this._handlers.set(handler._type.CMD, handler);
      
      return this;
   }
   
   parse(data) {
      const packets = [];
      
      this._buf = this._buf.concat(data instanceof Buffer ? Array.from(data) : data);
      
      let offset = 0;
      
      while (true) {
         offset = this._format.getPacketStartIndex(this._buf, offset);
         
         if (offset == -1) {
            offset = this._buf.length;
            
            break;
         }
         
         if (!this._format.hasEnoughBytes(this._buf, offset)) {
            break;
         }
         
         const packetSize = this._format.getPacketSize(this._buf, offset);
         
         const handler = this._handlers.get(this._format.getCommandNumber(this._buf, offset));
         
         try {
            const packet = new (handler ? handler._type : this._defaultPacketType)(this._format).wrap(this._buf, offset, offset + packetSize);
            
            handler && handler._handler ? handler._handler(packet) : packets.push(packet);
            
            offset += packetSize;
         } catch (e) {
            offset++;
         }
      }
      
      this._buf.splice(0, offset);
      
      return packets;
   }
}
