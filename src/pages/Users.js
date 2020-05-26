import * as React from 'react';
import { connect } from 'react-redux';
import { Table, Form, FormGroup, Label, Input, Col, Button } from 'reactstrap';
import { adminActions } from '../store/adminStore';



class UsersPage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            limit: 10,
            group: "legion"
        }

        this.props.usersInGroup(this.state.group, this.state.limit, this.props.nextToken);
    }

    handleChange = async (event) => {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        await this.setState({
          [ name ]: value,
        });

        this.props.usersInGroup(this.state.group, this.state.limit, this.props.nextToken);
    }

    handleInitiateConfirm = async (e) => {
        e.preventDefault();
        try{
           this.props.confirmInitiate(e.target.id);
        } catch (e){
            console.log(e);

        }
    }

    groupAction(user) {
        if(this.state.group == "initiate"){
            return (<React.Fragment>
                <Button id={user.Username} onClick={this.handleInitiateConfirm}>Confirm</Button> <Button>Reject</Button>
            </React.Fragment>);
        } else {
            return null;
        }
        
    }

    render(){
        return (
            <React.Fragment>
                <Form>
                <FormGroup row>
                    <Label for="exampleSelect" sm={1}>Group</Label>
                    <Col sm={2}>
                    <Input type="select" name="group" id="group"  value={this.state.group} onChange={this.handleChange}>
                        <option>initiate</option>
                        <option>legion</option>
                        <option>admin</option>
                    </Input>
                    </Col>
                </FormGroup>
                </Form>
                <Table dark>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Joined</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                   {this.props.users?.map((user, i) =>
                    <tr key={user.Username}>
                       <th scope="row">{i+1}</th>
                       <td>{(user.Attributes.find((el)=> el.Name=='name')).Value}</td>
                       <td>{user.UserCreateDate}</td>
                       <td>{this.groupAction(user)}</td>
                    </tr>
                   )}
                </tbody>
                </Table>
            </React.Fragment>
        );
    }


}

const mapState = state => {
    const {users, nextToken} = state.admin;
    return {
        users,
        nextToken
    }
  }

export default connect(mapState, adminActions)(UsersPage);