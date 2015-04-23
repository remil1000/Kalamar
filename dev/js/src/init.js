define([
  'match',
  'hint',
  'vc',
  'tutorial',
  'lib/domReady',
  'util'
], function (matchClass,
	     hintClass,
	     vcClass,
	     tutClass,
	     domReady) {
  domReady(function (event) {
    var obj = {};

    /**
     * Add actions to match entries
     */
    var inactiveLi = document.querySelectorAll(
      '#search > ol > li:not(.active)'
    );
    var i = 0;
    for (i = 0; i < inactiveLi.length; i++) {
      inactiveLi[i].addEventListener('click', function (e) {
	if (this._match !== undefined)
	  this._match.open();
	else {
	  matchClass.create(this).open();
	};
	e.halt();
      });
    };

    /**
     * Toggle the alignment (left <=> right)
     */
    if (i > 0) {
      var br = document.getElementById('button-right');
      if (br !== null) {
	var toggle = document.createElement('a');
	toggle.setAttribute('title', 'toggle Alignment');
	// Todo: Reuse old alignment from cookie!
	var cl = toggle.classList;
	cl.add('align');
	cl.add('right');
	toggle.addEventListener(
	  'click',
	  function (e) {
	    var ol = document.querySelector('#search > ol');
	    ol.toggleClass("align-left", "align-right");
	    this.toggleClass("left", "right");
	  });
	toggle.appendChild(document.createElement('span'))
	  .appendChild(document.createTextNode('Alignment'));
	br.appendChild(toggle);
      };
    };

    /**
     * Init vc
     */
    var input = document.getElementById('vc');
    if (input) {
      input.style.display = 'none';
      var vcname = document.createElement('span');
      vcname.setAttribute('id', 'vc-choose');
      vcname.appendChild(
	document.createTextNode(
	  document.getElementById('vc-name').value
	)
      );
      input.parentNode.insertBefore(vcname, input);

      /**
       * Toggle the Virtual Collection builder
       */
      var vc;
      vcname.onclick = function () {
	var view = document.getElementById('vc-view');

	// The vc is visible
	if (this.classList.contains('active')) {
	  view.removeChild(vc.element());
	  this.classList.remove('active');
	}

	// The vc is not visible
	else {
	  // The vc is not rendered yet
	  if (vc === undefined) {
	    vc = vcClass.create([
	      ['title', 'string'],
	      ['subTitle', 'string'],
	      ['pubDate', 'date'],
	      ['author', 'string']
	    ]);

	    if (KorAP.currentVC !== undefined)
	      vc.fromJson(KorAP.currentVC);
	  };
	  view.appendChild(vc.element());
	  this.classList.add('active');
	};
      };
    };

  
    /**
     * Init Tutorial view
     */
    obj.tutorial = tutClass.create(
      document.getElementById('view-tutorial')
    );

  
    /**
     * Init hint helper
     * has to be final because of
     * reposition
     */
    // Todo: Pass an element, so this works with
    // tutorial pages as well!
    obj.hint = hintClass.create();
    return obj;
  });
});