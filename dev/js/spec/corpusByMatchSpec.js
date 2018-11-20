/**
 * Specification for the corpusByMatch assistant.
 */

function metaTableFactory () {
  let meta = document.createElement('div');
  meta.className = 'metatable';
  meta.innerHTML =
    "    <dl class=\"flex\">" +
    "      <div>" +
    "        <dt title=\"author\" data-type=\"type:string\">author</dt>" +
    "        <dd>Sprachpfleger, u.a.</dd>" +
    "      </div>" +
    "      <div>" +
    "        <dt title=\"foundries\" data-type=\"type:keywords\">foundries</dt>" +
    "        <dd class=\"metakeyvalues\">" +
    "          <div>corenlp</div>" +
    "          <div>corenlp/constituency</div>" +
    "          <div>corenlp/morpho</div>" +
    "          <div>corenlp/sentences</div>" +
    "          <div>dereko</div>" +
    "          <div>dereko/structure</div>" +
    "          <div>dereko/structure/base-sentences-paragraphs-pagebreaks</div>" +
    "          <div>opennlp</div>" +
    "          <div>opennlp/morpho</div>" +
    "          <div>opennlp/sentences</div>" +
    "        </dd>" +
    "      </div>" +
    "    </dl>";
  let parent = document.createElement("div");
  parent.className = 'metatable view';
  parent.appendChild(meta);
  return meta;
};

define(['match/corpusByMatch'], function (cbmClass) {  
  describe('KorAP.CorpusByMatch', function () {

    it('should be initializable', function () {
      expect(function () {
        cbmClass.create()
      }).toThrow(new Error("Missing parameters"));

      expect(
	      function() {
          cbmClass.create("Test")
        }
      ).toThrow(new Error("Requires element"));

      expect(cbmClass.create(metaTableFactory()).toQuery()).toEqual("");
    });

    it('should open the corpusByMatch assistant', function () {
      let metaTable = metaTableFactory();
      let cbm = cbmClass.create(metaTable);
      expect(cbm.toQuery()).toEqual("");

      expect(metaTable.parentNode.querySelector("div.vc.fragment")).toBeNull();

      // click on author:
      metaTable.querySelector("dl dt[title=author] + dd").click();
      expect(metaTable.parentNode.querySelector("div.vc.fragment")).not.toBeNull();

      expect(cbm.toQuery()).toEqual('(author = "Sprachpfleger, u.a.")');

      // click on list:
      metaTable.querySelector("dl dt[title=foundries] + dd div:nth-of-type(3)").click();

      expect(cbm.toQuery()).toEqual('(author = "Sprachpfleger, u.a." & foundries = "corenlp/morpho")');
    });
  });
});
