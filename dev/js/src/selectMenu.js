define(
  ['menu', 'selectMenu/item'],
  function (menuClass, selectMenuItemClass) {

    return {
      create : function (element) {

	var select = element.getElementsByTagName('select')[0];

	// Prepare list before object upgras
	var list = [];
	var options = select.getElementsByTagName('option');

	for (var i = 0; i < options.length; i++) {

	  var item = options.item(i);
	  var opt = [
	    item.textContent,
	    item.getAttribute('value')
	  ];

	  if (item.hasAttribute('desc'))
	    opt.push(item.getAttribute('desc'));

	  list.push(opt);
	};

	// Create object with list
	var obj = Object.create(menuClass).upgradeTo(this)
	  ._init(list, {
	    itemClass : selectMenuItemClass
	  });

	obj._container = element;
	obj._select = select;
	obj._select.style.display = 'none';

	// Create title
	obj._title = obj._container.appendChild(document.createElement('span'));
	obj._title.appendChild(document.createTextNode(''));
	obj._container.appendChild(obj.element());


	obj._container.addEventListener('click', obj.showSelected.bind(obj));


	// Add index information to each item
	for (i in obj._items) {
	  obj._items[i]._index = i;
	};

	// This is only domspecific
	obj.element().addEventListener('blur', function (e) {
	  this.menu.hide();
	  this.menu.showTitle();
	});


	// In case another tool changes
	// the option via JS - this needs
	// to be reflected!
	select.addEventListener('change', function (e) {
	  this.showTitle();
	}.bind(obj));

	obj.showTitle();
	return obj;
      },

      select : function (index) {
	if (arguments.length > 0) {
	  this._selected = index;
	  this._select.selectedIndex = index;
	};

	return this._selected || 0;
      },

      showSelected : function () {
	this._title.style.display = 'none';
	this._selected = this._select.selectedIndex;
	this.show(this._selected);
	this.focus();
      },

      showTitle : function () {
	var s = this.select();
	this._title.textContent = this.item(
	  this.select()
	).title();
	this._title.style.display = 'inline';
      }
    }
  }
);
