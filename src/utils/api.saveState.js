import $ from 'jquery'

const API_URL = 'http://localhost:8080'

const LOAD_URL = API_URL + '/load'

const SAVE_URL = API_URL + '/saveState'

export function loadStates (onSuccess) {
  $.ajax({
    type: "GET",
    url: LOAD_URL,
    success: function(data) {
      console.info("response: ", data)
      onSuccess(data.states);
    }
  });
};

export function saveState (state, onSuccess) {
  var state = JSON.stringify(state);
  $.ajax({
    type: "POST",
    url: SAVE_URL,
    data: state,
    contentType: "application/json",
    success: function(data) {
      console.info("response: ", data)
      onSuccess(data.states);
    }
  });
  return;
}