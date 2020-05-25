import * as React from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import { userActions } from '../store/userStore';



class GroupPage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            limit: 10
        }

        this.props.getLegion(this.state.limit, this.props.nextToken);
    }

    render(){
        return (
            <React.Fragment>
                <Table dark>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                   {this.props.users?.map((user, i) =>
                    <tr key={user.userId}>
                       <th scope="row">{i+1}</th>
                       <td>{user.name}</td>
                       <td>{user.role}</td>
                       <td>{user.joined}</td>
                    </tr>
                   )}
                </tbody>
                </Table>
            </React.Fragment>
        );
    }


}

const mapState = state => {
    const {users, nextToken} = state.user;
    return {
        users,
        nextToken
    }
  }

export default connect(mapState, userActions)(GroupPage);