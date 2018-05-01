class Word {
  constructor(el, bind = false) {
    this.el = $(el);
    var word = $(el);
    if(bind){
      this.el.mousedown(function(){
        if(word.hasClass('editing')){

        } else {
          if(Formatter.selection.action == 'edit'){
            Formatter.selection.save_edit();
          }
          if(Formatter.state == 'inactive'){
            Formatter.start_select(word);
          } else if(Formatter.state == 'wait_for_action'){
            Formatter.clear_select();
            Formatter.start_select(word);
          }
        }
      })
      this.el.mouseover(function(){
        Formatter.continue_select(word);
      })
      this.el.dblclick(function(){
        if(Formatter.selection.action != 'edit'){
          Formatter.selection.action = 'edit';
          Formatter.selection.edit();
        }
      });
    }
  }
  static exists(id) {
    return ($('#word-'+id).length > 0)
  }
  static get_el(id){
    return $('#word-'+id);
  }
  static id(el){
    return $(el).attr('id').split('-')[1]
  }
  id() {
    return this.el.attr('id').split('-')[1]
  }
  select() {
    this.el.addClass('selected');
  }
  deselect() {
    this.el.removeClass('selected');
  }
  insertBefore(el){
    this.el.insertBefore(el);
  }
  appendTo(el){
    this.el.appendTo(el);
  }
}
