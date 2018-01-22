export default class StateLoader {

  loadState() {
    try {
      let serializedState = localStorage.getItem("stock-viewz:state");

      if (serializedState === null) {
        return this.initializeState();
      }

      return JSON.parse(serializedState);
    }
    catch (err) {
      return this.initializeState();
    }
  }

  saveState(state) {
    try {
      let serializedState = JSON.stringify(state);
      localStorage.setItem("stock-viewz:state", serializedState);

    }
    catch (err) {
      console.error({ localStorateError: err });
    }
  }

  initializeState() {
    return defaultState;
  }
}

const defaultState = {
  date: {
    previousSession: '',
    startDate: '',
    endDate: '',
    currentDate: ''
  },
  stocks: [],
  ticker: []
}