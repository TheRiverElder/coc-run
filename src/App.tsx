import React, { RefObject } from 'react';
import './App.css';
import InventoryEvent from './buildin/events/InventoryEvent';
import { Game, GameState, Option, Text, GameEvent, GameData, Site } from './interfaces/interfaces';
import { Subopt } from './interfaces/types';
import { findByPath } from './utils/objects';

function OptionBtn(props: { option: Option, className: string, onClick: (option: Option, subopt: Subopt | null) => void }) {
  const { className, option, onClick } = props;
  return (
    <button className={className} onClick={option.subopts ? undefined : () => onClick(option, null)}>
      {option.leftText ? <span className="option-side-text left">{option.leftText}</span> : null}
      {option.rightText ? <span className="option-side-text right">{option.rightText}</span> : null}

      {option.text}
      {option.subopts ? option.subopts.map((s, i) => (<span key={i} className="subopt" onClick={() => onClick(option, s)}>{s.text}</span>)) : null}
    </button>
  );
}

interface AppState extends GameState {
  textList: Array<Text>;
  showOptions: boolean;
}

interface AppProps {
  data: GameData;
  debugMode?: boolean;
}

const values = ['magic', 'money', 'insight', 'strength', 'dexterity'];

class App extends React.Component<AppProps, AppState> implements Game {

  public debugMode: boolean;

  private textListEl: RefObject<HTMLDivElement>;
  private resetting: boolean = false;
  private textBuffer: Array<Text> = [];
  private pid: NodeJS.Timeout | null = null;
  private gameOverMessage: string = '';
  private currentState: GameState;
  // private entityMap: UniqueMap<Entity> = new UniqueMap<Entity>();

  constructor(props: AppProps) {
    super(props);
    this.debugMode = props.debugMode || false;
    this.textListEl = React.createRef<HTMLDivElement>();

    this.currentState = props.data.initialize();
    this.state = Object.assign({}, this.currentState, { 
      textList: [], 
      showOptions: true, 
      showInventory: false,
    });
  }

  render() {
    const s = this.state;
    const p = s.player;
    return (
      <div className="App">
        <header className="state-bar">
          <p>
            <span>第{Math.floor(s.time / 24) + 1}天{s.time % 24}点钟，</span>
            <span>在{p.site.name}，</span>
            <span>{p.holdingItem ? `手持${p.holdingItem.name}(${p.holdingItem.previewDamage(this)})` : '两手空空'}</span>
          </p>
          
          <p className="values">
            <span className="value">{`${this.translate('health')}:${p.health}/${p.maxHealth}`}</span>
            {values.map(k => `${this.translate(k)}:${(p as any)[k]}`).map(s => (<span key={s} className="value">{s}</span>))}
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
            <div className="fab" onClick={this.openInventory.bind(this)}>💰</div>
            
            {this.state.showOptions ? this.state.options.map((o, i) => (
              <OptionBtn
                key={i} 
                className="option"
                option={o}
                onClick={this.handleClickOption.bind(this)}
              />
            )) 
            : <button className="option skip-btn"onClick={this.flushText.bind(this, true)}> ⏩ </button>
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
    let translated = false;
    if (typeof text !== 'string') {
      translated = text.translated || false;
      types = text.types || types;
      text = text.text;
    }
    text = translated ? this.translate(text) : text;
    const lines: Array<string> = text.split('\n')
      .map(s => s.trim())
      .filter(s => !/^\s*$/.test(s));
    const packs: Array<Text> = lines.map(s => ({ text: s, types }));
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
    const player = this.currentState.player;
    player.site.addEntity(this, player);
    // this.entityMap.clear();
    // this.currentState.map.forEach(s => s.entities.forEach(this.recordAddEntity.bind(this)))
    this.refreshOptions();
    this.resetting = false;
    this.appendText('开始游戏', 'system');
    this.props.data.start(this);
    this.applyChange();
  }

  // getEntity(uid: number): Entity | undefined {
  //   return this.entityMap.get(uid);
  // }

  // recordAddEntity(entity: Entity): void {
  //   this.entityMap.add(entity);
  // }
  
  // recordRemoveEntity(entity: Entity): void {
  //   this.entityMap.remove(entity);
  // }
  
  // takeScreenshot() {
  //   const { textList, showOptions, ...ss } = this.state;
  //   this.currentState = copy(ss, true);
  // }

  applyChange() {
    this.setState(this.currentState);
  }

  gameOver(reason?: string) {
    this.gameOverMessage = '游戏结束 ' + reason;
    this.resetting = true;
  }

  // 相当于游戏的主循环
  handleClickOption(option: Option, subopt: Subopt | null) {
    this.appendText(option.text, 'self');
    // this.takeScreenshot();
    this.showPortOptions();
    const s = this.currentState;

    if (option.tag === '__reset__') {
      this.reset();
    } else if (s.events.length > 0) {
      const event = s.events[0];
      event.onInput(this, option, subopt);
    } else if (option.entityUid) {
      const entity = s.player.site.entities.get(option.entityUid);
      if (entity) {
        entity.onInteract(this, option, subopt);
      }
    } else if (Array.isArray(option.tag)) {
      this.execCmd(option.tag);
    }

    this.refreshOptions();

    if (this.resetting) {
      this.appendText(this.gameOverMessage, 'system');
      this.setOptions([{
        text: '重来',
        tag: '__reset__'
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
  
  //#region events

  triggerEvent(event: GameEvent) {
    this.currentState.events.push(event);
    this.refreshEvents();
    event.onStart(this);
  }

  endEvent(event: GameEvent) {
    const index = this.currentState.events.findIndex(e => e.uid === event.uid);
    if (index >= 0) {
      this.currentState.events.splice(index, 1);
    }
    this.refreshOptions();
  }

  refreshEvents(): void {
    this.currentState.events.sort((a, b) => b.priority - a.priority);
  }

  findEvent(v: number | string): GameEvent | undefined {
    const fn = typeof v === 'number' ? ((e: GameEvent) => e.uid === v) : ((e: GameEvent) => e.id === v);
    return this.currentState.events.find(fn);
  }

  //#endregion

  //#region options

  refreshOptions() {
    const s = this.currentState;
    if (s.events.length > 0) {
      const event = s.events[s.events.length - 1];
      this.setOptions(event.onRender(this));
    } else {
      this.showPortOptions();
    }
  }

  openInventory() {
    if (!this.findEvent('inventory')) {
      this.triggerEvent(new InventoryEvent());
      this.refreshOptions();
      this.applyChange();
    }
  }

  showPortOptions() {
    const p = this.currentState.player;
    const site: Site = p.site;
    const options = Array.from(site.entities.values(), e => e.getInteractions(this).map(o => Object.assign(o, { entityUid: e.uid }))).flat();
    this.setOptions(options);
  }

  //#endregion

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
