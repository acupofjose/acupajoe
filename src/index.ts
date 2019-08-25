import $ from "jquery";
import Terminal from "./terminal";

import "./scss/main.scss";

$(function() {
  const terminal = new Terminal($(".terminal"));

  terminal.addLine("# Thanks for visiting! New Commands to be added soon.");
  terminal.addLine("# Maybe get started by typing `help`");
  terminal.addLine();

  const $container = $("<div />").addClass("circles");
  for (let i = 0; i < 25; i++) {
    $container.append($("<li/>"));
  }
  $container.prependTo("body");
});
