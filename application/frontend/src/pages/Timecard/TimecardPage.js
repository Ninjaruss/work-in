import React, { Component } from "react";

import {Button, Form, Container, Row, Col, Card, Nav, ListGroup} from "react-bootstrap";

const hours = 37.5
const wage = 17.50
class TimecardPage extends Component {
    constructor(){
        super();
        this.state = {
            userTable: [],
        }
    }

    componentDidMount() {
        fetch("/api/users")
          .then(res => res.json())
          .then(userTable => this.setState({userTable}, () => console.log('UserTable fetched..'), userTable));
    }

    render()
    {
        return (
            <Container className="my-5">
                <h1>Week Payout Estimate</h1>
                <p>*all estimates are based off of wage rate and hours worked this week</p>
                <ListGroup className="mx-auto w-50">
                    <ListGroup.Item> <b>Hours worked: </b>{hours}</ListGroup.Item>
                    <ListGroup.Item><b>Base wage: </b>{wage}</ListGroup.Item>
                    <ListGroup.Item><b>Total Estimate: </b>{hours*wage}</ListGroup.Item>
                </ListGroup>
                <ul>
                    {this.state.userTable.map(user =>
                        <li key={user.id}>{user.username} {user.hoursWorked} {user.basePay}</li>)}
                </ul>                
            </Container>
        )
    }
}

export default TimecardPage