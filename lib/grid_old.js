function Grid($container) {
	var $container = $container;
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
		$container.empty();
		
		// adjust virtual size
		$container.css('width', canvas_width);
		$container.css('height', canvas_height);
		
		
		$container.append(generateHeaderRow());
		$container.append(generateRows());
		
		//register click events to pick the selected cell
		$container.bind('click', that, mouseOverCellHandler);
		
		//manage the vertical scroll so first row does not move
		$container.parent().bind('scroll', function(event) {
			$('div.header-row').scrollTop($container.parent().scrollTop()));
		});
	}
	
	function generateHeaderRow() {
		var html = '<div class="row header-row" row="0">';
		for (col =1; col <= nb_columns; col++) {
			html += '<div class="cell" col="' + col + '"><div class="inner-header-cell">First Name</div></div>';
		}
		html += '</div><div class="clear"/>';
		return html;
	}
	
	function generateRows() {
		var html = '';
		for (row = 1; row <= nb_rows; row++) {
			html += '<div class="row" row="' + row +'">';
			html += '<div class="cell row-cell" col="0">' + row + '</div>'; // row number column
			
			for (col = 1; col <= nb_columns; col++) {
				html += '<div class="cell" col="' + col + '"><div class="inner-cell"></div></div>';
			}
			
			html += '</div><div class="clear"/>';
		}
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
		