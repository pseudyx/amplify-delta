/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
      id
      title
      description
      status
      createdAt
      author
      comments {
        items {
          id
          content
          createdAt
          author
          updatedAt
          owner
        }
        nextToken
      }
      updatedAt
    }
  }
`;
export const listTasks = /* GraphQL */ `
  query ListTasks(
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        status
        createdAt
        author
        comments {
          nextToken
        }
        updatedAt
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      content
      createdAt
      author
      task {
        id
        title
        description
        status
        createdAt
        author
        comments {
          nextToken
        }
        updatedAt
      }
      updatedAt
      owner
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        content
        createdAt
        author
        task {
          id
          title
          description
          status
          createdAt
          author
          updatedAt
        }
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getProfile = /* GraphQL */ `
  query GetProfile($userId: ID!) {
    getProfile(userId: $userId) {
      userId
      name
      role
      company
      confirmed
      joined
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listProfiles = /* GraphQL */ `
  query ListProfiles(
    $userId: ID
    $filter: ModelProfileFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listProfiles(
      userId: $userId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        userId
        name
        role
        company
        confirmed
        joined
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
