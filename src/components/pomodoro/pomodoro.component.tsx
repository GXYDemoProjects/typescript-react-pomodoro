import * as React from 'react';
import '../../styles/pomodoro.css';

function DisplayClock(props: {time: string}) {
  return (
    <div className="display display-clock">
      <p className="display display-time">{props.time}</p>
    </div>
  );
}

interface IncDecButtonType {
  property: {
    minLength: number,
    maxLength: number,
    name: string
  };
}

function IncDecButton(props: IncDecButtonType) {
  const property = props.property;
  return (
    <div className="control">
      <button className="control-decrease">-</button>
      <input type="number" name={property.name} id={property.name} min={property.minLength} max={property.maxLength}/>
      <button className="control-increase">+</button>
      <p className="control-text">{property.name.toLowerCase()}</p>
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
    };
    const sessionButton = {
      minLength: 1,
      maxLength: 60,
      name: 'sessionLength',
    };
    return (
      <div className="Pomodoro">
        <div className="Pomodoro-header">
          <h2>Pomodoro Clock</h2>
        </div>
        <DisplayClock time="00:00"/>
        <IncDecButton property={breakButton}/>
        <IncDecButton property={sessionButton}/>
      </div>
    );
  }
}

export default Pomodoro;
