/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask {
    onCreateTask {
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
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask {
    onUpdateTask {
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
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask {
    onDeleteTask {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($owner: String!) {
    onDeleteComment(owner: $owner) {
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
export const onCreateProfile = /* GraphQL */ `
  subscription OnCreateProfile($owner: String) {
    onCreateProfile(owner: $owner) {
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
export const onUpdateProfile = /* GraphQL */ `
  subscription OnUpdateProfile($owner: String) {
    onUpdateProfile(owner: $owner) {
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
export const onDeleteProfile = /* GraphQL */ `
  subscription OnDeleteProfile($owner: String!) {
    onDeleteProfile(owner: $owner) {
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
