(function(){

  document.addEventListener('DOMContentLoaded', function(){
    var hash = location.hash;

    if (0 === ~['#running-instances', '#stopped-instances'].indexOf(hash))
      hash = '#running-instances';

    var tab = q('[href="'+hash+'"]');
    if ('a' === tab.nodeName.toLowerCase())
      tab.click();

    function q(q){ return document.querySelector(q); }
    function qa(q){ return document.querySelectorAll(q); }

    // var
  }, false);

  document.addEventListener('click', function(e){
    if (!e.target.matchesSelector('.tabs a')) { return; }

    var link = e.target;
    var sibling = link.nextSibling || link.previousSibling;

    toggle(link, 'active', true);
    toggle(sibling, 'active', false);
  }, false);

  function toggle(elem, cls, on){
    var clss = elem.classList;
    var method = on ? 'add' : 'remove';
    clss[method](cls)
  }

})();
