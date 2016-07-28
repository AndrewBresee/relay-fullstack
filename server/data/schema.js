/* eslint-disable no-unused-vars, no-use-before-define */
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions
} from 'graphql-relay';

import {
  User,
  Feature,
  getUser,
  getFeature,
  getFeatures,
  getGoogleUser,
  GoogleUser
} from './database';

// Will need GoogleUsers GraphQLObjectType
// fields will be (fist name, last name, email, and profile photo)
// This should reflect the data stored in the database
// Need App, which will contain the lists of all the users
// the feilds will be be GraphQLList(GoogleUsers)
// Will then need to make a GraphQLSchema
// this will be a Query, - and resolve to the database (??)


/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  // this is the specific node interface. Finds a Node based on an ID
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Feature') {
      return getFeature(id);
    } else if (type === 'GoogleUser') {
      // this call is returning the specific node based on the id
      return getGoogleUser(id);
    }
    return null;
  },
  // this returns a field, which specifies what data the node will return
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Feature) {
      return featureType;
    } else if (obj instanceof GoogleUser) {
      return GoogleUserType;
    }
    return null;
  }
);

/**
 * Define your own types here
 */

const GoogleUserType = new GraphQLObjectType({
  name: 'GoogleUser',
  fields: () => ({
    // unsure of this id/what to put in for globalIdField
    // removed globalIdField, because the id is already set
    id: globalIdField('GoogleUser'),
    user: { type: GraphQLInt },
    givenName: { type: GraphQLString },
    familyName: { type: GraphQLString }
  }),
  interfaces: [nodeInterface]
});

// In this case there are two data stores. Features and Users
// This is the stucture for what the query will return
// In this case the fields include (id, features, username, and website)
const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    features: {
      type: featureConnection,
      description: 'Features that I have',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getFeatures(), args)
    },
    username: {
      type: GraphQLString,
      description: 'Users\'s username'
    },
    website: {
      type: GraphQLString,
      description: 'User\'s website'
    }
  }),
  interfaces: [nodeInterface]
});

const featureType = new GraphQLObjectType({
  name: 'Feature',
  description: 'Feature integrated in our starter kit',
  fields: () => ({
    id: globalIdField('Feature'),
    name: {
      type: GraphQLString,
      description: 'Name of the feature'
    },
    description: {
      type: GraphQLString,
      description: 'Description of the feature'
    },
    url: {
      type: GraphQLString,
      description: 'Url of the feature'
    }
  }),
  interfaces: [nodeInterface]
});

/**
 * Define your own connection types here
 */
const { connectionType: featureConnection } = connectionDefinitions({ name: 'Feature', nodeType: featureType });
const { connectionType: appConnection } = connectionDefinitions({ name: 'App', nodeType: GoogleUserType });

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: GoogleUserType,
      resolve: () => getGoogleUser('109317027548384374583')
    }
  })
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export default new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
