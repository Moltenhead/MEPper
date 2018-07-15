//defining number of cells to create
var cellsToCreate = 100 * 100;

$(document).ready(function () {
  //toolbox initialization
  var toolBox = new Toolbox([
    new MagicWand(),
    new Eraser(),
    new Pen(),
    new Toolbox(),
  ]);

  //creating cells as much as specified
  for (i = 0; i < cellsToCreate; i++) {
    //creating a div with all the cell properties
    var newDiv = document.createElement('div');
    $(newDiv).addClass('cell');

    //adding a click event on each one
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

    //appending new cell to the grid
    $('#grid').append(newDiv);
  }

  /*prototype used for changing the cursor within main
  * based on the selected tool within the toolbox
  */
  /*TODO: usable cursor changer prototype
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
        $('main').css('cursor', 'url("selected/cursor.cur"), auto');
        break;
    }
  });
  */
});
