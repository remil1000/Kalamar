/**
 * Container for several containerItem style items. Functions like a mini menu with next, prev, add etc propagation,
 * but no event handling or slider or lengthField. Supposed to be subelement to a (container)menu class item.
 * 
 * @author Leo Repp
 */

"use strict";
define([
  'container/containeritem'   //TODO why does this not work!!!
], function (
  defaultContainerItemClass
) {

  return {
    /**
     * 
     * @param {Array<object>} listOfContainerItems List of items that will be placed within the container and that realise some of the functions supplied in containeritem.js
     * @param {object} params May contain attribute containerItemClass for a base class all containerItems build upon
     * @returns The container object
     */
    create : function (listOfContainerItems, params) {
      var obj = Object.create(this);
      obj._init(listOfContainerItems, params);
      return obj;
    },

    _init : function (listOfContainerItems, params){
      if (params !== undefined && params["containerItemClass"] !== undefined){
        this._containerItemClass = params["containerItemClass"];
      } else {
        this._containerItemClass = defaultContainerItemClass;
      };
      var el = document.createElement("ul");
      el.style.outline = 0;
      el.setAttribute('tabindex', 0);
      el.classList.add('menu', 'container'); //container class allows for more stylesheet changes

      this._el = el;
      this._prefix = undefined; //required for re-setting the menus pointer correctly
      // after having upgraded a new item scss style to the prefix object.

      this.items = new Array();
      //items are stored in the order they are added in. This includes the prefix.
      if (listOfContainerItems !== undefined) {
        for (let item of listOfContainerItems) {
          this.addItem(item);
        }
      }

      this.position = undefined; //undefined = not in container,
      // 0 to length-1 = in container

      this._prefixPosition = undefined; //Required so that switching
      // to prefix by default is supported


      
      //t._el.classList.add('visible'); //Done by containermenu


    },

    addItem : function (item) {
      var cItem = this._containerItemClass.create().upgradeTo(item);
      cItem._menu = this._menu; //if not set then undefined, but thats OK
      this.items.push(cItem);
      this._el.appendChild(cItem.element());
      return cItem;
    },

    addMenu : function (menu) {
      this._menu = menu;
      if (this._prefix !== undefined) {
        this._menu._prefix = this._prefix; // better than going via classList or something
      };
      for (let item of this.items) {
        item._menu=menu;
      }
    },

    addPrefix : function (prefix) {
      prefix.isSelectable =  function () {
        return this.isSet(); //TODO check!
      }
      this._prefixPosition = this.items.length;
      var prefItem = this.addItem(prefix);
      this._prefix = prefItem;
      if (this._menu !== undefined){
        this._menu._prefix=prefItem;
      }
    },

    /**
     * Exit the container unconditionally. Required so that active returns the
     * correct result. Called when the prefix or similar resets the currently visual
     * field.
     */
    exit : function () {
      if (this.position !== undefined) {
        this.item().active(false);
        this.position = undefined;
      };
    },

    element : function () {
      return this._el;
    },

    destroy : function () {
      for (let item of this.items){
        delete item['_menu'];
      }
    },

    /**
     * @returns whether an item within the container is active (by checking this.position)
     */
    active : function () {
      return this.position !== undefined;
    },

    /**
     * Getter for items
     * @param {Integer} index [optional] Index of to select item. If left blank this.position.
     * @returns item at location index
     */
    item : function (index) {
      if (index === undefined) return this.items[this.position];
      return this.items[index];
    },

    /**
     * 
     * Make the container active without having called prev or next.
     * Occurs whenever the prefix makes the
     * menus list empty while we had it selected.
     * This potentially requires adjusting this.position.
     */
     makeActive : function () {
      if (this.position === undefined) {
        if (this._prefix.isSelectable()) {
          this.position = this._prefixPosition; //make prefix active if it exists
          this.item().active(true);
        } else if (this.liveLength() > 0) {
          this.position = 0;
          this._prefix.active(false); // usually the menu makes the prefix active anyway.
          this.item().active(true);
        }
      }
    },

    /**
     * Move on to the next item in container. Returns true if we then leave the container, false otherwise.
     */
    next : function() {
      if (this.position !== undefined){
        this.item().active(false);
        this.position++;
      } else {
        this.position = 0;
      };
      if (this.position >= this.length()) {
        this.position=undefined;
        return true;
      };
      while (!this.item().isSelectable()) {
        this.position++;
        if (this.position >= this.length()) {
          this.position=undefined;
          return true;
        }
      };
      this.item().active(true);
      return false;
    },

    /**
     * Move on to the previous item in container. Returns true if we then leave the container, false otherwise.
     */
    prev : function() {
      if (this.position !== undefined){
        this.item().active(false);
        this.position = (this.position-1)
      } else {
        this.position = (this.items.length-1);
      }
      if (this.position<0) {
        this.position=undefined;
        return true;
      }
      while (!this.item().isSelectable()) {
        this.position--;
        if (this.position<0){
          this.position=undefined;
          return true;
        };
      };
      this.item().active(true);
      return false;
    },

    further : function () {
      const item = this.item();
      if (item["further"] !== undefined) {
        item["further"].bind(item).apply();
      };
    },

    enter : function (event) {
      this.item().onclick(event);
    },

    chop : function () {
      for (let item of this.items) {
        item.chop();
      }
    },

    add : function (letter) {
      for (let item of this.items) {
        item.add(letter);
      }
    },

    length : function () {
      return this.items.length;
    },

    /**
     * 
     * @returns The number of items that are selectable. Is the actual length of the list.
     */
    liveLength : function () {
      var ll = 0;
      for (let item of this.items){
        if (item.isSelectable()){
          ll++;
        }
      }
      return ll;
    }

};
});
