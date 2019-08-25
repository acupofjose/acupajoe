import $ from "jquery";
import moment from "moment";

export interface TerminalConfig {
  showIntro: boolean;
  showLastLogin: boolean;
}

export interface TerminalCommand {
  command: string
  aliases?: string[]
  text?: string[]
  action: () => void
}

export default class Terminal {
  private config: TerminalConfig;

  private $el: JQuery<HTMLElement>;
  private $content: JQuery<HTMLElement>;

  private history: string[];
  private commandIndex: number;

  private introLines = [
    `  __    ___  _  _  ____   __     __   __  ____`,
    ` / _\\  / __)/ )( \\(  _ \\ / _\\  _(  ) /  \\(  __)`,
    `/    \\( (__ ) \\/ ( ) __//    \\/ \\) \\(  O )) _) `,
    `\\_/\\_/ \\___)\\____/(__)  \\_/\\_/\\____/ \\__/(____)`,
    ``
  ];

  private commands: Array<TerminalCommand> = [
    {command: "help", aliases: ["?"], text: ["Available Commands:"], action: () => {}},
    {command: "github", text: ["Opening: https://github.com/acupajoe"], action:() => window.open("https://github.com/acupajoe")},
    {command: "stackoverflow", text: ["Opening: https://stackoverflow.com/users/3629438/acupajoe"], action: () => window.open("https://stackoverflow.com/users/3629438/acupajoe")},
    {command: "email", text: ["Opening your email client.", "Excited to talk with you!"], action: () => open("mailto: joseph@acupajoe.io")},
    {command: "source", action:() => window.open("https://github.com/acupajoe/acupajoe")},
  ]

  constructor(
    $el: JQuery<HTMLElement>,
    config: TerminalConfig = { showIntro: true, showLastLogin: true }
  ) {
    this.$el = $el;
    this.$content = this.$el.find(".content");
    this.history = [];
    this.commandIndex = 0;
    this.config = config;

    if (this.config.showLastLogin) [
      this.addLine(`Last Login: ${moment().format("llll")} on ttys001`, false);
    ]
    
    if (this.config.showIntro) {
      for (const line of this.introLines) {
        this.addLine(line, false);
      }
    }

    this.registerKeyDownListener()
    this.focus()
  }

  public addLine(text?: string, isUserLine: boolean = true) {
    const $input = $("<input/>", { type: "text", val: text });
    const $line = $("<div/>", { class: "line" }).append($input);

    if (isUserLine) $line.addClass("is-user-line");

    this.$content.append($line);

    this.registerKeyDownListener();

    // Disable Previous lines
    this.$content.find("input").attr("readonly", "true");

    // Enable current line and focus
    this.getCurrentLine()
      .removeAttr("readonly")
      .focus();
  }

  public focus = () => this.getCurrentLine().focus();

  getCurrentLine = (): JQuery<HTMLElement> =>
    this.$content.find("input").last();

  parseCommand(string: string) {
    let text;
    this.history.push(string);
    this.commandIndex = this.history.length - 1;

    // Force `/` syntax
    if (string[0] !== "/") 
      return this.showCommandParseError(string)

    const cleanedCommand = string.replace("/", "")
    const command = this.findCommand(cleanedCommand)
    console.log(command)
    
    if (command) {
      for (const line of command.text) {
        this.addLine(line, false)
      }
      if (command.command === "help") {
        this.outputHelpText()
      } else {
        command.action.call(this)
      }
    this.addLine()
    } else {
      this.showCommandParseError(string)
    }
  }

  registerKeyDownListener() {
    this.$el
      .find("input")
      .off("keyup")
      .keyup(e => {
        switch (e.keyCode) {
          // Enter
          case 13:
            const value = $(e.target).val() as string;
            this.parseCommand(value);
            break;
          // Up
          case 38:
            if (this.commandIndex >= 0)
              this.getCurrentLine().val(this.history[this.commandIndex--]);
            break;
          // Down
          case 40:
            if (this.commandIndex < this.history.length)
              this.getCurrentLine().val(this.history[this.commandIndex++]);
            break;
        }
      });
  }

  outputHelpText = () => {
    for (const command of this.commands) {
      if (command.aliases) {
        this.addLine(`/${command.command}: aliases [${command.aliases.join(',')}]`, false)
      } else {
        this.addLine(`/${command.command}`, false)
      }
    }
  }

  showCommandParseError = (command: string) => {
    this.addLine(`${command}: command not found. Maybe try \`/help\``, false)
    this.addLine()
  }

  findCommand = (search: string) : TerminalCommand => {
    let item = this.commands.find(c => c.command === search)
    if (item) return item

    item = this.commands.find(c => {
      if (c.aliases != null) { 
        return !!c.aliases.find(a => a === search)
      }
      else  {
      return undefined
      }
    })

    return item
  }
}