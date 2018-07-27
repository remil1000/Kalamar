define(['plugin/server','plugin/widget','panel'], function (pluginServerClass, widgetClass, panelClass) {

  describe('KorAP.Plugin.Server', function () {

    it('should be initializable', function () {
      var manager = pluginServerClass.create();
      expect(manager).toBeTruthy();
      manager.destroy();
    });


    it('should add a widget', function () {
      var manager = pluginServerClass.create();
      var panel = panelClass.create();
      var id = manager.addWidget(panel, 'Example 1', 'about:blank');
      expect(id).toMatch(/^id-/);

      var panelE = panel.element();
      var widgetE = panelE.firstChild.firstChild;
      expect(widgetE.classList.contains('widget')).toBeTruthy();
      expect(widgetE.firstChild.tagName).toEqual("IFRAME");
      var iframe = widgetE.firstChild;
      expect(iframe.getAttribute("src")).toEqual("about:blank");

      expect(widgetE.lastChild.firstChild.textContent).toEqual("Close");
      expect(widgetE.lastChild.lastChild.textContent).toEqual("Example 1");

      manager.destroy();
    });

    it('should close a widget', function () {
      var manager = pluginServerClass.create();
      var panel = panelClass.create();
      var id = manager.addWidget(panel, 'Example 2', 'about:blank');
      expect(id).toMatch(/^id-/);

      var panelE = panel.element();
      var widgetE = panelE.firstChild.firstChild;
      expect(widgetE.classList.contains('widget')).toBeTruthy();

      expect(panelE.getElementsByClassName('view').length).toEqual(1);

      var widget = manager.widget(id);
      widget.close();

      expect(panelE.getElementsByClassName('view').length).toEqual(0);

      manager.destroy();
    });

    
    it('should fail on invalid registrations', function () {
      var manager = pluginServerClass.create();

      expect(
	      function() { manager.register({}) }
      ).toThrow(new Error("Missing name of plugin"));

      expect(
	      function() { manager.register({
          name : 'Example',
          embed : ''
        })}
      ).toThrow(new Error("Embedding of plugin is no list"));

      expect(
	      function() { manager.register({
          name : 'Example',
          embed : [{
            panel : ''
          }]
        })}
      ).toThrow(new Error("Panel for plugin is invalid"));
    });
  });

  describe('KorAP.Plugin.Widget', function () {
    it('should be initializable', function () {
      expect(function () { widgetClass.create() }).toThrow(new Error("Widget not well defined"));

      widget = widgetClass.create("Test", "https://example", 56);
      expect(widget).toBeTruthy();
      expect(widget.id).toEqual(56);
      expect(widget.name).toEqual("Test");
      expect(widget.src).toEqual("https://example");
    });

    it('should create a view element', function () {
      var widget = widgetClass.create("Test", "https://example", 56);
      var we = widget.element();

      expect(we.tagName).toEqual("DIV");
      expect(we.classList.contains('view')).toBeTruthy();
      expect(we.classList.contains('widget')).toBeTruthy();

      var iframe = we.firstChild;
      expect(iframe.tagName).toEqual("IFRAME");
      expect(iframe.getAttribute("sandbox")).toEqual("allow-scripts");
      expect(iframe.getAttribute("src")).toEqual("https://example");
      expect(iframe.getAttribute("name")).toEqual("56");

      var btn = we.lastChild;
      expect(btn.classList.contains("button-group")).toBeTruthy();
      expect(btn.classList.contains("button-view")).toBeTruthy();
      expect(btn.classList.contains("widget")).toBeTruthy();

      expect(btn.firstChild.tagName).toEqual("SPAN");
      expect(btn.firstChild.classList.contains("button-icon")).toBeTruthy();
      expect(btn.firstChild.classList.contains("close")).toBeTruthy();
      expect(btn.firstChild.firstChild.tagName).toEqual("SPAN");

      expect(btn.lastChild.tagName).toEqual("SPAN");
      expect(btn.lastChild.classList.contains("button-icon")).toBeTruthy();
      expect(btn.lastChild.classList.contains("plugin")).toBeTruthy();
      expect(btn.lastChild.firstChild.tagName).toEqual("SPAN");
      expect(btn.lastChild.textContent).toEqual("Test");
    })

    it('should be resizable', function () {
      var widget = widgetClass.create("Test", "https://example", 56);
      var iframe = widget.show();
      expect(iframe.style.height).toEqual('0px');
      widget.resize({ height : 9 });
      expect(iframe.style.height).toEqual('9px');
    });
  });
});
