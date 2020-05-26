import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Clock from '../Clock';

export default class AdminSvc {

    static async legionList(limit, nextToken){
        let apiName = 'AdminQueries';
        let path = '/listUsersInGroup';
        let myInit = { 
            queryStringParameters: {
                "groupname": "legion",
                "limit": limit,
                "token": nextToken
            },
            headers: {
                'Content-Type' : 'application/json',
                Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
            }
        }
        return API.get(apiName, path, myInit);
    }

    static async userList(limit, nextToken){
        let apiName = 'AdminQueries';
        let path = '/listUsers';
        let myInit = { 
            queryStringParameters: {
              "limit": limit,
              "token": nextToken
            },
            headers: {
              'Content-Type' : 'application/json',
              Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
            }
        }
        return API.get(apiName, path, myInit);
    }

    static async usersInGroup(group, limit, nextToken){
        let apiName = 'AdminQueries';
        let path = '/listUsersInGroup';
        let myInit = { 
            queryStringParameters: {
                "groupname": group,
                "limit": limit,
                "token": nextToken
            },
            headers: {
                'Content-Type' : 'application/json',
                Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
            }
        }
        return API.get(apiName, path, myInit);
    }

    static async addUserToGroup(username, group){
        let apiName = 'AdminQueries';
        let path = '/addUserToGroup';
        let myInit = {
            body: {
                "username" : username,
                "groupname": group
            }, 
            headers: {
                'Content-Type' : 'application/json',
                Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
            } 
        }
        return await API.post(apiName, path, myInit);
    }

    static async removeUserFromGroup(username, group){
        let apiName = 'AdminQueries';
        let path = '/removeUserFromGroup';
        let myInit = {
            body: {
                "username" : username,
                "groupname": group
            }, 
            headers: {
                'Content-Type' : 'application/json',
                Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
            } 
        }
        return await API.post(apiName, path, myInit);
    }

}