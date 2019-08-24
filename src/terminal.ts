import $ from "jquery";
import moment from "moment";

// Functions for a terminal
$(function() {
  const $terminal = $(".terminal");
  const $content = $terminal.find(".content");
  const history = [];
  let commandIndex = 0;
  let $currentLine;

  const introLines = [
    `  __    ___  _  _  ____   __     __   __  ____`,
    ` / _\\  / __)/ )( \\(  _ \\ / _\\  _(  ) /  \\(  __)`,
    `/    \\( (__ ) \\/ ( ) __//    \\/ \\) \\(  O )) _) `,
    `\\_/\\_/ \\___)\\____/(__)  \\_/\\_/\\____/ \\__/(____)`,
    ``
  ];

  // Adds a new line to the terminal
  function addNewLine(text?: string, isNewLine: boolean = true) {
    const $input = $("<input/>", { type: "text", val: text });
    const $line = $("<div/>", { class: "line" }).append($input);

    if (isNewLine) $line.addClass("is-new-line");

    $content.append($line);

    registerKeyDownListener();

    // Disable Previous lines
    $content.find("input").attr("readonly", "true");

    // Enable current line and focus
    $currentLine = $content.find("input").last();
    $currentLine.removeAttr("readonly").focus();
  }

  // Command Parser
  function parseCommand(command: string) {
    let text;
    history.push(command);
    commandIndex = history.length - 1;
    switch (command) {
      case "/help":
        text = [
          "Available commands:",
          "/help",
          "/github",
          "/stackoverflow",
          "/email"
        ];
        for (const line of text) {
          addNewLine(line, false);
        }
        break;
      case "/github":
        addNewLine("Opening: https://github.com/acupajoe", false);
        window.open("https://github.com/acupajoe");
        break;
      case "/stackoverflow":
        addNewLine(
          "Opening: https://stackoverflow.com/users/3629438/acupajoe",
          false
        );
        window.open("https://stackoverflow.com/users/3629438/acupajoe");
        break;
      case "/email":
        text = ["Opening your email client.", "Excited to talk with you!"];
        for (const line of text) {
          addNewLine(line, false);
        }
        window.open("mailto:joseph@acupajoe.io");
        break;
      default:
        if (command === "") break;
        text = `${command}: command not found. Maybe try \`/help\`?`;
        addNewLine(text, false);
        break;
    }
    addNewLine();
  }

  // Handle key events
  function registerKeyDownListener() {
    $terminal
      .find("input")
      .off("keyup")
      .keyup(e => {
        console.log(e.keyCode);
        switch (e.keyCode) {
          // Enter
          case 13:
            const value = $(e.target).val() as string;
            parseCommand(value);
            break;
          // Up
          case 38:
            if (commandIndex >= 0) $currentLine.val(history[commandIndex--]);
            break;
          // Down
          case 40:
            if (commandIndex < history.length)
              $currentLine.val(history[commandIndex++]);
            break;
        }
      });
  }

  addNewLine(`Last Login: ${moment().format("llll")} on ttys001`, false);
  for (const line of introLines) {
    addNewLine(line, false);
  }
  addNewLine("// Maybe get started by trying /help?");
  addNewLine();

  // Focus last terminal line
  $currentLine = $terminal.find("input").last();
  $currentLine.focus();

  registerKeyDownListener();
});
