function runISL(scope) {
   if(scope == null || scope == "undefined") scope = window;
  var icklist =  [
                           "forestrygames.com",
                           "play.forestrygames.com"

              ];
    if((/:\/\/([a-zA-Z0-9]*[.])*disney[.]go[.]com/.test(window.location.href)||/:\/\/([a-zA-Z0-9]*[.])*forestrygames[.]com/.test(window.location.href)||/:\/\/([a-zA-Z0-9]*[.])*disney[.]com/.test(window.location.href)||/:\/\/([a-zA-Z0-9]*[.])*dilcdn[.]com/.test(window.location.href)||/:\/\/([a-zA-Z0-9]*[.])*disneyjunior[.]com/.test(window.location.href)||/:\/\/([a-zA-Z0-9]*[.])*diznee[.]net/.test(window.location.href))&&(top===window||/:\/\/([a-zA-Z0-9]*[.])*disney[.]go[.]com/.test(document.referrer)||/:\/\/([a-zA-Z0-9]*[.])*forestrygames[.]com/.test(document.referrer)||/:\/\/([a-zA-Z0-9]*[.])*disney[.]com/.test(document.referrer)||/:\/\/([a-zA-Z0-9]*[.])*dilcdn[.]com/.test(document.referrer)||/:\/\/([a-zA-Z0-9]*[.])*disneyjunior[.]com/.test(document.referrer)||/:\/\/([a-zA-Z0-9]*[.])*starwars[.]com/.test(document.referrer)||/:\/\/([a-zA-Z0-9]*[.])*diznee[.]net/.test(document.referrer)))
      if ((typeof scope != 'undefined') && (typeof scope.gameStart === 'function')) {
        scope.gameStart(); //runs game start code
      } else {
        return true;
      }
    else {
        for(var i in icklist){
          //If an array matches hostname: resets icklist, runs gameStart function, and breaks out of for-loop.
          if (window.location.hostname === icklist[i]) {

            icklist=false;
            if ((typeof scope != 'undefined') && (typeof scope.gameStart === 'function')) {
              scope.gameStart(); //runs game start code
            } else {
              return true;
            }
            break;
          }
        }
      }

  }
