import * as React from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import ProfileSvc from '../services/profileService';



class GroupPage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            ProfileList: [],
            email: "",
            name: ""
        }
    }

    componentWillMount(){
       this.getProfileList();
    }

    getProfileList = async (limit, nextToken) => {
        ProfileSvc.listProfiles(10)
        .then((res) => {
            var list = res.data.listProfiles.items;
            this.setState({
                ProfileList: list
            });
        }).catch();
 
    }
/*    
    handleChange = async (event) => {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        await this.setState({
          [ name ]: value,
        });
      }

    handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await this.handleInvite(this.state.email, this.state.name);
        } catch (e){
            console.log(e);
        }
    }

    handleInvite = async (email, name) => {
        ProfileSvc.inviteUser(email).then((resp)=>{
            ProfileSvc.createProfile(resp.user.username, name).then(() => {
                console.log(`profile: created for ${name} : ${resp.user.username}`)
            })
        }).catch();
    }

    inviteForm(){
        const {name, email} = this.state;
        return(
            <React.Fragment>
                <Form inline onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label>Role</Label>
                        <Input
                            id="email" 
                            name="email"
                            type="input"
                            placeholder="Email"
                            value={email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Name</Label>
                        <Input
                            id="name" 
                            name="name"
                            type="input"
                            placeholder="Name"
                            value={name}
                            onChange={this.handleChange}
                            autoFocus
                        />
                    </FormGroup>
            
                <Button>Invite</Button>  
            </Form>
            </React.Fragment>
        );
    }
    */

    render(){
        return (
            <React.Fragment>
                <Table dark>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Industry Role</th>
                    <th>Company</th>
                    <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                   {this.state.ProfileList.map((profile, i) =>
                    <tr key={profile.userId}>
                       <th scope="row">{i+1}</th>
                       <td>{profile.name}</td>
                       <td>{profile.role}</td>
                       <td>{profile.company}</td>
                       <td>{profile.joined}</td>
                    </tr>
                   )}
                </tbody>
                </Table>
            </React.Fragment>
        );
    }


}

export default connect()(GroupPage);