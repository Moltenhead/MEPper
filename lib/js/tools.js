/*MAIN TOOL*/
class Tool {
  constructor(name, library) {
    this._name = name;
    this._library = library;
    this._initial = this._name.charAt(0).toUpperCase();

    return this;
  }

  get name() {
    return this._name;
  }

  get initial() {
    return this._initial;
  }

  getLibrary(index) {
    return this._library[index];
  }
}

/*EXPENDED TOOLS*/
class MakingTool extends Tool {
  work(elt) {
    var $elt = (elt instanceof $) ? elt : $(elt);

    if (
      !$elt.hasClass('room') &&
      !$elt.parent().hasClass('room')
    ) {
      var _this = this;
      var name = this._name;
      $elt.addClass('room');
      for (i = 0; i < $(this._library).length; i++) {
        var newElt = document.createElement('div');
        newElt.side = _this.getLibrary(i);
        $(newElt).addClass('border ' + newElt.side);
        $(newElt).click(function () {
          if (
            parseInt($('input[name="toolbox"]:checked').val()) == 0 &&
            parseInt($('input[name="magic_wand"]:checked').val()) == 0
          ) {
            $(this).parent().toggleClass(this.side + '_wall');
          }
        });

        $elt.append(newElt);
      }
    }
  }
}

class TurningTool extends Tool {
  constructor(name, library) {
    super(name, library);

    var allNames = [
      { name: 'Structure', classes: 'round_pillar square_pillar' },
      { name: 'Marker', classes: 'sta int exp' },
      { name: 'Furniture', classes: 'round_table square_table' },
    ];
    this._unwanted = '';

    var _this = this;

    $(allNames).each(function (index) {
      var actual = $(allNames).get(index);
      if (actual.name != _this._name) {
        _this._unwanted += (index > 0) ? ' ' : '';
        _this._unwanted += actual.name.toLowerCase() + ' ' + actual.classes;
      }
    });
  }

  work(elt) {
    var $elt = (elt instanceof $) ? elt : $(elt);
    if ($elt.hasClass('room') || $elt.parent().hasClass('room')) {
      var target =
        ($elt.hasClass('room')) ?
          $elt :
          ($elt.parent().hasClass('room')) ?
            $elt.parent() :
            error.log("has room but there's not");
      target.removeClass(this._unwanted);

      if (target.hasClass(this._name.toLowerCase())) {
        var turningIndex;
        for (i = 0; i < $(this._library).length; i++) {
          if ($elt.hasClass(this._library[i])) {
            turningIndex = i;
            break;
          }
        }

        target.removeClass(this._library[turningIndex]);
        if (turningIndex < $(this._library).length - 1) {
          target.addClass(this._library[turningIndex + 1]);
        } else {
          target.removeClass(this._name.toLowerCase());
        }
      } else {
        target.addClass(this._name.toLowerCase() + ' ' + this._library[0]);
      }
    } else {
      var tool = new MakingTool('make', ['up', 'right', 'bottom', 'left']);
      tool.work($elt);
      $elt.addClass(this._name.toLowerCase() + ' ' + this._library[0]);
    }

    return $elt;
  }
}

class RemovingTool extends Tool {
  constructor(name, classList) {
    super(name, []);
    this.classesToRemove = classList;

    return this;
  }

  work(elt) {
    var $elt = (elt instanceof $) ? elt : $(elt);
    $elt.children('div.border').remove();
    $elt.removeClass(this.classesToRemove.join(' '));
    $elt.parent().removeClass(this.classesToRemove.join(' '));
  }
}

/*USABLE TOOLS*/
class MagicWand extends Tool {
  constructor() {
    super(
      'Magic Wand',
      [
        new MakingTool('Base', ['up', 'right', 'bottom', 'left']),
        new TurningTool('Structure', ['round_pillar', 'square_pillar']),
      ]
    );

    return this;
  }
}

class Eraser extends Tool {
  constructor() {
    super(
      'Eraser',
      [
        new RemovingTool(
         'Remover',
         [
           'room',
           'structure',
           'furniture',
           'up',
           'right',
           'bottom',
           'left',
           'up_wall',
           'right_wall',
           'bottom_wall',
           'left_wall',
         ]
        ),
      ]
    );

    return this;
  }
}

class Pen extends Tool {
  constructor() {
    super(
      'Pen',
      [
        new TurningTool('Marker', ['sta', 'int', 'exp']),
        new TurningTool('Furniture', ['round_table', 'square_table']),
      ]
    );

    return this;
  }
}

/*TOOLBOX*/
class Toolbox extends Tool {
  constructor(toolsList) {
    super('Toolbox', toolsList);
  }

  appendTo(elt) {
    var $elt = (elt instanceof $) ? elt : $(elt);
    var $toolbox = $(document.createElement('nav'));
    $toolbox.attr('id', 'toolbox');

    $(this._library).each(function (index) {
      var _this = this;
      var slug = this._name.toSlug();

      var $newDiv = $(document.createElement('div'));
      if (index === 0) {
        $newDiv.addClass('active');
      }

      var $newInput = $(document.createElement('input'));
      $newInput.attr('id', slug);console.log($newInput.attr('id'));
      $newInput.attr('type', 'radio');
      $newInput.attr('name', 'toolbox');
      $newInput.attr('value', index);
      if (index === 0) {
        $newInput.attr('checked', 'true');
      }

      var $newLabel = $(document.createElement('label'));
      $newLabel.attr('for', slug);
      $newLabel.attr('title', this._name);
      var textNode = document.createTextNode(this._initial);
      $newLabel.append(textNode);

      $newDiv.append($newInput, $newLabel);

      var $newSubNav = $(document.createElement('nav'));
      $newSubNav.addClass('subnav');
      $(this._library).each(function (subindex) {
        var subslug = this._name.toSlug();

        var $newSubDiv = $(document.createElement('div'));

        var $newSubInput = $(document.createElement('input'));
        $newSubInput.attr('id', subslug);
        $newSubInput.attr('type', 'radio');
        $newSubInput.attr('name', slug);
        $newSubInput.attr('value', subindex);
        if (subindex === 0) {
          $newSubInput.attr('checked', 'true');
        }

        var $newSubLabel = $(document.createElement('label'));
        $newSubLabel.attr('for', subslug);
        $newSubLabel.attr('title', this._name);
        var textNode = document.createTextNode(this._initial);
        $newSubLabel.append(textNode);

        $newSubDiv.append($newSubInput, $newSubLabel);
        $newSubNav.append($newSubDiv);
      });

      $newDiv.append($newSubNav);
      $toolbox.append($newDiv);
      $elt.prepend($toolbox);
    });
  }

  execute(toolIndex, subToolIndex, target) {
    this._library[toolIndex]._library[subToolIndex].work(target);
  }
}
