import React, { Component } from "react";

import {Container, ListGroup} from "react-bootstrap";

const hours = 37.5
const wage = 17.50
class TimecardPage extends Component {
    constructor(){
        super();
        this.state = {
            user: null,
        }
    }

    componentDidMount() {
        fetch("/api/users/me")
          .then((res) => res.json())
          .then((user) => this.setState({ user }, () => console.log("User fetched..")));
    }

    render()
    {
        const { user } = this.state; // Destructure user from state

        return (
            <Container className="my-5">
                <h1>Week Payout Estimate</h1>
                <p>*all estimates are based off of wage rate and hours worked this week</p>
                <ListGroup className="mx-auto w-50">
                    <ListGroup.Item> <b>Hours worked: </b>{hours}</ListGroup.Item>
                    <ListGroup.Item><b>Base wage: </b>{wage}</ListGroup.Item>
                    <ListGroup.Item><b>Total Estimate: </b>{hours*wage}</ListGroup.Item>
                </ListGroup>
                {user ? ( // Conditional rendering to handle cases where user is null or not yet fetched
                    <ul>
                        {user.first_name}
                    </ul>
                    ) : (
                    <p>Loading user data...</p>
                )}   
                          
            </Container>
        )
    }
}

export default TimecardPage