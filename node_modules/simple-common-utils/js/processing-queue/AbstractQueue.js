export default class AbstractQueue {
   constructor(queue = new Map()) {
      this._queue = queue;
      this._autoAdd = true;
      this._autoDelete = true;
   }
   
   flush() {
      this._queue.clear();
   }
   
   get() {
      return this._queue.entries().next().value;
   }
   
   async process(/* (key, value) | None */) {
      // result = {
      //    processed: true if _process() was called, false otherwise;
      //    result: whatever _process() returned;
      // };
      
      return await (arguments.length ? this._processNew(...arguments) : this._processNext());
   }
   
   size() {
      return this._queue.size;
   }
   
   _add(key, value) {
      this._queue.set(key, value);
   }
   
   _delete() {
      this._queue.delete(this._queue.keys().next().value);
   }
   
   async _processNew(key, value) {
      while (this._processingNew) {
         await new Promise(r => setTimeout(r, 100));
      }
      
      try {
         this._processingNew = true;
         
         const result = {};
         
         result.processed = !this.size();
         
         if (result.processed) {
            result.result = await this._process(key, value);
         }
         
         if (this._autoAdd) {
            this._add(key, value);
         }
         
         return result;
      } finally {
         this._processingNew = false;
      }
   }
   
   async _processNext() {
      const result = {};
      
      if (this._autoDelete) {
         this._delete();
      }
      
      result.processed = !!this.size();
      
      if (result.processed) {
         result.result = await this._process();
      }
      
      return result;
   }
}
