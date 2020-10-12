/**
 * Simple cookie based session library that stores
 * values in JSON encoded cookies.
 *
 * @author Nils Diewald
 */
define({
  /**
   * Create a new session.
   * Expects a name or defaults to 'korap'
   */
  create : function (name = 'korap') {
    var obj = Object.create(this);
    obj._name = name.toLowerCase();
    obj._hash = {};
    obj._parse();
    return obj;
  },

  /**
   * Get a value based on a key.
   * The value can be complex, as the value is stored as JSON.
   */
  get : function (key) {
    return this._hash[key.toLowerCase()];
  },

  /**
   * Set a value based on a key.
   * The value can be complex, as the value is stored as JSON.
   */
  set : function (key, value) {
    this._hash[key] = value;
    this._store();
  },

  /**
   * Clears the session by removing the cookie
   */
  clear : function () {
    document.cookie = this._name + '=; expires=-1';
  },

  /* Store cookie */
  _store : function () {
    /*
      var date = new Date();
      date.setYear(date.getFullYear() + 1);
    */
    document.cookie =
      this._name + '=' + encodeURIComponent(JSON.stringify(this._hash)) + ';';
  },

  /* Parse cookie */
  _parse : function () {
    var c = document.cookie;
    document.cookie.split(';').forEach(
      function(i) {
        var pair = i.split('=');
        var name = pair[0].trim().toLowerCase();
        if (name === this._name) {
	        if (pair.length === 1 || pair[1].length === 0)
	          return;
          this._hash = JSON.parse(decodeURIComponent(pair[1]));
	        return;
        };
      }
    );
  }
});
