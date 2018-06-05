/**
 * The plugin system is based
 * on registered widgets (iframes) from foreign services.
 * The client component is loaded independently
 * in a plugin and communicates with the embedding
 * KorAP service.
 *
 * @author Nils Diewald
 */

/*
* TODO:
*   Some methods require bidirectional
*   calling, like
*   - getKoralQuery()
*   this probably should be done using a callback,
*   like fetch({data}, function () {}, '*'), that will
*   add a unique ID to the message and will call on the cb
*   once the answer to that message arrives.
*/
/*
 * When loading the script from a remote KorAP instance,
 * demand using integrity check:
 * https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
 */

var cs = document.currentScript;

(function () {
  "use strict";

  var obj = {

    /**
     * Create new plugin
     */
    create : function () {
      return Object.create(this)._init();
    },

    /*
     * Initialize plugin
     */
    _init : function () {
      this.widgetID = window.name;
      this.server = cs.getAttribute('data-server') || '*';
      return this;
    },

    // Send a message
    _sendMsg : function (data) {
      data["originID"] = this.widgetID;
      window.parent.postMessage(data, this.server);
    },

    /**
     * Send a log message to the embedding KorAP
     */
    log : function (code, msg) {
      this._sendMsg({
        action : 'log',
        code : code,
        msg : msg
      });
    },

    /**
     * Send a resize command to the
     * embedding KorAP
     */
    resize : function () {
      var de = document.documentElement;
      var height = de.scrollHeight;

      // Add assumed scrollbar height
      if (de.scrollWidth > de.clientWidth) {
        height += 14;
      };
      this._sendMsg({
        'action' : 'resize',
        'height' : height
      });
    }
  };

  // Create plugin on windows load
  window.onload = function () {
    window.KorAPlugin = window.KorAPlugin || obj.create();
    window.KorAPlugin.resize();
  };
})();
