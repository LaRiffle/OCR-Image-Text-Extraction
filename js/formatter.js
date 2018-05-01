var Formatter = {
  DIV_ID: 'div_formatter',
  state:  'inactive',
  selection: Selection,
  init: function(input_text){
    var $this = this;
    this.parse(input_text).appendTo($('#'+this.DIV_ID));
    $(document).mouseup(function(e){
      if($(e.target).parents('.editing').length){

      } else {
        if($this.selection.action == 'edit'){
          if(!$(e.target).parents('.actioner').length){
              $this.selection.save_edit();
          }
        }
        if($this.state == 'selection'){
          $this.stop_select();
        } else if($this.state == 'wait_for_action'){
          if(!$(e.target).parents('.actioner').length){
              $this.clear_select();
          }
        }
      }
    })
  },
  parse: function(input_text) {
    var $this = this;
    var Dom = $('<div/>');
    lines = input_text.split('\n');
    var line_idx = 0;
    var word_idx = 0;
    lines.forEach(function(line){
      if(line != ''){
        var Line = $('<div/>', {id : 'line-'+line_idx, class: 'line'});
        line.split('. ').forEach(function(word){
          var word = new Word($('<span/>', {id : 'word-'+word_idx, class: 'word', text: word}), true)
          word.appendTo(Line);
          word_idx++;
        });
        Line.appendTo(Dom);
        line_idx++;
      }
    });
    return Dom
  },
  select_word(word) {
    if(!this.selection.has(word)){
      word.select();
      this.selection.add(word);
    }
  },
  start_select: function(el){
    this.state = 'selection';
    var word = new Word(el);
    this.select_word(word);
  },
  continue_select: function(el){
    var $this = this;
    if(this.state == 'selection'){
        var word = new Word(el);
        var words = this.selection.getIntermediateWords(word);
        words.forEach(function(id){
          var word = new Word($('#word-'+id));
          $this.select_word(word);
        });
        this.select_word(word);
    }
  },
  stop_select: function(el){
    if(this.state == 'selection'){
      this.state = 'wait_for_action';
    }
    var actions = []
    if(this.selection.range.length > 1){
      actions.push('merge')
    } else {
      var id = this.selection.range[0];
      var text = Word.get_el(id).html();
      if(text.split(' ').length > 1){
        actions.push('split')
      }
      actions.push('edit');
    }
    actions.push('delete');
    this.selection.suggestAction(actions);
  },
  merge_words: function(word_ids){
    var merged_word = []
    word_ids.forEach(function(id){
      merged_word.push(Word.get_el(id).html());
    });
    merged_word = merged_word.join(' ');
    var first_id = word_ids[0];
    var first_el = Word.get_el(first_id);
    first_el.html(merged_word);
    var first_word = new Word(first_el);
    first_word.deselect();
    word_ids.shift()
    this.delete_words(word_ids);
  },
  split_words: function(word_id){
    var $this = this;
    var el = Word.get_el(word_id);
    words = el.html().split(' ');
    new_word_idx = 0;
    words.forEach(function(word){
      var word = new Word($('<span/>', {id : 'word-'+word_id+'_'+new_word_idx, class: 'word', text: word}), true)
      word.insertBefore(el);
      new_word_idx++;
    });
    this.delete_words(word_id);
  },
  delete_words: function(word_ids){
    word_ids.forEach(function(id){
      Word.get_el(id).remove();
    });
    $('.line').each(function(){
      if($(this).find('.word').length == 0){
        $(this).remove();
      }
    });
    this.clear_select();
  },
  clear_select: function(){
    this.selection.clear();
    $('.actioner').remove();
    this.state = 'inactive';
  }
}
