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

    static async updateProfilePic(file, progressCallback){
        try{
            var result = await Storage.put('profile-lg.jpg', file, {
                level: 'protected',
                contentType: file.type,
                progressCallback: progressCallback
            })   
            return result;
        } catch (error){
            throw new Error(error);
        }
    }

    static async userSession() {
        try {
            //TODO: add create profile on initial sign in.
            const session = JSON.parse(sessionStorage.getItem('deltaUserSession'));

            if(!session) {
                var cognitoSession = await Auth.currentSession();
                var payload = cognitoSession.idToken.decodePayload();
                var groups = payload["cognito:groups"];
                var userId = payload["cognito:username"];
                var profileLink = payload.profile
                
                var res = await UserSvc.getProfile(userId);
                res = (res.data.getProfile) ? res : await this.createProfile(userId, payload.name);
                var profile = (res.data.getProfile) ? res.data.getProfile : res.data.createProfile;
                profile.profile = profileLink;
                if (groups) profile.groups = groups;

                sessionStorage.setItem('deltaUserSession', JSON.stringify(profile));

                return profile;
            } else {
                return session;
            }

           
          }
          catch(e) {
            throw new Error(e)
          }
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

    static async confirmUser(userConfirm) {
            return Auth.confirmSignUp(userConfirm.username, userConfirm.code);
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