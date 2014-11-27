/*
Add this file and neighboring toc.css to $(ipython locate)/nbextensions/

And load it with:

require(["nbextensions/toc"], function (toc) {
console.log('Table of Contents extension loaded');
toc.load_ipython_extension();
// If you want to load the toc by default, add:
// $([IPython.events]).on("notebook_loaded.Notebook", toc.table_of_contents);
});

*/

// adapted from https://gist.github.com/magican/5574556

define(["require"], function (require) {
  "use strict";

  var clone_anchor = function (element) {
    // clone link
    var h = element.find("div.text_cell_render").find(':header').first();
    var a = h.find('a').clone();
    var new_a = $("<a>");
    new_a.attr("href", a.attr("href"));
    // get the text *excluding* the link text, whatever it may be
    var hclone = h.clone();
    hclone.children().remove();
    new_a.text(hclone.text());
    return new_a;
  };

  var ol_depth = function (element) {
    // get depth of nested ol
    var d = 0;
    while (element.prop("tagName").toLowerCase() == 'ol') {
      d += 1;
      element = element.parent();
    }
    return d;
  };
  
  var create_toc_div = function () {
    var toc_wrapper = $('<div id="toc-wrapper"/>')
    .append(
      $("<div/>")
      .addClass("header")
      .text("Contents ")
      .click( function(){
        $('#toc').slideToggle();
        $('#toc-wrapper').toggleClass('closed');
        if ($('#toc-wrapper').hasClass('closed')){
          $('#toc-wrapper .hide-btn').text('[+]');
        } else {
          $('#toc-wrapper .hide-btn').text('[-]');
        }
        return false;
      }).append(
        $("<a/>")
        .attr("href", "#")
        .addClass("hide-btn")
        .text("[-]")
      )
    ).append(
        $("<div/>").attr("id", "toc")
    );
    $("body").append(toc_wrapper);
  };

    // from https://github.com/kmahelona/ipython_notebook_goodies/blob/master/ipython_notebook_toc.js
    // Builds a <ul> Table of Contents from all <headers> in DOM
  function createTOC(){
      var toc = "";
      var level = 0;
      var levels = {}
      $('#toc').html('');
      
      $(":header").each(function(i){
	  if (this.id=='tocheading'){return;}
          
	  var titleText = this.innerHTML;
	  var openLevel = this.tagName[1];
	  
	  

	  if (levels[openLevel]){
	      levels[openLevel] += 1;
	  } else{
	      levels[openLevel] = 1;
	  }
	  
	  if (openLevel > level) {
	      toc += (new Array(openLevel - level + 1)).join('<ul class="toc">');
	  } else if (openLevel < level) {
	      toc += (new Array(level - openLevel + 1)).join("</ul>");
	      for (i=level;i>openLevel;i--){levels[i]=0;}
	  }
	  
	  level = parseInt(openLevel);
	  
	  
	  if (this.id==''){this.id = this.innerHTML.replace(/ /g,"-")}
	  var anchor = this.id;
          
	  toc += '<li><a href="#' + anchor + '">' +  romanize(levels[openLevel].toString()) + '. ' + titleText
	      + '</a></li>';
          
      });
      
      
      if (level) {
	  toc += (new Array(level + 1)).join("</ul>");
      }
      
      
      $('#toc').append(toc);
      
  };
    
// Converts integer to roman numeral
    function romanize(num) {
	var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
	    roman = '',
	    i;
	for ( i in lookup ) {
	    while ( num >= lookup[i] ) {
		roman += i;
		num -= lookup[i];
	    }
	}
	return roman;
    }


  var table_of_contents = function (threshold) {
    if (threshold === undefined) {
      threshold = 4;
    }
    //var cells = IPython.notebook.get_cells();
      
    var toc_wrapper = $("#toc-wrapper");
    if (toc_wrapper.length === 0) {
      create_toc_div();
    }
  


    createTOC();


    $(window).resize(function(){
      $('#toc').css({maxHeight: $(window).height() - 200});
    });

    $(window).trigger('resize');
  };
    
  var toggle_toc = function () {
    // toggle draw (first because of first-click behavior)
    $("#toc-wrapper").toggle();
    // recompute:
    table_of_contents();
  };
  
  var toc_button = function () {
    if (!IPython.toolbar) {
      $([IPython.events]).on("app_initialized.NotebookApp", toc_button);
      return;
    }
    if ($("#toc_button").length === 0) {
      IPython.toolbar.add_buttons_group([
        {
          'label'   : 'Table of Contents',
          'icon'    : 'icon-list',
          'callback': toggle_toc,
          'id'      : 'toc_button'
        },
      ]);
    }
  };
  
  var load_css = function () {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = require.toUrl("./toc.css");
    console.log(link);
    document.getElementsByTagName("head")[0].appendChild(link);
  };
  
  var load_ipython_extension = function () {
    load_css();
    toc_button();
    // $([IPython.events]).on("notebook_loaded.Notebook", table_of_contents);
  };

  return {
    load_ipython_extension : load_ipython_extension,
    toggle_toc : toggle_toc,
    table_of_contents : table_of_contents,
    
  };

});
