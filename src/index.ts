import "./scss/main.scss";

import $ from "jquery";

$(function() {
  const $container = $("<div />").addClass("circles");
  for (let i = 0; i < 25; i++) {
    $container.append($("<li/>"));
  }
  $container.prependTo("body");
});
