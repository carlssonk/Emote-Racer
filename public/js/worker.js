this.onmessage = (e) => {

  // #########################
  // #### COUNTDOWN TIMER ####
  // #########################

  if(e.data === "startCountdown") {
    let count = 50;
    let counter = setInterval(() => initBattleRoyaleTimer(), 100); //10 will  run it every 100th of a second
    function initBattleRoyaleTimer() {
      // STOP TIMER IF USER EXITS PAGE
      this.stopCountdownClearInterval = function() {
        console.log("CLEAR")
        clearInterval(counter);
      }

      // UPDATE DOM ON WINDOW FOCUS
      this.updateTimerOnDom = function() {
        this.postMessage({name: "updateCountdown", message: count})
      }

      // UPDATE ON APP.JS + STOP TIMER
      if (count <= 0) {
        console.log("DONT RUN")
        clearInterval(counter);
        this.postMessage("stopCountdown")
        return;
      }
      count--;
    }
  }

  if(e.data === "updateCountdown") {
    updateTimerOnDom();
  }
  
  if(e.data === "clearCountdown") {
    stopCountdownClearInterval();
  }

  // ########################
  // #### TIME LEFT BAR #####
  // ########################

  if(e.data === "startProgressBar") {
    let barPercentage = 400
    const counter = setInterval(() => progress(), 40); // update progress bar once every 40ms

    function progress() {
        // STOP PROGRESS TIMER IF USER EXITS PAGE
        this.stopProgressClearInterval = function() {
          clearInterval(counter);
        }

      // UPDATE DOM ON WINDOW FOCUS
      this.updateProgressOnDom = function() {
        this.postMessage({name: "updateProgressBar", message: barPercentage})
      }

      if(barPercentage <= 0) {
        clearInterval(counter);
        this.postMessage("stopProgressBar")
        return;
      }

      barPercentage--
    };
  }

  if(e.data === "updateProgressBar") {
    updateProgressOnDom();
  }

  if(e.data === "clarProgressBar") {
    stopProgressClearInterval();
  }


  // #############################
  // #### COUNTDOWN TIMER 1v1 ####
  // #############################

  if(e.data === "startCountdown1v1") {
    let count = 60;
    let counter = setInterval(() => init1v1Timer(), 1000); //10 will  run it every 100th of a second
    function init1v1Timer() {
      // STOP TIMER IF USER EXITS PAGE
      this.stopCountdownClearInterval1v1 = function() {
        clearInterval(counter);
      }

      // UPDATE DOM ON WINDOW FOCUS
      this.updateTimerOnDom1v1 = function() {
        this.postMessage({name: "updateCountdown1v1", message: count})
      }

      // UPDATE ON APP.JS + STOP TIMER
      if (count <= 0) {
        console.log("DONT RUN")
        clearInterval(counter);
        this.postMessage("stopCountdown1v1")
        return;
      }
      count--;
    }
  }

  if(e.data === "updateCountdown1v1") {
    updateTimerOnDom1v1();
  }
  
  if(e.data === "clearCountdown1v1") {
    stopCountdownClearInterval1v1();
  }



}