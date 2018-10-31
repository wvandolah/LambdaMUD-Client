import React, { Component } from 'react';
import './App.css';
import { Button, Header, Segment, TransitionablePortal} from 'semantic-ui-react'
import Login from './components/Login'
import Game from './components/Game'

class App extends Component {
  state = {
    auth: false,
    open: false,
    login: false,
    register: false,
    username: "",
    password: "",
    password2: ""
  }
  handleLoginClick = () => {
    this.setState({ open: !this.state.open, login: !this.state.login })
  }
  handleRegClick = () => this.setState({ open: !this.state.open, register: !this.state.login })

  handleClose = () => {
    this.setState({ open: false, login: false, register: false })
  }
  
  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value})
  }

  toggleVisibility = () => {
    this.setState({ auth: !this.state.auth})
    this.handleClose()
  }

  render() {
    const { open, login, register } = this.state
    return (
      <div>
        {!this.state.auth ? 
        <>
          <Button
            content={open && login ? 'Close Login' : 'Open Login'}
            negative={open && login}
            positive={!open && !login}
            onClick={this.handleLoginClick}
          />
          <Button
            content={open && register ? 'Close register' : 'Open register'}
            negative={open && register}
            positive={!open && !register}
            onClick={this.handleRegClick}
          />
          <TransitionablePortal onClose={this.handleClose} open={open}>
            <Segment style={{ left: '20%', position: 'fixed', top: '20%', zIndex: 1000 }}>
              <Header>This is where you {register ? "Register": "Login"}</Header>
              <Login register={register} toggle={this.toggleVisibility}/>
            </Segment>
          </TransitionablePortal>
        </>
        :
        <Game toggle={this.toggleVisibility}/>
        }
        
      </div>
    );
  }
}

export default App;
