//defining number of cells to create
function getIndexes() {
  var $checkedTool = $('input[name="toolbox"]:checked');
  var toolIndex = parseInt($checkedTool.val());
  var subToolIndex =
    parseInt(
      $checkedTool.parent().
      children('.subnav').
      find('input:checked').val());

  return [toolIndex, subToolIndex];
}

var cellsToCreate = 100 * 100;

$(document).ready(function () {
  //toolbox initialization
  var toolBox = new Toolbox([
    new MagicWand(),
    new Eraser(),
    new Pen(),

    //new Selector(),
  ]);

  var selector = new Selector($('#grid'));

  toolBox.appendTo($('header'));

  //creating cells as much as specified
  for (i = 0; i < cellsToCreate; i++) {
    //creating a div with all the cell properties
    var newDiv = document.createElement('div');
    $(newDiv).addClass('cell');

    //adding a click event on each one
    $(newDiv).click(function () {
      var indexes = getIndexes();
      var toolIndex = indexes[0];
      var subToolIndex = indexes[1];

      toolBox.execute(toolIndex, subToolIndex, this);
    });

    //appending new cell to the grid
    $('#grid').append(newDiv);
  }

  /*activate subnav for checked main tool
  * also implement cursor adapter prototype
  */
  var $tools = $('input[name="toolbox"]');
  $tools.click(function () {
    var value = parseInt($(this).val());
    var childrenCheckedValue =
      parseInt($(this).parent().find('.subnav input:checked').val());
    if (value === 0 && childrenCheckedValue === 0) {
      $('#grid > .room > .border').css('display', 'block');
    } else {
      $('#grid > .room > .border').css('display', 'none');
    }

    $tools.each(function (i) {
      if (parseInt($($tools.get(i)).val()) != value) {
        $($tools.get(i)).parent().removeClass('active');
      } else {
        $(this).parent().addClass('active');
      }
    });

    /*TODO: make a working prototype for cursor manager
    switch (parseInt($(this).val())) {
      default:
        $('main').css('cursor', 'url("selected/cursor.cur"), auto');
        break;
    }*/
  });

  var $subtools = $('#toolbox > div > .subnav > div > input');
  $subtools.click(function () {
    var value = parseInt($(this).val());
    var parentValue =
      parseInt($(this).parent().parent().parent().find('input').val());
    if (value === 0 && parentValue === 0) {
      $('#grid > .room > .border').css('display', 'block');
    } else {
      $('#grid > .room > .border').css('display', 'none');
    }
  });

  $('#grid').mousedown(function (event) {
    if (!selector.isActivated) {
      if (event.which === 1) {
        var target = event.target;
        selector.activate(event.target);
      }
    }
  });

  $('#grid').mousemove(function (event) {
    if (selector.isActivated) {
      var target = event.target;
      selector.endPos = {
        x: target.offsetLeft,
        y: target.offsetTop,
      };
      selector.adjustDisplay();
    }
  });

  $('#grid').mouseup(function (event) {
    if (selector.isActivated) {
      if (event.which === 1) {
        var target = event.target;
        selector.deactivate(event.target);
        var indexes = getIndexes();
        var toolIndex = indexes[0];
        var subToolIndex = indexes[1];
        toolBox.execute(toolIndex, subToolIndex, selector.getSelected());
      }
    }
  });
});
