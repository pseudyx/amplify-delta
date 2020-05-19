import Amplify, { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Clock from '../Clock';

export default class ProfileSvc {

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