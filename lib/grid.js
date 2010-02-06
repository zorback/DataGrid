function Grid($grid) {
	this.$grid = $grid;
	this.$container = null;
	this.$headerRow = null;
	this.$leftCol = null;
	
	var that = this;
	
	var cell_width = 104 + 2*1 + 2*4;
	var cell_height = 28;
	
	var left_margin = 68;//row number width and margin on the left
	var top_margin = 28+20;//header row height and margin on top
	
	var nb_columns = 50;
	var nb_rows = 100;
	
	this.columnwidth = [];
	
	var canvas_width  = nb_columns * cell_width;
	var canvas_height = nb_rows * cell_height + 1;
	
	
	//              <a class="jquery-ui-themeswitcher-trigger" href="#" style="border: 1px solid rgb(204, 204, 204); padding: 3px 3px 3px 8px; background: rgb(238, 238, 238) url(http://jqueryui.com/themeroller/themeswitchertool/images/buttonbg.png) repeat-x scroll 50% 50%; font-family: Trebuchet MS,Verdana,sans-serif; font-size: 11px; color: rgb(102, 102, 102); -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; -moz-border-radius-topleft: 6px; -moz-border-radius-topright: 6px; -moz-border-radius-bottomright: 6px; -moz-border-radius-bottomleft: 6px; text-decoration: none; width: 139px; display: block; height: 14px; outline-color: -moz-use-text-color; outline-style: none; outline-width: 0pt; cursor: pointer;"><span class="jquery-ui-themeswitcher-icon" style="background: transparent url(http://jqueryui.com/themeroller/themeswitchertool/images/icon_color_arrow.gif) no-repeat scroll 50% 50%; float: right; width: 16px; height: 16px; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial;"/><span class="jquery-ui-themeswitcher-title">Theme: UI lightness</span></a>
	this.init = function () {
		$grid.empty();
		
		$grid.append(generateHeaderRow());
		$grid.append(generateLeftColumn());
		$grid.append(generateRows());
		
		// create the pointers to the common document elements
		
		$grid.$container = $('#container');
		$grid.$headerRow = $('#header-row');
		$grid.$leftCol   = $('#left-col');
		
		
		//register click events to pick the selected cell
		$grid.$container.bind('click', that, mouseOverCellHandler);
		
		// register key events to navigate or edit the data in the grid
		$(document).bind('keydown', that, keyPressedHandler);
		
		//manage the horizontal scroll so header row does move
		//manage the vertical scroll so left col does move
		$grid.$container.parent().bind('scroll', function(event) {
			$grid.$headerRow.scrollLeft(($grid.$container.parent().scrollLeft()));
			$grid.$leftCol.scrollTop(($grid.$container.parent().scrollTop()));
		});
		
		// trigger a click handler on the first row first column by default
		
	}
	
	function generateSelect (col) {
		var fields = ['','First Name', 'Last Name', 'Email', 'City', 'Owner','------------','Create New'];
		var html = '<select style="width:104px;">';
		for (i = 0; i < fields.length; i++) {
			if (i == col && col < (fields.length - 2) ) {
				html += '<option selected="selected" value=' + fields[i] +'">' + fields[i] + '</option>';
			} else if (i == (fields.length-2) && col >= (fields.length - 2) ) {
				html += '<option selected="selected" value=' + fields[i] +'">' + fields[i] + '</option>';
			} else {
				html += '<option value=' + fields[i] +'">' + fields[i] + '</option>';
			}	
		}
		html += '</select>';
		return html;
	}
	
	function generateHeaderRow() {
		var html = '<div class="row header-row" id="header-row" row="0"><div class="header-virtual" style="width:'+canvas_width+'px; height: 48px;">';
		
		for (col =1; col <= nb_columns; col++) {
			html += '<div class="cell" col="' + col + '"><div class="inner-header-cell">' + generateSelect(col) +'</div></div>';
			// we just create a select box for visual effect but the user pick the field from a wizard
			// when user lay over the header cell we should propose a sort icon
		}
		// add extra element to match with the scrolling bar under		
		html += '</div></div><div class="clear"/><div class="header-row-full"><div class="top-bar"/><div class="scrolling-top-junction"/></div>';
		return html;
	}
	
	function generateLeftColumn() {
		var html = '<div class="left-column" id="left-col"><div class="left-column-virtual">';
		// add a border-top for the first cell
		html += '<div class="row-cell" col="0" style="border-top: 1px solid;">1</div>'; 
		for (row = 2; row <= nb_rows; row++) {
			html += '<div class="row-cell" col="0">' + row + '</div>'; // row number column
		}
		// add extra element to match with the horizontal scrolling bar
		html += '</div></div><div class="left-column-full"><div class="scrolling-left-junction"/></div>';
		return html;
	}
	
	function generateRows() {
		var html = '<div class="grid-canvas"><div class="grid-virtual" id="container" style="width:'+canvas_width+'px; height:'+canvas_height+'px;">';
		for (row = 1; row <= nb_rows; row++) {
			// for first row, draw border at the top
			if (row ==1) {
				html += '<div class="row" row="' + row +'" style="border-top: 1px solid silver;">';
			} else {
				html += '<div class="row" row="' + row +'">';
			}
			
			
			for (col = 1; col <= nb_columns; col++) {
				html += '<div class="cell" col="' + col + '"><div class="inner-cell"></div></div>';
			}
			
			html += '</div><div class="clear"/>';
		}
		html += '</div></div>';
		return html;
	};
	
	this.$selectedRow = null;
	this.$selectedCol = null;
	this.$selectedCell = null;
	
	this.unselect = function(that) {
		// restore the z-index
		if (that.$selectedCell) {
			that.$selectedCell.toggleClass('inner-cell inner-cell-select');
			that.$selectedCell.parent().css('zIndex', '1');
			that.$selectedCell.parent().parent().css('zIndex', '1');
			that.$selectedCell = null;
		}
		
		if (that.$selectedCol) {
			// remove the selected col
			that.$selectedCol.removeClass('selected');
			that.$selectedCol = null;
			that.selectedColNumber = null;
		}
		if (that.$selectedRow) {
			// remove the selected row
			that.$selectedRow.removeClass('selected');
			that.$selectedRow = null;
			that.selectedRowNumber = null;
		}
	};
		
	function mouseOverCellHandler(event) {	
		var that = event.data;
		var $innerCell = $(event.target).closest('div.row div.cell > div');
		
		if ($innerCell.length > 0) {
			if (event.type == 'click') { // only type of events for now
				x = 5;
				// let's unselect anything already selected regardless
				
				
				if (event.target.className == 'inner-cell') {
					that.unselect(that);
					
					// we are selecting a new cell
					that.$selectedCell = $innerCell;
					$innerCell.toggleClass('inner-cell inner-cell-select');
					$innerCell.parent().css('zIndex', '5');
					$innerCell.parent().parent().css('zIndex', '5');
					
					//retrieve row and col
					var row = parseInt($innerCell.parent().parent().attr('row'));
					var col = parseInt($innerCell.parent().attr('col'));
					
					//activate the header
					//that.$selectedCol = $(this.firstChild.childNodes[col-1].firstChild);
					that.$selectedCol = that.$grid.$headerRow.children().children().eq(col-1).children();
					that.selectedColNumber = col;
					that.$selectedCol.addClass('selected');
	
					//activate the row cell
					//that.$selectedRow = $(this.childNodes[row*2].firstChild);
					that.$selectedRow = that.$grid.$leftCol.children().children().eq(row-1);
					that.selectedRowNumber = row;
					that.$selectedRow.addClass('selected');
				} else {
					that.unselect(that); //unselect anyway
				}
			};
		}
		return false; //stop propagation
	}
	
	function keyPressedHandler(event) {	
		var that = event.data;

		// if no cell selected ignore
		// check for the 4 arrows and transform that into a click event
		if (that.$selectedCell !== null) {
			// check the key value
			switch(event.keyCode)
			{

			// need to recompute the scrolling if the cell get out of sight
			// user presses the left arrow
				case 37:	if (that.selectedColNumber > 1) {							
								that.$grid.$container.children().eq((that.selectedRowNumber-1)*2).children().eq(that.selectedColNumber-2).children().click();
								that.adjustScrollPosition(that.selectedRowNumber, that.selectedColNumber-1);
							}
							break;	
							
				// user presses the right arrow
				case 39:	if (that.selectedColNumber < 50) { 
								that.adjustScrollPosition(that.selectedRowNumber, that.selectedColNumber+1);
								that.$grid.$container.children().eq((that.selectedRowNumber-1)*2).children().eq(that.selectedColNumber).children().click();
							}
							break;
							
				// user presses the up arrow
				case 38:	if (that.selectedRowNumber > 1) { 
								that.$grid.$container.children().eq((that.selectedRowNumber-2)*2).children().eq(that.selectedColNumber-1).children().click();
							}
							break;
							
				// user presses the down arrow
				case 40:	if (that.selectedRowNumber < 100) { 
								that.$grid.$container.children().eq((that.selectedRowNumber)*2).children().eq(that.selectedColNumber-1).children().click();
							}
							break;							
			}

		}
		return false; //stop propagation
	}
	
	this.adjustScrollPosition = function (rowNumber,colNumber) {
		
		// right corner beyond right part of the screen
		if (colNumber*(104 + 2*1 + 2*4) >= $grid.$container.parent().scrollLeft() + 768) {
			//$grid.$container.parent().scrollLeft((colNumber-3)*(104 + 2*1 + 2*4)); // allows 3 col on the left
			var targetOffset = (colNumber-3)*(104 + 2*1 + 2*4);
			$grid.$container.parent().animate({scrollLeft: targetOffset}, 400);
		}
		
		// left corner beyond left part of the screen
		if ((colNumber)*(104 + 2*1 + 2*4) <= $grid.$container.parent().scrollLeft()) {
			//$grid.$container.parent().scrollLeft((colNumber-3)*(104 + 2*1 + 2*4)); // allows 3 col on the left
			var targetOffset = (colNumber-4)*(104 + 2*1 + 2*4);
			$grid.$container.parent().animate({scrollLeft: targetOffset}, 400);
		}

	}
		
	
}
		