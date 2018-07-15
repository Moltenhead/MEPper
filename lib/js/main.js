(function ($)
{
  $.fn.removeStyle = function (style)
  {
    var search = new RegExp(style + '[^;]+;?', 'g');

    return this.each(function ()
    {
      $(this).attr('style', function (i, style)
      {
        return style && style.replace(search, '');
      });
    });
  };
}(jQuery));

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

class MakingTool extends Tool {
  work(elt) {
    var $elt = (elt instanceof $) ? elt : $(elt);

    if (
      !$elt.hasClass('room') &&
      !$elt.parent().hasClass('room')
    ) {
      var _this = this;
      $elt.addClass('room');
      for (i = 0; i < $(this._library).length; i++) {
        var newElt = document.createElement('div');
        newElt.side = _this.getLibrary(i);
        $(newElt).addClass('border ' + newElt.side);
        $(newElt).click(function () {
          if (parseInt($('input[name="toolbox"]:checked').val()) == 0) {
            $(this).parent().toggleClass(this.side + '_wall');
          }
        });

        $elt.append(newElt);
      }
    }
  }
}

class TurningTool extends Tool {
  work(elt) {
    var $elt = (elt instanceof $) ? elt : $(elt);
    if ($elt.hasClass('room') || $elt.parent().hasClass('room')) {
      var target =
        ($elt.hasClass('room')) ?
          $elt :
          ($elt.parent().hasClass('room')) ?
            $elt.parent() :
            error.log("has room but there's not");
      if (target.hasClass(this._name.toLowerCase())) {
        target.removeClass(this._library[target.decal]);
        if (target.decal < $(this._library).length) {
          target.addClass(this._library[$elt.decal]);
          target.decal++;
        } else {
          target.removeClass(this._name.toLowerCase());
          target.decal = 0;console.log(target.decal);
        }
      } else {
        target.addClass(this._name.toLowerCase() + ' ' + this._library[0]);
        target.decal = 0;
      }
    } else {
      var tool = new MakingTool('make', ['up', 'right', 'bottom', 'left']);
      tool.work($elt);
      $elt.addClass(this._name.toLowerCase() + ' ' + this._library[0]);
      $elt.decal = 0;
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

class MagicWand {
  constructor() {
    this.toolHeads = [
      new MakingTool('Base', ['up', 'right', 'bottom', 'left']),
      new TurningTool('Structure', ['round_pillar', 'square_pillar']),
    ];

    return this;
  }
}

class Eraser {
  constructor() {
    this.toolHeads = [
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
    ];

    return this;
  }
}

class Pen {
  constructor() {
    this.toolHeads = [
      new TurningTool('Marker', ['art', 'int', 'exp']),
      new TurningTool('Furniture', ['round_table', 'square_table']),
    ];

    return this;
  }
}

class Toolbox extends Tool {
  constructor(toolsList) {
    super('Toolbox', toolsList);
  }

  execute(toolIndex, subToolIndex, target) {
    this._library[toolIndex].toolHeads[subToolIndex].work(target);
  }
}

$(document).ready(function () {
  var toolBox = new Toolbox([
    new MagicWand(),
    new Eraser(),
    new Pen(),
    new Toolbox(),
  ]);

  for (i = 0; i < 100 * 100; i++) {
    var newDiv = document.createElement('div');
    $(newDiv).addClass('cell');
    $(newDiv).click(function () {
      $checkedTool = $('input[name="toolbox"]:checked');
      var toolIndex = parseInt($checkedTool.val());
      var subToolIndex =
        parseInt(
          $checkedTool.parent().
          children('.subnav').
          find('input:checked').val());
      toolBox.execute(toolIndex, subToolIndex, this);
    });

    $('#grid').append(newDiv);
  }

  $tools = $('input[name="toolbox"]');
  $tools.click(function () {
    var value = $(this).val();
    $tools.each(function (i) {
      if ($($tools.get(i)).val() != value) {
        $($tools.get(i)).parent().removeClass('active');
      } else {
        $(this).parent().addClass('active');
      }
    });

    switch (parseInt($(this).val())) {
      default:
        $('main').css('cursor', 'url("design/cursors/darkGray Normal.cur"), auto');
        break;
    }
  });
});
