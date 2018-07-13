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

$.Tool = function (name, library)
{
  this.name = name;
  this.library = library;
  this.initial = this.name.charAt(0).toUpperCase();

  return this;
};

$.Tool.prototype = {
  getName: function () {
    return this.name;
  },

  getInitial: function () {
    return this.initial;
  },

  getLibrary: function () {
    return this.library;
  },
};

$.MakingTool = function (name, library)
{
  new $.Tool(name, library);

  return this;
};

$.MakingTool.prototype = {
  work: function (elt) {
    this.elt = (elt instanceof $) ? elt : $(elt);
    this.elt.addClass('room');
    for (i = 0; i < this.library.length; i++) {
      var newElt = document.createElement('div');
      $(newElt).addClass('border ' + this.library[i]);
      $(newElt).click(function () {
        $(this).parent().toggleClass(this.library[i] + '_wall');
      });

      this.elt.append(newElt);
    }
  },
};

$.TurningTool = function (name, library)
{
  new $.Tool(name, library);

  return this;
};

$.TurningTool.prototype = {
  work: function (elt) {
    this.elt = (elt instanceof $) ? elt : $(elt);
    if (this.elt.parent().hasClass('room')) {
      if (this.elt.parent().hasClass(this.name.toLowerCase())) {
        if (this.elt.decal > 0) {
          this.elt.parent().removeClass(this.library[this.elt.decal]);
        }

        if (this.elt.decal < this.library.length) {
          this.elt.parent().addClass(this.library[this.elt.decal]);
          this.elt.decal++;
        } else {
          this.elt.parent().removeClass(this.name.toLowerCase());
          this.elt.decal = 0;
        }
      } else {
        this.elt.addClass(this.name.toLowerCase() + ' ' + this.library[0]);
        this.elt.decal = 0;
      }
    } else {
      this.elt.addClass('room ' + this.name.toLowerCase() + ' ' + this.library[0]);
      this.elt.decal = 0;
    }

    return this.elt;
  },
};

$.RemovingTool = function (name, classList)
{
  new $.Tool(name, []);
  this.classToRemove = classList;

  return this;
};

$.RemovingTool.prototype = {
  work: function (elt) {
    this.elt = (elt instanceof $) ? elt : $(elt);
    this.elt.children('div').remove();
    this.elt.removeClass(this.classToRemove.join(' '));
    this.elt.parent().removeClass(this.classToRemove.join(' '));
  },
};

$.MagicWand = function ()
{
  this.toolHeads = [
    new $.MakingTool('Base', ['up', 'right', 'bottom', 'left']),
    new $.TurningTool('Structure', ['round_pillar', 'square_pillar']),
  ];

  return this;
};

$.Eraser = function ()
{
  this.toolHeads = [
    new $.RemovingTool(
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
};

$.Pen = function ()
{
  this.toolHeads = [
    new $.TurningTool('Marker', ['art', 'int', 'exp']),
    new $.TurningTool('Furniture', ['round_table', 'square_table']),
  ];

  return this;
};

$.Toolbox = function (toolLibrary)
{
  new $.Tool('', toolLibrary);

  return this;
};

$.Toolbox.prototype = {
  execute: function (toolIndex, subToolIndex) {
    this.library[toolIndex].toolHeads[subToolIndex]();
  },
};

$(document).ready(function () {
  var toolBox = new $.Toolbox([
    new $.MagicWand(),
    new $.Eraser(),
    new $.Pen(),
    new $.Toolbox(),
  ]);
  console.log(toolBox);
  for (i = 0; i < 100 * 100; i++) {
    var newDiv = document.createElement('div');
    $(newDiv).addClass('cell');
    $(newDiv).click(function () {
      $checkedTool = $('input[name="toolbox"]:checked');
      var toolIndex = $checkedTool.val();
      var subToolIndex = $checkedTool.parent().children('.subnav').find('input:checked').val();
      toolBox.execute(toolIndex, subToolIndex);
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
