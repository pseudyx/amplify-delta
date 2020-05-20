import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Clock from '../Clock';

export default class UserSvc {

    static async login(email, password){
        return Auth.signIn(email, password);
    }

    static async logout(){
        return Auth.signOut();
    }

    static async newPassword(user, password){
        return Auth.completeNewPassword(
            user,          // the Cognito User Object
            password       // the new password
        );
    }

    static async getProfile(userId){
            return API.graphql(graphqlOperation(queries.getProfile, {userId}));
    }

    static async listProfiles(limit, nextToken){
        return API.graphql(graphqlOperation(queries.listProfiles, {limit, nextToken}))
    }

    static async updateProfile(userId, profile){
        return API.graphql(graphqlOperation(mutations.updateProfile, 
            {
                input: 
                {
                    userId: userId, 
                    name: profile.name, 
                    role: profile.role, 
                    company: profile.company
                }
            }));
    }

    static async userSession() {
        try {
            var userSession = await Auth.currentSession();
            var payload = userSession.accessToken.decodePayload();
            var groups = payload["cognito:groups"];
            var userId = payload.username;
            
            var res = await UserSvc.getProfile(userId);
            var profile = res.data.getProfile;
            profile.groups = groups;
            return profile;
          }
          catch(e) {
            throw new Error(e)
          }
    }

    /*
    static async createProfile(userId, name){
        var joined = Clock.isoTimestamp();
        return API.graphql(graphqlOperation(mutations.createProfile, {input: {userId: userId, name: name, joined: joined}}));
    }
    

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