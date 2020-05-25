import * as React from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import { adminActions } from '../store/adminStore';



class UsersPage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            limit: 10
        }

        this.props.usersInGroup("admin", this.state.limit, this.props.nextToken);
    }

    render(){
        return (
            <React.Fragment>
                <Table dark>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                   {this.props.users?.map((user, i) =>
                    <tr key={user.Username}>
                       <th scope="row">{i+1}</th>
                       <td>{(user.Attributes.find((el)=> el.Name=='name')).Value}</td>
                       <td>{user.UserCreateDate}</td>
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