import * as React from 'react';
import Pomodoro from './pomodoro/pomodoro.component';
import Footer from './footer/footer.component';
import '../styles/App.css';
import 'normalize.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Pomodoro />
        <Footer />
      </div>
    );
  }
}

export default App;
