import ZX55Packet, { isValid } from "./ZX55Packet";

export default class ZX55Parser {
   constructor() {
      this._buf = [];
      this._typeHandlers = new Map();
   }
   
   addTypeHandler(type, handler) {
      this._typeHandlers.set(type.CMD, [type, handler]);
   }
   
   parse(data) {
      const packets = [];
      
      this._buf = this._buf.concat(data);
      
      let start = 0;
      
      while (true) {
         start = this._buf.indexOf(0x55, start);
         
         if (start == -1) {
            start = this._buf.length;
            
            break;
         }
         
         const remaining = this._buf.length - start;
         
         if (remaining < 5 || remaining < this._buf[start + 1]) {
            break;
         }
         
         if (!isValid(this._buf, start)) {
            start++;
         } else {
            const typeHandler = this._typeHandlers.get(this._buf[start + 2]);
            const packet = new (typeHandler ? typeHandler[0] : ZX55Packet)(this._buf, start);
            
            if (typeHandler && typeHandler[1]) {
               typeHandler[1](packet);
            } else {
               packets.push(packet);
            }
            
            start += packet.getBuffer()[1];
         }
      }
      
      this._buf.splice(0, start);
      
      return packets;
   }
}
