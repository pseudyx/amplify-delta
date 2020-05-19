import { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Clock from '../Clock';

export default class TaskSvc {

    static async getTask(taskId){
            return API.graphql(graphqlOperation(queries.getTask, {id: taskId}));
    }

    static async listTasks(limit, nextToken){
        return API.graphql(graphqlOperation(queries.listTasks, {limit, nextToken}));
    }
    
    static async createTask(task){
        var created = Clock.isoTimestamp();
        return API.graphql(graphqlOperation(mutations.createTask, {input: {title: task.title, description: task.description, status: task.status, createdAt: created, author: task.author}}));
    }

    static async updateTask(taskId, task){
        return API.graphql(graphqlOperation(mutations.updateTask, {input: {id: taskId ,title: task.title, description: task.description, status: task.status}}));
    }

    static async updateTaskStatus(taskId, status){
        return API.graphql(graphqlOperation(mutations.updateTask, {input: {id: taskId, status: status}}));
    }

    static async createComment(taskId, comment){
        var created = Clock.isoTimestamp();
        return API.graphql(graphqlOperation(mutations.createComment, {input: {content: comment.content, author: comment.author, created: created, commentTaskId: taskId}}));
    }
    

}