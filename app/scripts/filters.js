
/* Filters */

/*angular.module('phonecatFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});*/

angular.module('dsFilters', []).filter('checkmark', function() {
  "use strict";
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});


angular.module('dsFilters',[]).filter('discoFilter1',function(){
  "use strict";
  return function(dataArray, searchTerm){
    if(!dataArray ) {
      return;
    }
    if( !searchTerm){
      return dataArray;
    }else{
      var term=searchTerm.toLowerCase();
      return dataArray.filter(function( item){

        return item.title.toLowerCase().indexOf(term) > -1 || item.entityID.toLowerCase().indexOf(term) > -1;
      });
    }
  };
});

