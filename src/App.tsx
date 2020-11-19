import React, { RefObject } from 'react';
import './App.css';
import { Game, GameState, Option, Text, GameEvent, GameData, Site } from './interfaces/interfaces';
import { copy, findByPath } from './utils/objects';

interface AppState extends GameState {
  textList: Array<Text>;
  showOptions: boolean;
}

const values = ['health', 'magic', 'money', 'insight', 'dexterity'];

class App extends React.Component<{ data: GameData }, AppState> implements Game {

  private textListEl: RefObject<HTMLDivElement>;
  private resetting: boolean = false;
  private textBuffer: Array<Text> = [];
  private pid: NodeJS.Timeout | null = null;
  private gameOverMessage: string = '';
  private currentState: GameState;

  constructor(props: { data: GameData }) {
    super(props);
    this.textListEl = React.createRef<HTMLDivElement>();

    this.currentState = props.data.initialize();
    this.state = Object.assign({}, this.currentState, { 
      textList: [], 
      showOptions: true, 
      showInventory: false,
    });
    this.props.data.start(this);
  }

  render() {
    const s = this.state;
    return (
      <div className="App">
        <header className="state-bar">
          <p>
            <span>第{Math.floor(s.time / 24) + 1}天{s.time % 24}点钟，</span>
            <span>在{s.player.site.name}，</span>
            <span>{s.player.holdingItem ? `手持${s.player.holdingItem.name}` : '两手空空'}</span>
          </p>
          
          <p className="values">
            {values.map(k => `${this.translate(k)}:${(s.player as any)[k]}`).map(s => (<span key={s} className="value">{s}</span>))}
          </p>
        </header>
        
        <div className="panel">
          <div className="text-panel" ref={this.textListEl}>
            {this.state.textList.map((t, i) => (
              <p key={i} className={'text ' + t.types?.join(' ') || ''}>
                <span className="content">{t.text}</span>
              </p>
            ))}
          </div>

          <div className="option-panel">
            {this.state.showOptions ? this.state.options.map((o, i) => (
              <button
                key={i} 
                className="option"
                onClick={this.handleClickOption.bind(this, o, i)}
              >{o.text}</button>
            )) 
            : <button className="option"onClick={this.flushText.bind(this, true)}> -=跳过=- </button>
            }
          </div>
        </div>
      </div>
    );
  }

  //#region text

  private flushText(all: boolean = false) {
    const list = this.textBuffer.splice(0, all ? this.textBuffer.length : 1);
    this.setState(
      s => ({ textList: s.textList.concat(list).slice(-100) }),
      () => this.textListEl.current?.scrollTo({
        top: this.textListEl.current.scrollHeight,
        behavior: 'smooth',
      })
    );
  }

  private flushLoop(isInInterval: boolean = false) {
    if (this.pid === null) {
      this.setState(() => ({ showOptions: false }));
      this.flushText();
      this.pid = setInterval(this.flushLoop.bind(this, true), 350);
    } else if (isInInterval){
      if (this.textBuffer.length) {
        this.setState(() => ({ showOptions: false }));
        this.flushText();
      } else {
        clearInterval(this.pid);
        this.pid = null;
        this.setState(() => ({ showOptions: true }));
      }
    }
  }

  appendText(text: Text | string, ...types: Array<string>) {
    if (typeof text !== 'string') {
      types = text.types || types;
      text = text.text;
    }
    const packs: Array<Text> = text.split('\n')
      .map(s => s.trim())
      .filter(s => !/^\s*$/.test(s))
      .map(s => ({ text: s, types }));
    this.textBuffer.push(...packs);
    this.flushLoop();
  }

  setOptions(options: Array<Option>) {
    this.currentState.options = options;
  }

  //#endregion

  timePass(change: number, isInNextDay: boolean = false): number {
    if (isInNextDay) {
      this.currentState.time = (Math.floor(this.currentState.time / 24) + 1) * 24 + (change % 24);
    } else {
      this.currentState.time += change;
    }
    return this.currentState.time;
  }

  reset() {
    this.resetting = true;
    this.currentState = this.props.data.initialize();
    this.setState(() => Object.assign({}, this.currentState, { 
      textList: [],
      showOptions: true,
    }));
    this.showPortOptions();
    this.resetting = false;
    this.appendText('开始游戏', 'system');
    this.props.data.start(this);
  }
  
  takeScreenshot() {
    const { textList, showOptions, ...ss } = this.state;
    this.currentState = copy(ss, true);
  }

  applyChange() {
    this.setState(this.currentState);
  }

  gameOver(reason?: string) {
    this.gameOverMessage = '游戏结束 ' + reason;
    this.resetting = true;
  }

  // 相当于游戏的主循环
  handleClickOption(option: Option, index: number) {
    this.appendText(option.text, 'self');
    // this.takeScreenshot();
    this.showPortOptions();
    const s = this.currentState;

    if (s.events.length < 0) {
      const event = s.events[s.events.length - 1];
      event.onInput(option, this);
    } else if (option.entityUid) {
      const entity = s.player.site.entities.get(option.entityUid);
      if (entity) {
        entity.onInteract(option, this)
      }
    } else if (Array.isArray(option.tag)) {
      this.execCmd(option.tag);
    }

    this.refreshOptions();

    if (this.resetting) {
      this.appendText(this.gameOverMessage, 'system');
      this.setOptions([{
        text: '重来',
        tag: ['reset']
      }]);
    }

    this.applyChange();
  }

  execCmd(cmd: Array<string>) {
    const path = cmd.slice(0, cmd.length - 1);
    const params = cmd[cmd.length - 2] || [];
    const { result, thisArg } = findByPath(this, path);
    if (typeof result === 'function') {
      (result as Function).apply(thisArg, params);
    }
  }

  triggerEvent(event: GameEvent) {
    let list = this.currentState.events;
    list.push(event);
    this.currentState.events = list.sort((a, b) => a.priority - b.priority);
    event.onStart(this);
  }

  endEvent(event: GameEvent) {
    const index = this.currentState.events.findIndex(e => e.uid === event.uid);
    if (index >= 0) {
      this.currentState.events.splice(index, 1);
    }
    this.refreshOptions();
  }

  refreshOptions() {
    const s = this.currentState;
    if (s.events.length > 0) {
      const event = s.events[s.events.length - 1];
      this.setOptions(event.onRender(this));
    } else {
      this.showPortOptions();
    }
  }

  showPortOptions() {
    const site: Site = this.currentState.player.site;
    const options = Array.from(site.entities.values(), e => e.getInteractions(this).map(o => Object.assign(o, { entityUid: e.uid }))).flat();
    this.setOptions(options);
  }

  getPlayer() {
    return this.currentState.player;
  }

  getMap() {
    return this.currentState.map;
  }

  translate(key: string): string {
    return this.props.data.translate(key);
  }

  componentDidMount() {
    this.reset();
  }
}

export default App;
