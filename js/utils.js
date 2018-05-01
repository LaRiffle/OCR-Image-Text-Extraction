// Tools to compare elems /\d+(_\d+)*/ 
function greater(a, b){
  var t_a = String(a).split('_');
  var t_b = String(b).split('_');
  if(Number(t_a[0]) == Number(t_b[0])){
    if(t_a.length == 1 && t_b.length == 1) { // equality is not greater
      return false;
    } else if (t_a.length == 1) { // 'C1' < 'C1_C2'
      return false;
    } else if (t_b.length == 1) { // 'C1_C2' > 'C1'
      return true;
    } else { // 'C1_C2' <?> 'C1_C3'
      t_a.shift();
      t_b.shift();
      return greater(t_a.join('_'), t_b.join('_'));
    }
  } else {
    return Number(t_a[0]) > Number(t_b[0])
  }
}



/* Handle inputs with resizable auto width */

$.fn.textWidth = function(text, font) {
    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
    $.fn.textWidth.fakeEl.text(text || this.val() || this.text() || this.attr('placeholder')).css('font', font || this.css('font'));
    return $.fn.textWidth.fakeEl.width();
};

$('html').on('keypress', '.width-dynamic', function() {
    var inputWidth = $(this).textWidth();
    $(this).css({
        width: inputWidth+19
    })
}).trigger('input');
$('html').on('DOMNodeInserted', '.width-dynamic', function() {
    var inputWidth = $(this).textWidth();
    $(this).css({
        width: inputWidth+19
    })
});
