import React, { RefObject } from 'react';
import './App.css';
import WeaponComponent from './buildin/components/WeaponComponent';
import InventoryEvent from './buildin/events/InventoryEvent';
import { Game, GameState, Option, Text, GameEvent, GameData, Site } from './interfaces/interfaces';
import { DisplayText, Subopt } from './interfaces/types';
import { findByPath } from './utils/objects';

function OptionBtn(props: { option: Option, className: string, handleClickOption: (text: Text | string, action: () => void) => void }) {
  const { className, option, handleClickOption } = props;
  return (
    <button
      className={className}
      onClick={() => {
        if (option.action) {
          handleClickOption(option.text, option.action);
        }
      }}
    >
      {option.leftText && <span className="option-side-text left">{option.leftText}</span>}
      {option.rightText && <span className="option-side-text right">{option.rightText}</span>}

      {option.text}
      {option.subopts && option.subopts.map((suboption, i) => (
        <span
          key={i}
          className="subopt"
          onClick={(e) => {
            e.stopPropagation();
            suboption.action?.();
            if (suboption.action) {
              handleClickOption(suboption.text, suboption.action);
            }
          }}
        >{suboption.text}</span>
      ))}
    </button>
  );
}

interface AppState {
  textList: Array<Text>;
  options: Array<Option>;
  showOptions: boolean;
}

interface AppProps {
  data: GameData;
  debugMode?: boolean;
}

const values = ['magic', 'money', 'insight', 'dexterity'];

class App extends React.Component<AppProps, AppState> implements Game {

  public debugMode: boolean;

  private textListElement: RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  private resetting: boolean = false;
  private textBuffer: Array<Text> = [];
  private pid: NodeJS.Timeout | null = null;
  private gameOverMessage: string = '';
  private currentState: GameState;
  // private entityMap: UniqueMap<Entity> = new UniqueMap<Entity>();

  constructor(props: AppProps) {
    super(props);
    this.debugMode = props.debugMode || false;

    this.currentState = props.data.initialize(this);
    this.state = Object.assign({}, this.currentState, {
      textList: [],
      showOptions: true,
      showInventory: false,
    });
  }

  private uidCounter = 1;
  generateUid(): number {
    return this.uidCounter++;
  }

  render() {
    const s = this.state;
    const player = this.getPlayer();
    const heldItem = player.getItemOnMainHand();
    const previewDamage = heldItem?.tryGetComponent<WeaponComponent>(WeaponComponent.ID)?.previewDamage() ?? 0;

    return (
      <div className="App">
        {/* 顶部栏，显示血量等状态 */}
        <header className="state-bar">
          <p>
            {/* <span>第{Math.floor(this.time / 24) + 1}天{s.time % 24}点钟，</span> */}
            <span>在{player.site.name}，</span>
            <span>{heldItem ? `手持${heldItem.name}(${previewDamage})` : '两手空空'}</span>
          </p>

          <p className="values">
            <span className="value">{`${this.translate('health')}:${player.living.health}/${player.living.maxHealth}`}</span>
            {values.map(k => `${this.translate(k)}:${(player as any)[k]}`).map(s => (<span key={s} className="value">{s}</span>))}
          </p>
        </header>

        {/* 主界面 */}
        <div className="panel">
          {/* 消息文本都在这里 */}
          <div className="text-panel" ref={this.textListElement}>
            {this.state.textList.map((t, i) => (
              <p key={i} className={'text ' + t.types?.join(' ') || ''}>
                <span className="content">{t.text}</span>
              </p>
            ))}
          </div>

          {/* 选项栏 */}
          <div className="option-panel">
            <div className="fab" onClick={this.openInventory.bind(this)}>💰</div>

            {this.state.showOptions ? this.state.options.map((option, i) => (
              <OptionBtn
                key={i}
                className="option"
                option={option}
                handleClickOption={this.handleClickOption}
              />
            )) : (
              <button className="option skip-btn" onClick={this.flushText.bind(this, true)}> ⏩ </button>
            )}
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
      () => this.textListElement.current?.scrollTo({
        top: this.textListElement.current.scrollHeight,
        behavior: 'smooth',
      }),
    );
  }

  private flushLoop(isInInterval: boolean = false) {
    if (this.pid === null) {
      this.setState(() => ({ showOptions: false }));
      this.flushText();
      this.pid = setInterval(this.flushLoop.bind(this, true), 350);
    } else if (isInInterval) {
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

  appendText(text: DisplayText, ...types: Array<string>) {
    let translated = false;
    if (typeof text === 'string' && text.startsWith('#')) {
      text = { text: text.slice(1), translated: true };
    }
    if (typeof text !== 'string') {
      translated = text.translated || false;
      types = text.types || types;
      text = text.text;
    }
    text = translated ? this.translate(text) : text;
    const packs: Array<Text> = text.split('\n')
      .map(s => s.trim())
      .filter(s => !/^\s*$/.test(s)) // 去除空字符串
      .map(str => { // 解析样式
        const result = /@\s*([^@]+)\s*@$/.exec(str);
        let finalTypes = types;
        if (result) {
          str = str.slice(0, result.index).trim();
          finalTypes = result[1].trim().split(/\s+/);
        }
        return { text: str, types: finalTypes };
      });
    this.textBuffer.push(...packs);
    this.flushLoop();
  }

  setOptions(options: Array<Option>) {
    this.setState({ options });
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
    this.currentState = this.props.data.initialize(this);
    const player = this.currentState.player;
    player.site.addEntity(player);
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
    this.forceUpdate();
  }

  gameOver(reason?: string) {
    this.gameOverMessage = '游戏结束 ' + reason;
    this.resetting = true;
  }

  // 相当于游戏的主循环
  private handleClickOption = (text: Text | string, action: () => void) => {
    this.appendText(text, 'self');

    action();

    // this.takeScreenshot();
    this.showSiteOptions();

    this.refreshOptions();

    if (this.resetting) {
      this.appendText(this.gameOverMessage, 'system');
      this.setOptions([{
        text: '重来',
        action: () => this.reset(),
      }]);
    }

    this.applyChange();
  };

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
    event.onStart();
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
      this.setOptions(event.onRender());
    } else {
      this.showSiteOptions();
    }
  }

  openInventory() {
    if (!this.findEvent('inventory')) {
      this.triggerEvent(new InventoryEvent(this));
      this.refreshOptions();
      this.applyChange();
    }
  }

  showSiteOptions() {
    const player = this.currentState.player;
    const site: Site = player.site;
    const options = Array.from(site.entities.values(), e => e.getInteractions().map(o => Object.assign(o, { entityUid: e.uid }))).flat();
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
