import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import questionSet from '../DB/question';
import {Redirect} from 'react-router';

interface Props {
  userName: string;
}

export class Login extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword= this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      username:'',
      password:"",
      isAuth:false
    }
  }

  handleChangeUsername(event:any) {
    this.setState({username: event.target.value});
  }
  handleChangePassword(event:any) {
    this.setState({password: event.target.value});
  }
  handleSubmit(event:any) {
    //alert('An essay was submitted: ' + this.state.username +"     "+this.state.password);
    event.preventDefault();
      questionSet.questionSet.map(i=>{
        if(i.username=== this.state.username && this.state.password === i.password){
          //alert("Login Successful");
          this.setState({isAuth:true});
          localStorage.setItem("username",this.state.username);
          //return <Redirect to="/home"/>
          //return true;
        }
    })
    // alert("Login failed");
    // this.setState({username:''});
    // this.setState({password:''});
  }
  render() {
      if(this.state.isAuth){
        return <Redirect to='/home'/>
      }
    
    return (
     
      <div>
        <br />
        <Container>
          <Row>
          <Col xs="8" lg="3"></Col>
            <Col xs="8" lg="6">

              <Form onSubmit={this.handleSubmit} style={{border:"1px solid #999", borderRadius:'15px', padding:'1rem', margin:'1rem', textAlign:'left'}}>
                <h3>Login to GCalendar</h3>
                <hr/>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Enter email" value={this.state.username} onChange={this.handleChangeUsername}  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" value={this.state.password} onChange={this.handleChangePassword} />
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Col>
            <Col xs="8" lg="3"></Col>
          </Row>
        </Container>
        {/* <Button variant="primary">Primary</Button>{' '}
    <Button variant="secondary">Secondary</Button>{' '}
    <Button variant="success">Success</Button>{' '}
    <Button variant="warning">Warning</Button>{' '}
    <Button variant="danger">Danger</Button> <Button variant="info">Info</Button>{' '}
    <Button variant="light">Light</Button> <Button variant="dark">Dark</Button>{' '}
    <Button variant="link">Link</Button> */}

      </div>
    );
  }

}