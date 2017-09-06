import * as React from 'react';
import GithubCorner from 'react-github-corner';
import '../../styles/pomodoro.css';

export interface ClickFunc {
  (event: any): void;
}
export interface TimeProperty {
  time: string;
  play: boolean;
  handleClick: ClickFunc;
  type: string;
}

function DisplayPanel(props: TimeProperty) {
  return (
    <div className={'display display-clock ' + props.type} onClick={props.handleClick}>
      <p className={'display-time ' + (props.play ? 'show' : 'hide')}>{props.time}</p>
      <div className={'icon icon-play ' + (props.play ? 'hide' : 'show')} />
    </div>
  );
}

export interface UpdateFunc {
  (value: {key: string, len: number}): void;
}
export interface IncDecButtonProperty {
  minLength: number;
  maxLength: number;
  type: string;
  initLen: number;
}

export interface IncDecButtonProps {
  property: IncDecButtonProperty;
  update: UpdateFunc;  
}
export interface IncDecButtonState {
  len: number;
  validation: boolean;
}

export class IncDecButton extends React.Component<IncDecButtonProps, IncDecButtonState> {
  constructor() {
    super();
    this.state = {
      len: 0,
      validation: true,
    };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.increaseClick = this.increaseClick.bind(this);
    this.decreaseClick = this.decreaseClick.bind(this);
  }
  componentWillMount() {
    this.setState({
      len: this.props.property.initLen,
    });
  }
  validate(value: string, minLen: number, maxLen: number) {
    const validation = /^\d+$/.test(value) && Number.parseInt(value, 10) >= minLen
                      && Number.parseInt(value, 10)  <= maxLen;
    if (!validation) {
      this.setState({validation: false});
    } else {
      const key = `${this.props.property.type}Len`;
      const len = Number.parseInt(value, 10);
      const values = {key: key, len: len};
      this.setState({validation: true, len: len}, () => this.props.update(values));
      }
    }

  increaseClick(event: any) {
    event.preventDefault();
    if (this.state.validation) {
      const len = this.state.len;
      this.setState(
      {
        len: len < this.props.property.maxLength ? len + 1 : this.props.property.maxLength, 
      }, 
      () => {
        const key = `${this.props.property.type}Len`;
        const values = { key: key, len: this.state.len};
        this.props.update(values);
      });
    }
  }

  decreaseClick(event: any) {
    event.preventDefault();
    if (this.state.validation) {
      const len = this.state.len;
      this.setState(
      {
        len: len > this.props.property.minLength ? len - 1 : this.props.property.minLength ,
      },
      () => {
        const key = `${this.props.property.type}Len`;
        const values = { key: key, len: this.state.len};
        this.props.update(values);
      });
    }
  }

  onChange(event: any) {
    event.preventDefault();
    const value = (event.target as HTMLInputElement).value;
    this.validate(value, this.props.property.minLength, this.props.property.maxLength);
  }

  onBlur(event: any) {
    event.preventDefault();
    this.setState({validation: true});
  }

  render() {
    const show = this.state.validation ? 'hidden' : 'show';
    const value = this.state.len;
    const len = value ? value : this.props.property.initLen;
    const type = this.props.property.type;
    const text = type[0].toUpperCase() + type.slice(1);
    return (
      <div className="control">
        <p className={show}>Time should be interger and between 
          {this.props.property.minLength} - {this.props.property.maxLength}</p>
        <div className="wrapper">
          <button className="control-decrease" onClick={this.decreaseClick}>-</button>
        </div>
        <div className="wrapper">
          <input type="text" value={len.toString()} onChange={this.onChange} onBlur={this.onBlur}/>
        </div>
        <div className="wrapper">
          <button className="control-increase" onClick={this.increaseClick}>+</button>
        </div>
        <p className="control-text">{text} Length</p>
      </div>
    );
  }
}

export interface SaveFunction {
  (values: {sessionLen: number, breakLen: number}): void;
}

export interface ControlProperty {
  breakProperty: IncDecButtonProperty;
  sessionProperty: IncDecButtonProperty;
  save: SaveFunction;
}
export interface ControlState {
  sessionLen: number;
  breakLen: number;
}
class ControlPanel extends React.Component <ControlProperty, ControlState> {
  constructor() {
    super();
    this.state = {
      sessionLen: 25,
      breakLen: 5,
    };
    this.update = this.update.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentWillMount() {
    this.setState({
      sessionLen: this.props.sessionProperty.initLen,
      breakLen: this.props.breakProperty.initLen,
    });
  }
  handleClick() {
    this.props.save({
      sessionLen: this.state.sessionLen, 
      breakLen: this.state.breakLen,
    });
  }
  update(value: {key: string, len: number}) {
    const state = this.state;
    state[value.key] = value.len;
    this.setState(state);
  }
  
  render() {
    const props = this.props;
    return (
      <div className="control-panel">
        <div className="control-panel-button">
        <IncDecButton property={props.breakProperty} update={this.update}/>
        <IncDecButton property={props.sessionProperty} update={this.update}/>
        </div>
        <button className="control-save" onClick={this.handleClick}>Restart</button>
      </div>
    );
  }
}

export interface PomodoroState {
  sessionLen: number;
  breakLen: number;
  time: number;
  play: boolean;
  type: string;
}
class Pomodoro extends React.Component<{}, PomodoroState> {
  constructor() {
    super();
    let sessionLen: string | number | null = localStorage.getItem('sessionLen');
    let breakLen: string | number | null = localStorage.getItem('breakLen');
    sessionLen = sessionLen ? Number.parseInt(sessionLen, 10) : 25;
    breakLen = breakLen ? Number.parseInt(breakLen, 10) : 5;

    this.state = {
      sessionLen: sessionLen,
      breakLen: breakLen,
      time: 0,
      play: false,
      type: 'session',
    };
    this.timeFormat = this.timeFormat.bind(this);
    this.save = this.save.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.timer = this.timer.bind(this);
  }

  private timerId: number;
  componentDidMount() {
    // Notification
    Notification.requestPermission();
  }

  timeFormat(time: number): string {
    let minutes = Math.floor(time / 60).toString();
    minutes = minutes.length === 1 ? `0${minutes}` : minutes;
    let seconds = (time % 60).toString();
    seconds = seconds.length === 1 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
  }

  timer() {
    let time = this.state.time;
    let play = this.state.play;
    if (time === 0) {
      this.expireTimer();
    } else if (!play) {
      this.setState({play: true}, () => this.timer());
    } else {      
      this.setState({time: time - 1});  
      this.timerId = window.setTimeout(this.timer, 1000); 
    }    
  }
  startTimer(time: number) {
    this.setState({time: time}, () => this.timer());
  } 
  stopTimer() {
    this.setState({play: false});
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }

  resetTimer() {
    this.stopTimer();
    const len = this.state.sessionLen * 60;
    this.setState({
      time: len,
      play: false,
      type: 'session',
    });
  }
  expireTimer() {
    if (this.state.type === 'session') {
      this.alert('session') ;
      this.setState({
        play: false,
        type: 'break',
        time: this.state.breakLen * 60,
      });
    } else {
      this.alert('break') ;
      this.resetTimer();
    }
  }

  togglePlay(event: any) {
    event.preventDefault();
    let play = this.state.play;
    if (play === true) {
      this.stopTimer();
    } else {
      this.startTimer(this.state.time);
    }
  }

  save(values: {sessionLen: number, breakLen: number}) {
    this.setState(
      {sessionLen: values.sessionLen, breakLen: values.breakLen}, 
      () => {
        this.resetTimer();
        localStorage.setItem('sessionLen', values.sessionLen.toString());
        localStorage.setItem('breakLen', values.breakLen.toString());
      });
  }

  alert(type: string) {
    // Notification
    let img = require('../../images/clock.png');
    let title = {session: 'Session Ended!', break: 'Session Ended!'};
    let notes = {
      session: {          
        icon: img,
        body: 'You should have a rest.',
        vibrate: [200, 100, 200],
      },
      break: { 
        icon: img, 
        body: 'You should start to work.',
        vibrate: [200, 100, 200],
      }
    };
    let _notification = new Notification(title[type], notes[type]);
    _notification.onclick = () => console.log('test');
    
    // alert sound
    let song = require('../../media/alarm.mp3');
    let audio = new Audio(song);
    audio.play();
    setTimeout(() => audio.pause(), 2000);
  }

  render() {
    const state = this.state;
    const time = state.time;
    const breakProperty = {
      minLength: 1,
      maxLength: 30,
      type: 'break',
      initLen: state.breakLen,
    };
    const sessionProperty = {
      minLength: 1,
      maxLength: 60,
      type: 'session',
      initLen: state.sessionLen,
    };

    return ( 
      <div className="Pomodoro">
        <GithubCorner 
          href="https://github.com/GuoXiaoyang/typescript-react-pomodoro"
          bannerColor="#1082A5"
          octoColor="#272727"
        />
        <div className="Pomodoro-header">
          <h2>Pomodoro Clock</h2>
        </div>
        <DisplayPanel time={this.timeFormat(time)} play={state.play} handleClick={this.togglePlay} type={state.type}/>
        <ControlPanel breakProperty={breakProperty} sessionProperty={sessionProperty} save={this.save} />
      </div>
    );
  }
}

export default Pomodoro;
