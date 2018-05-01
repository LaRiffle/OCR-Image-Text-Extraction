var Selection = {
  range: [],
  action: null,
  has: function(word){
    return this.range.includes(word.id());
  },
  add: function(word){
    this.range.push(word.id());
    this.range.sort(function(a, b){
      if(a == b)
        return 0
      else if(greater(a, b))
        return 1
      else
        return -1
    });
  },
  getIntermediateWords: function(word){
    var min = this.range[0];
    var max = String(this.range[Math.max(0, this.range.length-1)]);
    var id = String(word.id());
    var intermediateWords = [];
    if(greater(min, id)){
      $('.word').each(function(){
        var word_id = Word.id(this);
        if(greater(word_id, id) && greater(min, word_id)){
          intermediateWords.push(word_id);
        }
      });
    } else if(greater(id, max)) {
      $('.word').each(function(){
        var word_id = Word.id(this);
        if(greater(word_id, max) && greater(id, word_id)){
          intermediateWords.push(word_id);
        }
      });
    }
    return intermediateWords;
  },
  suggestAction: function(actions){
    var $this = this;
    var Panel = $('<h3 />', {class:'actioner'});
    var action_icon = {
      'merge': 'compress',
      'split': 'scissors',
      'edit': 'pencil',
      'delete': 'trash-o'
    };
    actions.forEach(function(action){
      var icon = action_icon[action];
      var Action = $('<a href="#"><i class="fa fa-'+icon+'" aria-hidden="true"></i></a>');
      Action.appendTo(Panel);
      Action.on('click', function(e){
        e.preventDefault();
        $this.action = action;
        $this[action]();
      });
    });
    var first_el = Word.get_el(this.range[0]);
    Panel.css({'top': first_el.position().top-5, 'left': -1*36*actions.length +'px'});
    Panel.appendTo($('#'+Formatter.DIV_ID));
  },
  merge: function(){
    Formatter.merge_words(this.range);
  },
  split: function(){
    Formatter.split_words(this.range);
  },
  edit: function(){
    // Note: this action is possible when exactly one word is selected
    var word_id = this.range[0];
    var el = Word.get_el(word_id);
    el.addClass('editing');
    var Input = $('<input />', {'value': el.html(), 'class': 'word-input width-dynamic '});
    el.html('');
    Input.appendTo(el);
    Input.focus();
    $('.actioner').remove();
    this.suggestAction(['delete']);
  },
  save_edit: function(){
    var word_id = this.range[0];
    var el = Word.get_el(word_id);
    var value = el.find('input').val();
    el.html(value);
    el.removeClass('editing');
    this.clear();
  },
  delete: function(){
    Formatter.delete_words(this.range);
  },
  clear: function(){
    this.range.forEach(function(id){
      if(Word.exists(id)){
        var el = Word.get_el(id);
        var word = new Word(el);
        word.deselect();
      }
    });
    this.range = [];
    this.action = null;
  }
}
