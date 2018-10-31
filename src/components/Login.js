import React, { Component } from 'react'
import { Button, Form } from 'semantic-ui-react'
import axios from 'axios';

class Login extends Component {
  state = {
    username: "",
    password: "",
    password2: ""
  }
  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value})
  }
  login = e => {
    e.preventDefault();
    const userCreds = {username: this.state.username, password: this.state.password}
    axios.post('https://mysterious-brushlands-82205.herokuapp.com/api/login/', userCreds)
      .then(response => {
        window.localStorage.setItem('token', response.data.key)
        this.props.toggle()
      })
      .catch(err => {
        console.log(err)
      })

  }
  register = e => {
    e.preventDefault();
    const userCreds = {username: this.state.username, password1: this.state.password, password2: this.state.password2}
    axios.post('https://mysterious-brushlands-82205.herokuapp.com/api/registration/', userCreds)
      .then(response => {
        window.localStorage.setItem('token', response.data.key)
        this.props.toggle()
      })
      .catch(err => {
        console.log(err)
      })

  }
  render() {
    
    return (
      <Form>
        <Form.Field>
          <label>Username</label>
          <input 
            placeholder='Username' 
            name="username" 
            value={this.state.username} 
            onChange={this.handleInput}/>
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input 
            placeholder='Password' 
            type='password'
            name='password'
            value={this.state.password} 
            onChange={this.handleInput}/>
        </Form.Field>
        {this.props.register 
          ?
          <>
            <Form.Field>
              <label>Retype Password</label>
              <input 
                placeholder='Retype Password' 
                type='password'
                name='password2'
                value={this.state.password2} 
                onChange={this.handleInput}/>
            </Form.Field>
            <Button type='submit' onClick={this.register}>Submit</Button>
          </>
          :<Button type='submit' onClick={this.login}>Submit</Button>}
      </Form>
    );
  }
}

export default Login