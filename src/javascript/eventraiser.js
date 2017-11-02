"use strict";

/**
 * @callback eventHandler
 * @param {EventRaiser} eventRaiser
 * @param {...*} parameters
 */

export default class EventRaiser
{
  constructor()
  {
    this.eventHandlers = {};
  }
  
  /**
   * Create a new event for listeners to listen to
   * @param {string} name 
   */
  addEvent(name)
  {
    this.eventHandlers[name] = [];
  }

  /**
   * Trigger an event by name
   * 
   * @param {string} name event name
   * @param {...*} parameters extra parameters to pass to listeners
   */
  triggerEvent(name, ...parameters)
  {
    let eventHandlers = this.eventHandlers[name];
    
    for(let eventHandler of eventHandlers)
      eventHandler(this, ...parameters);
  }
  
  /**
   * Create an event listener.
   * 
   * Make sure to keep a list of listeners on any objects that
   *  become destroyed to prevent calls on destroyed objects
   * 
   * @param {string} event 
   * @param {function} callback 
   * @returns {EventListener}
   */
  on(event, callback){
    this.eventHandlers[event].push(callback);

    return new EventListener(this, event, callback);
  }
}

class EventListener
{
  constructor(eventRaiser, event, callback)
  {
    this.eventRaiser = eventRaiser;
    this.event = event;
    this.callback = callback;
  }

  destroy()
  {
    let eventHandlers = this.eventRaiser.eventHandlers[this.event];
    let id = eventHandlers.indexOf(this.callback);

    eventHandlers.splice(id, 1);
  }
}