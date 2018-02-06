const axios = require('axios');
const graphql = require('graphql');
const {
  GraphQLInt,
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
} = graphql;

const getURI = (userId, limit = 5) =>
  `https://api.instagram.com/v1/users/${userId}/media/recent/?access_token=${
    process.env.ACCESS_TOKEN
  }`;

const ImageDataType = new GraphQLObjectType({
  name: 'ImageDataType',
  fields: {
    width: { type: GraphQLInt },
    height: { type: GraphQLInt },
    url: { type: GraphQLString },
  },
});

const CaptionType = new GraphQLObjectType({
  name: 'CaptionType',
  fields: {
    id: { type: GraphQLString },
    text: { type: GraphQLString },
  },
});

const ImageType = new GraphQLObjectType({
  name: 'ImageType',
  fields: {
    thumbnail: { type: ImageDataType },
    low_resolution: { type: ImageDataType },
    standard_resolution: { type: ImageDataType },
  },
});

const FeedType = new GraphQLObjectType({
  name: 'PhotoType',
  fields: {
    id: { type: GraphQLString },
    images: { type: ImageType },
    caption: { type: CaptionType },
    created_time: { type: GraphQLString },
    likes: {
      type: GraphQLInt,
      resolve(parentValue) {
        return parentValue.likes.count;
      },
    },
    link: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    photoList: {
      type: new GraphQLList(FeedType),
      args: { userId: { type: GraphQLString } },
      resolve(parentValue, { userId }) {
        const uri = getURI(userId || 'self');
        return axios
          .get(uri)
          .then(({ data }) => {
            if (data.data.length) {
              console.log('data', data);
              return data.data.slice(0, 6);
            }
          })
          .catch(err => {
            throw err;
          });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
