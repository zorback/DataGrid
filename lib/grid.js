function Grid($grid) {
	this.$grid = $grid;
	this.$container = null;
	var that = this;
	
	var cell_width = 74 + 2*1 + 2*4;
	var cell_height = 28;
	
	var left_margin = 68;//row number width and margin on the left
	var top_margin = 28+20;//header row height and margin on top
	
	var nb_columns = 50;
	var nb_rows = 100;
	
	var canvas_width = left_margin + nb_columns * cell_width;
	var canvas_height = top_margin + nb_rows * cell_height;
	
	this.init = function () {
		$grid.empty();
		
		$grid.append(generateHeaderRow());
		$grid.append(generateRows());
		
		$grid.$container = $('#container');
		$grid.$headerRow = $('div.header-row');
		
		
		//register click events to pick the selected cell
		$grid.$container.bind('click', that, mouseOverCellHandler);
		
		//manage the vertical scroll so first row does not move
		$grid.$container.parent().bind('scroll', function(event) {
			$grid.$headerRow.scrollLeft(($grid.$container.parent().scrollLeft()));
		});
	}
	
	function generateHeaderRow() {
		var html = '<div class="row header-row" row="0"><div class="header-virtual" style="width:'+canvas_width+'px; height:'+canvas_height+'px;">';
		
		for (col =1; col <= nb_columns; col++) {
			// for first col adjust the border on the left
			if (col == 1) {
				html += '<div class="cell" col="' + col + '"><div class="inner-header-cell" style="border-left: 1px solid; width:74px;">First Name</div></div>';
			} else {
				html += '<div class="cell" col="' + col + '"><div class="inner-header-cell">First Name</div></div>';
			}
		}
		// add extra element to match with the scrolling bar under		
		html += '</div></div><div class="clear"/><div class="header-row-full"><div class="scrolling-top-junction"/></div>';
		return html;
	}
	
	function generateRows() {
		var html = '<div class="grid-canvas"><div class="grid-virtual" id="container" style="width:'+canvas_width+'px; height:'+canvas_height+'px;">';
		for (row = 1; row <= nb_rows; row++) {
			html += '<div class="row" row="' + row +'">';
			html += '<div class="cell row-cell" col="0">' + row + '</div>'; // row number column
			
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
			that.$selectedCell = null;
		}
		
		if (that.$selectedCol) {
			// remove the selected col
			that.$selectedCol.removeClass('selected');
			that.$selectedCol = null;
		}
		if (that.$selectedRow) {
			// remove the selected row
			that.$selectedRow.removeClass('selected');
			that.$selectedRow = null;
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
					$innerCell.parent().css('zIndex', '1000');
					
					
					//retrieve row and col
					var row = $innerCell.parent().parent().attr('row');
					var col = $innerCell.parent().attr('col');
					
					//activate the header
					that.$selectedCol = $(this.firstChild.childNodes[col-1].firstChild);
					that.$selectedCol.addClass('selected');
	
					//activate the row cell
					that.$selectedRow = $(this.childNodes[row*2].firstChild);
					that.$selectedRow.addClass('selected');
				} else {
					that.unselect(that); //unselect anyway
				}
			};
		}
		return false; //stop propagation
		
	}
	
	
	
	
}
		