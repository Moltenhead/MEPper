class Selector {
  constructor(grid) {
    this._grid = (grid instanceof $) ? grid : $(grid);
    this._initialPos = { x: null, y: null };
    this._endPos =  { x: null, y: null };

    this._firstTarget = null;
    this._lastTarget = null;
    this._selected = null;

    this._selectorDisplayer =
      $(document.createElement('div')).attr('id', 'selector');
    this._selectorDisplayer.css(
      {
        width: '32px',
        height: '32px',
        borderWidth: '2px',
        borderStyle: 'dashed',
        position: 'absolute',
        top: this._initialPos.y + 'px',
        left: this._initialPos.x + 'px',
        zIndex: '100',
        display: 'none',
        pointerEvents: 'none',
      });

    this._grid.prepend(this._selectorDisplayer);

    this._isActivated = false;
  }

  get initialPos() {
    return this._initialPos;
  }

  set initialPos(value) {
    this._initialPos.x = value.x;
    this._initialPos.y = value.y;
  }

  get endPos() {
    return this._endPos;
  }

  set endPos(value) {
    this._endPos.x = value.x;
    this._endPos.y = value.y;
  }

  get isActivated() {
    return this._isActivated;
  }

  activate(target) {
    this._firstTarget = (target instanceof $) ? target : $(target);
    this._initialPos.x = target.offsetLeft;
    this._initialPos.y = target.offsetTop;
    this._isActivated = true;
    this._selectorDisplayer.css({
      top: this._initialPos.y + 'px',
      left: this._initialPos.x + 'px',
      display: 'block',
    });
  }

  deactivate(target) {
    this._lastTarget = (target instanceof $) ? target : $(target);
    this._endPos.x = target.offsetLeft;
    this._endPos.y = target.offsetTop;
    this._isActivated = false;
    this._selectorDisplayer.css({
      width: '32px',
      height: '32px',
      display: 'none',
    });
  }

  adjustDisplay() {
    var width = this._endPos.x - this._initialPos.x + 32;
    var height = this._endPos.y - this._initialPos.y + 32;
    $('#selector').css({
      width: width + 'px',
      height: height + 'px',
    });
  }

  getSelected() {
    var columns = (this._endPos.x + 32 - this._initialPos.x) / 32;
    var rows = (this._endPos.y + 32 - this._initialPos.y) / 32;
    var firstIndex = this._firstTarget.index() - 1;
    var lastIndex = this._lastTarget.index();

    this._selected = [];
    for (var i = 0; i < columns; i++) {
      for (var j = 0; j < rows; j++) {
        var actualIndex = firstIndex + i + (j * 100);
        this._selected.push(
          this._grid.children('.cell').eq(actualIndex));
      }
    }

    return this._selected;
  }
}
