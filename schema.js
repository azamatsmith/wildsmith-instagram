const axios = require('axios');
const graphql = require('graphql');
const {
  GraphQLInt,
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
} = graphql;

const API_URI = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${
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
      resolve(parentValue, args, req) {
        return axios.get(API_URI).then(({ data }) => {
          return data.data;
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
