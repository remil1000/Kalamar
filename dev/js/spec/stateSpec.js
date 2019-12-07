define(['state'], function (stateClass) {

  describe('KorAP.State', function () {
    it('should be initializable', function () {
      let s = stateClass.create();
      expect(s.get()).toBeFalsy();

      s = stateClass.create(true);
      expect(s.get()).toBeTruthy();
    });

    it('should be settable and gettable', function () {
      let s = stateClass.create();
      expect(s.get()).toBeFalsy();
      s.set(true);
      expect(s.get()).toBeTruthy();
    });

    it('should be associatable', function () {
      let s = stateClass.create();

      // Create
      let obj1 = {
        x : false,
        setState : function (value) {
          this.x = value;
        }
      };

      // Create
      let obj2 = {
        x : true,
        setState : function (value) {
          this.x = value;
        }
      };
      
      expect(s.get()).toBeFalsy();
      expect(obj1.x).toBeFalsy();
      expect(obj2.x).toBeTruthy();

      // Associate object with state
      s.associate(obj1);
      s.associate(obj2);

      expect(s.get()).toBeFalsy();
      expect(obj1.x).toBeFalsy();
      expect(obj2.x).toBeFalsy();

      s.set(true);

      expect(s.get()).toBeTruthy();
      expect(obj1.x).toBeTruthy();
      expect(obj2.x).toBeTruthy();
    });
  });
});