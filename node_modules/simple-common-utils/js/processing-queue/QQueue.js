import AbstractQueue from "./AbstractQueue";

export default class QQueue extends AbstractQueue {
   constructor() {
      super(new Set());
   }
   
   flush() {
      this._queue.forEach(queue => queue.flush());
      
      super.flush();
   }
   
   get() {
      return this._queue.values().next().value;
   }
   
   _add(queue, keyValue) {
      queue._add(...keyValue);
      
      this._queue.add(queue);
   }
   
   _delete() {
      const queue = this.get();
      
      queue._delete();
      
      if (!queue.size()) {
         this._queue.delete(queue);
      }
   }
   
   async _process() {
      const queue = arguments.length ? arguments[0] : this.get();
      
      queue._autoAdd = false;
      queue._autoDelete = false;
      
      return (await (arguments.length ? queue.process(...arguments[1]) : queue.process())).result;
   }
}
