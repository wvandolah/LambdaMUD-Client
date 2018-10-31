import React, { Component } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';
import { Container, Header, Button, Form, Segment  } from 'semantic-ui-react'

class Game extends Component {
  state = {
    gametext: ["Welcome!"],
    uuid: '',
    input: ''
  }

  async componentDidMount() {
    const token = window.localStorage.getItem('token')
    const headers = { headers: { Authorization: `Token ${token}` }}
    try{
      const response = await axios.get(process.env.REACT_APP_BACKEND + 'adv/init/', headers)
      this.setState({ 
        gametext: [...this.state.gametext, `${response.data.title}: ${response.data.description}`, `players in room: ${response.data.players.join(' ')}`],
        uuid: response.data.uuid
      });

    }catch(err){
      console.log(err)
    }
    
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: 'us2',
      encrypted: true
    });
    const test = `p-channel-${this.state.uuid}`
    console.log(test)
    const channel = pusher.subscribe(`p-channel-${this.state.uuid}`)
    channel.bind('broadcast', data => {
      console.log(data)
      this.setState({ gametext: [...this.state.gametext, data.message]})
    })
  }

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value})
  }

  submit = async e => {
    e.preventDefault();
    console.log(this.state.input.length)
    const token = window.localStorage.getItem('token')
    const headers = { headers: { Authorization: `Token ${token}` }}
    try{
      if(this.state.input.length === 1){
        const direct = {direction: this.state.input}
        const response = await axios.post(process.env.REACT_APP_BACKEND + 'adv/move/', direct, headers)
        this.setState({ 
          gametext: [...this.state.gametext, `${response.data.error_msg} ${response.data.title}: ${response.data.description}`, `players in room: ${response.data.players.join(' ')}`],
          input: ''
        });
      }else{
        const words = {message: this.state.input}
        const response = await axios.post(process.env.REACT_APP_BACKEND + 'adv/say/', words, headers)
        console.log(response)
        this.setState({ 
          gametext: [...this.state.gametext, response.data.response],
          input: ''
        });
      }
    } catch(err){
      console.log(err)
    }
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  render() {

    return(
      <>
        <Container text>
          <Header as='h2'>This is a game</Header>
            <div>
              {this.state.gametext.map((lineOfText, index) => {
                return (
                  <ul key={index}>
                    <li>{lineOfText}</li>
                  </ul>
                )
              })}
              <div style={{ float:"left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
              </div>
            </div>
          <Segment inverted>
            <Form inverted>
              <Form.Group widths='equal'>
                <Form.Input fluid 
                  label='Enter one letter to move, more than one to say' 
                  placeholder='Type Here' 
                  name='input'
                  value={this.state.input}
                  onChange={this.handleInput}/>
              </Form.Group>
              <Button type='submit' onClick={this.submit}>Submit</Button>
            </Form>
          </Segment>
        </Container>

      </>
    );
  }

}

export default Game