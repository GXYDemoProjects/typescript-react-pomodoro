import * as React from 'react';
import '../../styles/pomodoro.css';

function DisplayClock(props: {time: string}) {
  return (
    <div className="display display-clock">
      <p className="display-time">{props.time}</p>
    </div>
  );
}

interface IncDecButtonType {
  property: {
    minLength: number,
    maxLength: number,
    name: string,
    text: string,
    initLen: number,
  };
}

function IncDecButton(props: IncDecButtonType) {
  const property = props.property;
  return (
    <div className="control">
      <div className="wrapper">
        <button className="control-decrease">-</button>
      </div>
      <div className="wrapper">
        <input type="text" name={property.name} id={property.name} placeholder={property.initLen.toString()}/>
      </div>
      <div className="wrapper">
        <button className="control-increase">+</button>
      </div>
      <p className="control-text">{property.text}</p>
    </div>
  );
}

class Pomodoro extends React.Component {
  constructor() {
    super();
  }

  render() {
    const breakButton = {
      minLength: 1,
      maxLength: 30,
      name: 'breakLength',
      text: 'Break Length',
      initLen: 5,
    };
    const sessionButton = {
      minLength: 1,
      maxLength: 60,
      name: 'sessionLength',
      text: 'Session Length',
      initLen: 25,
    };
    return (
      <div className="Pomodoro">
        <div className="Pomodoro-header">
          <h2>Pomodoro Clock</h2>
        </div>
        <DisplayClock time="00:00"/>
        <div className="control-panel">
        <IncDecButton property={breakButton}/>
        <IncDecButton property={sessionButton}/>
        </div>

      </div>
    );
  }
}

export default Pomodoro;
