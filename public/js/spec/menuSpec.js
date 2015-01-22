KorAP.OwnMenuItem = {
  create : function (params) {
    return Object.create(KorAP.MenuItem).upgradeTo(KorAP.OwnMenuItem)._init(params);
  },
  content : function (content) {
    if (arguments.length === 1) {
      this._content = content;
    };
    return this._content;
  },
  _init : function (params) {
    if (params[0] === undefined)
      throw new Error("Missing parameters");

    this._content = document.createTextNode(params[0]);
    this._lcField = ' ' + this.content().textContent.toLowerCase();

    return this;
  }
};

KorAP.ComplexMenuItem = {
  create : function (params) {
    return Object.create(KorAP.MenuItem)
      .upgradeTo(KorAP.ComplexMenuItem)
      ._init(params);
  },
  content : function (content) {
    if (arguments.length === 1) {
      this._content = content;
    };
    return this._content;
  },
  _init : function (params) {
    if (params[0] === undefined)
      throw new Error("Missing parameters");

    var r = document.createElement('div');
    for (var i = 1; i <= params.length; i++) {
      var h = document.createElement('h' + i);
      h.appendChild(document.createTextNode(params[i-1]));
      r.appendChild(h);
    };

    this._content = r;
    this._lcField = ' ' + this.content().textContent.toLowerCase();

    return this;
  }
};


describe('KorAP.MenuItem', function () {
  it('should be initializable', function () {
    expect(
      function() { KorAP.MenuItem.create([]) }
    ).toThrow(new Error("Missing parameters"));

    expect(
      function() { KorAP.OwnMenuItem.create([]) }
    ).toThrow(new Error("Missing parameters"));

    var mi = KorAP.OwnMenuItem.create(["Baum"]);
    expect(mi.element().firstChild.nodeValue).toEqual('Baum');
    expect(mi.lcField()).toEqual(' baum');
  });

  it('should be activatable and deactivateable by class', function () {
    var menuItem = KorAP.OwnMenuItem.create(['Test']);

    expect(menuItem.active()).toBe(false);
    expect(menuItem.element().getAttribute("class")).toBe(null);
    menuItem.active(true);
    expect(menuItem.active()).toBe(true);
    expect(menuItem.element().getAttribute("class")).toEqual("active");
    menuItem.active(false); // Is active
    expect(menuItem.active()).toBe(false);
    expect(menuItem.element().getAttribute("class")).toEqual("");
    menuItem.active(true);
    expect(menuItem.active()).toBe(true);
    expect(menuItem.element().getAttribute("class")).toEqual("active");

    menuItem = KorAP.OwnMenuItem.create(['Spiegel']);
    expect(menuItem.active()).toBe(false);
    expect(menuItem.element().getAttribute("class")).toBe(null);
    menuItem.active(false); // Is not active
    expect(menuItem.active()).toBe(false);
    expect(menuItem.element().getAttribute("class")).toBe(null);
  });

  it('should be set to boundary', function () {
    var menuItem = KorAP.OwnMenuItem.create(['CoreNLP']);
    expect(menuItem.active()).toBe(false);
    expect(menuItem.element().getAttribute("class")).toBe(null);

    // Set active
    menuItem.active(true);
    expect(menuItem.active()).toBe(true);
    expect(menuItem.noMore()).toBe(false);
    expect(menuItem.element().getAttribute("class")).toEqual("active");

    // Set no more
    menuItem.noMore(true);
    expect(menuItem.active()).toBe(true);
    expect(menuItem.noMore()).toBe(true);
    expect(menuItem.element().getAttribute("class")).toEqual("active no-more");

    // No no more
    menuItem.noMore(false);
    expect(menuItem.active()).toBe(true);
    expect(menuItem.noMore()).toBe(false);
    expect(menuItem.element().getAttribute("class")).toEqual("active");

    // Set no more, deactivate
    menuItem.noMore(true);
    menuItem.active(false);
    expect(menuItem.active()).toBe(false);
    expect(menuItem.noMore()).toBe(true);
    expect(menuItem.element().getAttribute("class")).toEqual("no-more");

    // Set active
    menuItem.active(true);
    expect(menuItem.active()).toBe(true);
    expect(menuItem.noMore()).toBe(true);
    expect(menuItem.element().getAttribute("class")).toEqual("no-more active");
  });


  it('should be highlightable', function () {
    // Highlight in the middle
    var menuItem = KorAP.OwnMenuItem.create(['CoreNLP']);
    menuItem.highlight("ren");
    expect(menuItem.element().innerHTML).toEqual("Co<mark>reN</mark>LP");

    menuItem.lowlight();
    expect(menuItem.element().innerHTML).toEqual("CoreNLP");

    var plain = "<div><h1>CoreNLP</h1><h2>corenlp/</h2></div>";

    // Starting highlight
    menuItem = KorAP.ComplexMenuItem.create(['CoreNLP', 'corenlp/']);
    menuItem.highlight("cor");
    expect(menuItem.element().innerHTML).toEqual("<div><h1><mark>Cor</mark>eNLP</h1><h2><mark>cor</mark>enlp/</h2></div>");

    menuItem.lowlight();
    expect(menuItem.element().innerHTML).toEqual(plain);

    // Starting highlight - short
    menuItem = KorAP.ComplexMenuItem.create(['CoreNLP', 'corenlp/']);
    menuItem.highlight("c");
    expect(menuItem.element().innerHTML).toEqual("<div><h1><mark>C</mark>oreNLP</h1><h2><mark>c</mark>orenlp/</h2></div>");

    menuItem.lowlight();
    expect(menuItem.element().innerHTML).toEqual(plain);

    // Highlight at the end
    menuItem = KorAP.ComplexMenuItem.create(['CoreNLP', 'corenlp/']);
    menuItem.highlight("nlp");
    expect(menuItem.element().innerHTML).toEqual("<div><h1>Core<mark>NLP</mark></h1><h2>core<mark>nlp</mark>/</h2></div>");

    menuItem.lowlight();
    expect(menuItem.element().innerHTML).toEqual(plain);

    // Highlight at the end - short
    menuItem = KorAP.ComplexMenuItem.create(['CoreNLP', 'corenlp/']);
    menuItem.highlight("p");
    expect(menuItem.element().innerHTML).toEqual("<div><h1>CoreNL<mark>P</mark></h1><h2>corenl<mark>p</mark>/</h2></div>");

    menuItem.lowlight();
    expect(menuItem.element().innerHTML).toEqual(plain);

    // No highlight
    menuItem = KorAP.ComplexMenuItem.create(['CoreNLP', 'corenlp/']);
    menuItem.highlight("xp");
    expect(menuItem.element().innerHTML).toEqual(plain);

    menuItem.lowlight();
    expect(menuItem.element().innerHTML).toEqual(plain);

    // Highlight in the middle - first
    menuItem = KorAP.ComplexMenuItem.create(['CoreNLP', 'corenlp/', 'This is my Example']);
    menuItem.highlight("ren");
    expect(menuItem.element().innerHTML).toEqual("<div><h1>Co<mark>reN</mark>LP</h1><h2>co<mark>ren</mark>lp/</h2><h3>This is my Example</h3></div>");

    plain = "<div><h1>CoreNLP</h1><h2>corenlp/</h2><h3>This is my Example</h3></div>"

    menuItem.lowlight();
    expect(menuItem.element().innerHTML).toEqual(plain);

    // Highlight in the middle - second
    menuItem = KorAP.ComplexMenuItem.create(['CoreNLP', 'corenlp/', 'This is my Example']);
    menuItem.highlight("ampl");
    expect(menuItem.element().innerHTML).toEqual("<div><h1>CoreNLP</h1><h2>corenlp/</h2><h3>This is my Ex<mark>ampl</mark>e</h3></div>");

    menuItem.lowlight();
    expect(menuItem.element().innerHTML).toEqual(plain);

    // Highlight in the middle - both
    menuItem = KorAP.ComplexMenuItem.create(['CoreNLP', 'corenlp/', 'This is my Example']);
    menuItem.highlight("e");
    expect(menuItem.element().innerHTML).toEqual("<div><h1>Cor<mark>e</mark>NLP</h1><h2>cor<mark>e</mark>nlp/</h2><h3>This is my <mark>E</mark>xampl<mark>e</mark></h3></div>");

    menuItem.lowlight();
    expect(menuItem.element().innerHTML).toEqual(plain);

    // Highlight in the end - second
    menuItem = KorAP.ComplexMenuItem.create(['CoreNLP', 'corenlp/', 'This is my Example']);
    menuItem.highlight("le");
    expect(menuItem.element().innerHTML).toEqual("<div><h1>CoreNLP</h1><h2>corenlp/</h2><h3>This is my Examp<mark>le</mark></h3></div>");

    menuItem.lowlight();
    expect(menuItem.element().innerHTML).toEqual(plain);

    // Highlight at the beginning - second
    menuItem = KorAP.ComplexMenuItem.create(['CoreNLP', 'corenlp/', 'This is my Example']);
    menuItem.highlight("this");
    expect(menuItem.element().innerHTML).toEqual("<div><h1>CoreNLP</h1><h2>corenlp/</h2><h3><mark>This</mark> is my Example</h3></div>");

    menuItem.lowlight();
    expect(menuItem.element().innerHTML).toEqual(plain);
  });

});


/*

describe('KorAP.MenuItem', function () {

});


describe('KorAP.Menu', function () {

  var list = [
    ["Constituency", "c=", "Example 1"],
    ["Lemma", "l="],
    ["Morphology", "m=", "Example 2"],
    ["Part-of-Speech", "p="],
    ["Syntax", "syn="]
  ];


  it('should be initializable', function () {

    var menu = KorAP.Menu.create("cnx/", list);
    expect(menu.context).toEqual('cnx/');
    expect(menu.element.nodeName).toEqual('UL');
    expect(menu.element.style.opacity).toEqual("0");

    KorAP.limit = 8;

    // view
    menu.show();

    // First element in list
    expect(menu.item(0).active()).toBe(true);
    expect(menu.item(0).noMore()).toBe(true);
    
    // Middle element in list
    expect(menu.item(2).active()).toBe(false);
    expect(menu.item(2).noMore()).toBe(false);

    // Last element in list
    expect(menu.item(menu.length - 1).active()).toBe(false);
    expect(menu.item(menu.length - 1).noMore()).toBe(true);
  });

  it('should be visible', function () {
    var menu = KorAP.Menu.create("cnx/", list);
    expect(menu.delete()).toBe(undefined);

    KorAP.limit = 3;

    expect(menu.show()).toBe(undefined);
    expect(menu.element.firstChild.innerHTML).toEqual("<strong>Constituency</strong><span>Example 1</span>");
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Lemma</strong>");
    expect(menu.element.childNodes[1].getAttribute("data-action")).toEqual("l=");
    expect(menu.element.childNodes[2].innerHTML).toEqual("<strong>Morphology</strong><span>Example 2</span>");
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Check boundaries
    expect(menu.element.childNodes[0].classList.contains("no-more")).toBe(true);
    expect(menu.element.childNodes[1].classList.contains("no-more")).toBe(false);
    expect(menu.element.childNodes[2].classList.contains("no-more")).toBe(false);
  });


  it('should be filterable', function () {
    var menu = KorAP.Menu.create("cnx/", list);

    KorAP.limit = 3;

    expect(menu.show("o")).toBe(undefined);
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>C<em>o</em>nstituency</strong><span>Example 1</span>");
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>M<em>o</em>rphology</strong><span>Example 2</span>");
    expect(menu.element.childNodes[2].innerHTML).toEqual("<strong>Part-<em>o</em>f-Speech</strong>");
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Check boundaries
    expect(menu.element.childNodes[0].classList.contains("no-more")).toBe(true);
    expect(menu.element.childNodes[1].classList.contains("no-more")).toBe(false);
    expect(menu.element.childNodes[2].classList.contains("no-more")).toBe(true);


    KorAP.limit = 2;

    expect(menu.show("o")).toBe(undefined);
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>C<em>o</em>nstituency</strong><span>Example 1</span>");
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>M<em>o</em>rphology</strong><span>Example 2</span>");
    expect(menu.element.childNodes[2]).toBe(undefined);

    // Check boundaries
    expect(menu.element.childNodes[0].classList.contains("no-more")).toBe(true);
    expect(menu.element.childNodes[1].classList.contains("no-more")).toBe(false);
    expect(menu.element.childNodes[2]).toBe(undefined);
  });

  it('should be nextable', function () {
    var menu = KorAP.Menu.create("cnx/", list);

    KorAP.limit = 3;
    expect(menu.show()).toBe(undefined);

    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Constituency</strong><span>Example 1</span>");
    expect(menu.shownItem(0).active()).toBe(true);
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Lemma</strong>");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.element.childNodes[2].innerHTML).toEqual("<strong>Morphology</strong><span>Example 2</span>");
    expect(menu.shownItem(2).active()).toBe(false);
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Activate next (1)
    menu.next();
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Constituency</strong><span>Example 1</span>");
    expect(menu.shownItem(0).active()).toBe(false);
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Lemma</strong>");
    expect(menu.shownItem(1).active()).toBe(true);
    expect(menu.element.childNodes[2].innerHTML).toEqual("<strong>Morphology</strong><span>Example 2</span>");
    expect(menu.shownItem(2).active()).toBe(false);
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Activate next (2)
    menu.next();
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Constituency</strong><span>Example 1</span>");
    expect(menu.shownItem(0).active()).toBe(false);
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Lemma</strong>");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.element.childNodes[2].innerHTML).toEqual("<strong>Morphology</strong><span>Example 2</span>");
    expect(menu.shownItem(2).active()).toBe(true);
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Activate next (3)
    menu.next();
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Lemma</strong>");
    expect(menu.shownItem(0).active()).toBe(false);
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Morphology</strong><span>Example 2</span>");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.element.childNodes[2].innerHTML).toEqual("<strong>Part-of-Speech</strong>");
    expect(menu.shownItem(2).active()).toBe(true);
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Activate next (4)
    menu.next();
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Morphology</strong><span>Example 2</span>");
    expect(menu.shownItem(0).active()).toBe(false);
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Part-of-Speech</strong>");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.element.childNodes[2].innerHTML).toEqual("<strong>Syntax</strong>");
    expect(menu.shownItem(2).active()).toBe(true);
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Activate next (5) - ROLL
    menu.next();
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Constituency</strong><span>Example 1</span>");
    expect(menu.shownItem(0).active()).toBe(true);
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Lemma</strong>");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.element.childNodes[2].innerHTML).toEqual("<strong>Morphology</strong><span>Example 2</span>");
    expect(menu.shownItem(2).active()).toBe(false);
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Active next (6)
    menu.next();
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Constituency</strong><span>Example 1</span>");
    expect(menu.shownItem(0).active()).toBe(false);
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Lemma</strong>");
    expect(menu.shownItem(1).active()).toBe(true);
    expect(menu.element.childNodes[2].innerHTML).toEqual("<strong>Morphology</strong><span>Example 2</span>");
    expect(menu.shownItem(2).active()).toBe(false);
    expect(menu.element.childNodes[3]).toBe(undefined);

  });


  it('should be prevable', function () {
    var menu = KorAP.Menu.create("cnx/", list);

    KorAP.limit = 3;
    expect(menu.show()).toBe(undefined);

    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Constituency</strong><span>Example 1</span>");
    expect(menu.shownItem(0).active()).toBe(true);
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Lemma</strong>");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.element.childNodes[2].innerHTML).toEqual("<strong>Morphology</strong><span>Example 2</span>");
    expect(menu.shownItem(2).active()).toBe(false);
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Activate prev (1) - roll to bottom
    menu.prev();
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Morphology</strong><span>Example 2</span>");
    expect(menu.shownItem(0).active()).toBe(false);
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Part-of-Speech</strong>");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.element.childNodes[2].innerHTML).toEqual("<strong>Syntax</strong>");
    expect(menu.shownItem(2).active()).toBe(true);
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Activate prev (2)
    menu.prev();
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Morphology</strong><span>Example 2</span>");
    expect(menu.shownItem(0).active()).toBe(false);
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Part-of-Speech</strong>");
    expect(menu.shownItem(1).active()).toBe(true);
    expect(menu.element.childNodes[2].innerHTML).toEqual("<strong>Syntax</strong>");
    expect(menu.shownItem(2).active()).toBe(false);
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Activate prev (3)
    menu.prev();
    expect(menu.shownItem(0).name).toEqual("Morphology");
    expect(menu.shownItem(0).active()).toBe(true);
    expect(menu.shownItem(1).name).toEqual("Part-of-Speech");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.shownItem(2).name).toEqual("Syntax");
    expect(menu.shownItem(2).active()).toBe(false);
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Activate prev (4)
    menu.prev();
    expect(menu.shownItem(0).name).toEqual("Lemma");
    expect(menu.shownItem(0).active()).toBe(true);
    expect(menu.shownItem(1).name).toEqual("Morphology");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.shownItem(2).name).toEqual("Part-of-Speech");
    expect(menu.shownItem(2).active()).toBe(false);
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Activate prev (5)
    menu.prev();
    expect(menu.shownItem(0).name).toEqual("Constituency");
    expect(menu.shownItem(0).active()).toBe(true);
    expect(menu.shownItem(1).name).toEqual("Lemma");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.shownItem(2).name).toEqual("Morphology");
    expect(menu.shownItem(2).active()).toBe(false);
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Activate next (1)
    menu.next();
    expect(menu.shownItem(0).name).toEqual("Constituency");
    expect(menu.shownItem(0).active()).toBe(false);
    expect(menu.shownItem(1).name).toEqual("Lemma");
    expect(menu.shownItem(1).active()).toBe(true);
    expect(menu.shownItem(2).name).toEqual("Morphology");
    expect(menu.shownItem(2).active()).toBe(false);
    expect(menu.element.childNodes[3]).toBe(undefined);

    // Activate prev (6)
    menu.prev();

    // Activate prev (7)
    menu.prev();
    expect(menu.shownItem(0).name).toEqual("Morphology");
    expect(menu.shownItem(0).active()).toBe(false);
    expect(menu.shownItem(1).name).toEqual("Part-of-Speech");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.shownItem(2).name).toEqual("Syntax");
    expect(menu.shownItem(2).active()).toBe(true);
    expect(menu.element.childNodes[3]).toBe(undefined);
  });

  it('should be navigatable and filterable (prefix = "o")', function () {
    var menu = KorAP.Menu.create("cnx/", list);

    KorAP.limit = 2;

    expect(menu.show("o")).toBe(undefined);

    expect(menu.shownItem(0).name).toEqual("Constituency");
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>C<em>o</em>nstituency</strong><span>Example 1</span>");
    expect(menu.shownItem(0).active()).toBe(true);
    expect(menu.shownItem(1).name).toEqual("Morphology");
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>M<em>o</em>rphology</strong><span>Example 2</span>");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.shownItem(2)).toBe(undefined);

    // Next (1)
    menu.next();
    expect(menu.shownItem(0).name).toEqual("Constituency");
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>C<em>o</em>nstituency</strong><span>Example 1</span>");
    expect(menu.shownItem(0).active()).toBe(false);
    expect(menu.shownItem(1).name).toEqual("Morphology");
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>M<em>o</em>rphology</strong><span>Example 2</span>");
    expect(menu.shownItem(1).active()).toBe(true);
    expect(menu.shownItem(2)).toBe(undefined);


    // Next (2)
    menu.next();
    expect(menu.shownItem(0).name).toEqual("Morphology");
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>M<em>o</em>rphology</strong><span>Example 2</span>");
    expect(menu.shownItem(0).active()).toBe(false);
    expect(menu.shownItem(1).name).toEqual("Part-of-Speech");
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Part-<em>o</em>f-Speech</strong>");
    expect(menu.shownItem(1).active()).toBe(true);
    expect(menu.shownItem(2)).toBe(undefined);

    // Next (3)
    menu.next();
    expect(menu.shownItem(0).name).toEqual("Constituency");
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>C<em>o</em>nstituency</strong><span>Example 1</span>");
    expect(menu.shownItem(0).active()).toBe(true);
    expect(menu.shownItem(1).name).toEqual("Morphology");
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>M<em>o</em>rphology</strong><span>Example 2</span>");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.shownItem(2)).toBe(undefined);
  });

  it('should be navigatable and filterable (prefix = "ex", "e")', function () {
    var menu = KorAP.Menu.create("cnx/", list);

    KorAP.limit = 2;

    expect(menu.show("ex")).toBe(undefined);

    expect(menu.shownItem(0).name).toEqual("Constituency");
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Constituency</strong><span><em>Ex</em>ample 1</span>");
    expect(menu.shownItem(0).active()).toBe(true);
    expect(menu.shownItem(1).name).toEqual("Morphology");
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Morphology</strong><span><em>Ex</em>ample 2</span>");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.shownItem(2)).toBe(undefined);

    // Next (1)
    menu.next();
    expect(menu.shownItem(0).name).toEqual("Constituency");
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Constituency</strong><span><em>Ex</em>ample 1</span>");
    expect(menu.shownItem(0).active()).toBe(false);
    expect(menu.shownItem(1).name).toEqual("Morphology");
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Morphology</strong><span><em>Ex</em>ample 2</span>");
    expect(menu.shownItem(1).active()).toBe(true);
    expect(menu.shownItem(2)).toBe(undefined);

    // Next (2)
    menu.next();
    expect(menu.shownItem(0).name).toEqual("Constituency");
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Constituency</strong><span><em>Ex</em>ample 1</span>");
    expect(menu.shownItem(0).active()).toBe(true);
    expect(menu.shownItem(1).name).toEqual("Morphology");
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Morphology</strong><span><em>Ex</em>ample 2</span>");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.shownItem(2)).toBe(undefined);

    // Reset limit
    KorAP.limit = 5;

    // Change show
    expect(menu.show("e")).toBe(undefined);

    expect(menu.shownItem(0).name).toEqual("Constituency");
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Constitu<em>e</em>ncy</strong><span><em>E</em>xample 1</span>");
    expect(menu.shownItem(0).active()).toBe(true);
    expect(menu.shownItem(1).name).toEqual("Morphology");
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Morphology</strong><span><em>E</em>xample 2</span>");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.shownItem(2)).toBe(undefined);

    // Next (1)
    menu.next();
    expect(menu.shownItem(0).name).toEqual("Constituency");
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Constitu<em>e</em>ncy</strong><span><em>E</em>xample 1</span>");
    expect(menu.shownItem(0).active()).toBe(false);
    expect(menu.shownItem(1).name).toEqual("Morphology");
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Morphology</strong><span><em>E</em>xample 2</span>");
    expect(menu.shownItem(1).active()).toBe(true);
    expect(menu.shownItem(2)).toBe(undefined);

    // Next (2)
    menu.next();
    expect(menu.shownItem(0).name).toEqual("Constituency");
    expect(menu.element.childNodes[0].innerHTML).toEqual("<strong>Constitu<em>e</em>ncy</strong><span><em>E</em>xample 1</span>");
    expect(menu.shownItem(0).active()).toBe(true);
    expect(menu.shownItem(1).name).toEqual("Morphology");
    expect(menu.element.childNodes[1].innerHTML).toEqual("<strong>Morphology</strong><span><em>E</em>xample 2</span>");
    expect(menu.shownItem(1).active()).toBe(false);
    expect(menu.shownItem(2)).toBe(undefined);
  });
});

describe('KorAP.ContextAnalyzer', function () {

  it('should be initializable', function () {
    var analyzer = KorAP.ContextAnalyzer.create(")");
    expect(analyzer).toBe(undefined);

    analyzer = KorAP.ContextAnalyzer.create(".+?");
    expect(analyzer).not.toBe(undefined);

  });

  it('should check correctly', function () {
    analyzer = KorAP.ContextAnalyzer.create(KorAP.context);
    expect(analyzer.test("cnx/]cnx/c=")).toEqual("cnx/c=");
    expect(analyzer.test("cnx/c=")).toEqual("cnx/c=");
    expect(analyzer.test("cnx/c=np mate/m=mood:")).toEqual("mate/m=mood:");
    expect(analyzer.test("impcnx/")).toEqual("impcnx/");
    expect(analyzer.test("cnx/c=npcnx/")).toEqual("npcnx/");
    expect(analyzer.test("mate/m=degree:pos corenlp/ne_dewac_175m_600="))
      .toEqual("corenlp/ne_dewac_175m_600=");
  });
});

describe('KorAP.InputField', function () {
  var input;

  beforeAll(function () {
    input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("value", "abcdefghijklmno");
    input.style.position = 'absolute';
    input.style.top  = "20px";
    input.style.left = "30px";
    input.focus();
    input.selectionStart = 5;
  });

  afterAll(function () {
    document.getElementsByTagName("body")[0].removeChild(input);
    document.getElementsByTagName("body")[0].removeChild(
      document.getElementById("searchMirror")
    );
  });

  it('should be initializable', function () {
    // Supports: context, searchField
    var inputField = KorAP.InputField.create(input);
    expect(inputField._element).not.toBe(undefined);
  });

  it('should have text', function () {
    var inputField = KorAP.InputField.create(input);

    expect(inputField.value).toEqual("abcdefghijklmno");
    expect(inputField.element.selectionStart).toEqual(5);
    expect(inputField.split()[0]).toEqual("abcde");
    expect(inputField.split()[1]).toEqual("fghijklmno");

    inputField.insert("xyz");
    expect(inputField.split()[0]).toEqual("abcdexyz");
    expect(inputField.split()[1]).toEqual("fghijklmno");

  });

  it('should be correctly positioned', function () {
    var inputField = KorAP.InputField.create(input);
    document.getElementsByTagName("body")[0].appendChild(input);
    inputField.reposition();
    expect(inputField.mirror.style.left).toEqual("30px");
    expect(inputField.mirror.style.top.match(/^(\d+)px$/)[1]).toBeGreaterThan(20);
  });
});
*/
