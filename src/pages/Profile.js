import * as React from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Button, FormText, Row, Col, Progress } from 'reactstrap';
import { Storage } from 'aws-amplify';
import ProfileSvc from '../store/repo/profileService';



class ProfilePage extends React.Component{
    constructor(props) {
        super(props);

        const {userId, name,role,company} = this.props.userProfile;

        this.state = {
            image: '/img/no-profile-picture.jpg',
            userId,
            name,
            role,
            company,
            validate: {
                formMessage: ''
              },
            upload: 0
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentWillMount(){
        var profileImg = await ProfileSvc.getProfileImage();
          this.setState({
            image: profileImg
          });
    }
    
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
            ProfileSvc.updateProfile(this.state.userId, this.state);
        } catch (e){
            console.log(e);
            this.setState({
                validate: {
                    formMessage: e.message
                  }
            })
        }
    }

    editForm() {
        const {name, role, company} = this.state;
        return (
            <Form onSubmit={this.handleSubmit}>
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
                <FormGroup>
                    <Label>Role</Label>
                    <Input
                        id="role" 
                        name="role"
                        type="input"
                        placeholder="Role"
                        value={role}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Company</Label>
                    <Input
                        id="company" 
                        name="company"
                        type="input"
                        placeholder="Company"
                        value={company}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup><FormText>{this.state.validate.formMessage}</FormText></FormGroup>
                <Button>Save</Button>  
            </Form>
        );
    }

    onFileChange = (e) => {
        const file = e.target.files[0];
        
        Storage.put(`profile-picture.jpg`, file, {
            level: 'protected',
            contentType: file.type,
            progressCallback: this.uploadProgress
        })
        .then (result => console.log(result))
        .catch(err => console.log(err));
        
    }

    uploadProgress = (progress) => {
        this.setState({upload:(progress.loaded/progress.total)*100});
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
    }

    profileImage(){
        var image = this.state.image;
        return(
            <React.Fragment>
                <img src={image} alt={this.state.name} width="300" />
                <input
                    type="file" accept='image/jpeg'
                    onChange={this.onFileChange}
                />
                {(this.state.upload > 0) ? <Progress value={this.state.upload} /> : ""}
                
            </React.Fragment>
        );
    }

    profileCard() {
        return (
            <React.Fragment>
                <Row>
                    <Col></Col>
                    <Col>{this.props.userProfile.name}</Col>
                </Row>
            </React.Fragment>
        );
    }

    render(){
        return (
            <React.Fragment>
                <Row xs="1" sm="2" lg="3">
                    <Col>{this.profileImage()}</Col>
                    <Col>{this.editForm()}</Col>
                </Row>
            </React.Fragment>
        );
    }


}

export default connect()(ProfilePage);