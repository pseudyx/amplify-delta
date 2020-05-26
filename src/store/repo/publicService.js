import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Clock from '../Clock';

export default class AdminSvc {
    static async createContactMessage(contact){
        return API.graphql(graphqlOperation(mutations.createContact, {input: {name: contact.name, email: contact.email, comment: contact.message}}));
    }
}