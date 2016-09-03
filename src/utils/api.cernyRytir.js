import {DOMAIN} from '../constants/cernyRytir/config'
import $ from 'jquery'

/*
   Orders cards at www.cernyrytir.cz
*/
export function sendOrder(queue, onSuccess) {
  console.info("Sending order: ", queue);
  queue.forEach(function(item){
    var payload = Object.assign({}, item.form);
    payload.kusu = item.orderedCount;
    var reqUrl = DOMAIN + payload.action;
    console.info("ordering: ", reqUrl, payload);
    $.ajax({
      type: "POST",
      url: reqUrl,
      data: payload,
      success: function(data) {
        onSuccess(data, item);
      },
      dataType: 'html'
    });
  });
};

