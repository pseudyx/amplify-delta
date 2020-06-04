import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Clock from '../Clock';

export default class UserSvc {

    static async login(email, password){
        return Auth.signIn(email, password);
    }

    static async logout(){
        sessionStorage.removeItem('deltaUserSession');
        return Auth.signOut();
    }

    static async newPassword(user, password){
        return Auth.completeNewPassword(
            user,          // the Cognito User Object
            password       // the new password
        );
    }

    static async createProfile(userId, name){
        var joined = Clock.isoTimestamp();
        return API.graphql(graphqlOperation(mutations.createProfile, {input: {userId: userId, name: name, joined: joined}}));
    }

    static async getProfile(userId){
            return API.graphql(graphqlOperation(queries.getProfile, {userId}));
    }

    static async listProfiles(limit, nextToken){
        try{
            var resp = await API.graphql(graphqlOperation(queries.listProfiles, { filter: {
                confirmed: {
                    eq: 'true'
                }}, limit, nextToken}))
            return {
                nextToken: resp.data.listProfiles.nextToken, 
                profiles: resp.data.listProfiles.items
            }
        } catch(e){

        }
    }

    static async updateProfile(userId, userProfile){
        try{
           
            var authUser = await Auth.currentAuthenticatedUser()
            var status = await Auth.updateUserAttributes(authUser, {name: userProfile.name, profile: userProfile.profile})
            
            if(status === "SUCCESS") {

                var res = await API.graphql(graphqlOperation(mutations.updateProfile, 
                    {
                        input: 
                        {
                            userId: userId, 
                            name: userProfile.name, 
                            role: userProfile.role, 
                            company: userProfile.company,
                            confirmed: userProfile.confirmed
                        }
                    }));
                var user = res.data.updateProfile;

                var session = JSON.parse(sessionStorage.getItem('deltaUserSession'));
                session.name = user.name;
                session.company = user.company;
                session.role = user.role;
                session.confirmed = user.confirmed ?? false;
                sessionStorage.setItem('deltaUserSession', JSON.stringify(session));

                return session;

            } else {
                throw new Error(`Update user attributes fail: ${status}`);
            }

        } catch(e){
            throw new Error(e);
        }
        
    }

    static async updateProfilePic(file, callBack){
        try{

            const session = JSON.parse(sessionStorage.getItem('deltaUserSession'));
            var result = await Storage.put(`${session.userId}.jpg`, file, {
                level: 'protected',
                contentType: file.type,
                progressCallback: callBack
            })   
            return result;
        } catch (error){
            throw new Error(error);
        }
    }

    static async userSession() {
        try {
            const session = JSON.parse(sessionStorage.getItem('deltaUserSession'));

            if(!session) {
                var cognitoSession = await Auth.currentSession();
                console.log('userSession:');
                console.log(cognitoSession);
                var payload = cognitoSession.idToken.decodePayload();
                var groups = payload["cognito:groups"];
                var userId = payload["cognito:username"];
                var profileLink = payload.profile
                
                var res = await UserSvc.getProfile(userId);
                res = (res.data.getProfile) ? res : await this.createProfile(userId, payload.name);
                var profile = (res.data.getProfile) ? res.data.getProfile : res.data.createProfile;
                profile.profile = profileLink;
                if (groups) profile.groups = groups;

                profile.thumb = await this.getUserThumb(userId);
                profile.image = await this.getUserPic(userId);
                
                sessionStorage.setItem('deltaUserSession', JSON.stringify(profile));

                return profile;
            } else {
                session.thumb = await this.getUserThumb(session.userId);
                session.image = await this.getUserPic(session.userId);
                return session;
            }

           
          }
          catch(e) {
            throw new Error(e)
          }
    }

    static async getUserPic(userId){
        var imgResp = await fetch(`https://public.deltalegion.net/profile/${userId}-lg.jpg`);
        if(imgResp.ok){
            var imgBlob = await imgResp.blob();
            var imgSrc = URL.createObjectURL(imgBlob);
            return imgSrc;
        } else {
            return '/img/no-profile-picture.jpg';
        }
    }

    static async getUserThumb(userId) {
        var imgResp = await fetch(`https://public.deltalegion.net/profile/${userId}-sm.jpg`);
        if(imgResp.ok){
            var imgBlob = await imgResp.blob();
            var imgSrc = URL.createObjectURL(imgBlob);
            return imgSrc;
        } else {
            return '/img/no-profile-picture.jpg';
        }
    }

    static async checkUserPic(){
        const session = JSON.parse(sessionStorage.getItem('deltaUserSession'));
        session.thumb = await this.getUserThumb(session.userId);
        sessionStorage.setItem('deltaUserSession', JSON.stringify(session));
    }

    static async checkUserPic(){
        const session = JSON.parse(sessionStorage.getItem('deltaUserSession'));
        session.image = await this.getUserPic(session.userId);
        sessionStorage.setItem('deltaUserSession', JSON.stringify(session));
    } 
    
    static async registerUser(userRegister) {
        try {
            var {email, password, name, profile} = userRegister;

            const result = await Auth.signUp({
                username: email,
                password,
                attributes: {
                    email,          
                    name,
                    profile
                }
            });

            return result.user;

        } catch (error) {
            throw error;
        }
    }

    static async validateRegistration(userRegister){
        var {email, password, name, profile} = userRegister;
        if (this.isNotEmpty(email) && this.isNotEmpty(password) && this.isNotEmpty(name) && this.isNotEmpty(profile)){
            return {valid: true, message: '' };
        } else {
            var errors = [];
            if(!this.isNotEmpty(email)) errors.push('must contain email.');
            if(!this.isNotEmpty(password)) errors.push('must contain password.');
            if(!this.isNotEmpty(name)) errors.push('must contain name.');
            if(!this.isNotEmpty(profile)) errors.push('must contain profile link.');

            return {valid: false, message: errors.join(" \n") };
        }
    }

    static async confirmUser(userConfirm) {
            return Auth.confirmSignUp(userConfirm.username, userConfirm.code);
    }

    static isNotEmpty(variable){
        return (variable !== undefined && variable !== null && variable !== '');
    }

    /*
    
    static async getProfileImage(){
        let profileImg = sessionStorage.getItem('delta-profile-image');
        if(!profileImg){
            var s3obj = await Storage.get("profile-picture.jpg", {level: 'protected'});
            sessionStorage.setItem('delta-profile-image', s3obj);
            return s3obj;
        } else {
            return profileImg;
        }
        
    }*/
    
}