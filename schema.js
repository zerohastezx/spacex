const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");

//Launch
const LaunchType = new GraphQLObjectType({
  name: "Launch",
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    launch_success: { type: GraphQLBoolean },
    rocket: { type: RocketType },
  }),
});

//Rocket
const RocketType = new GraphQLObjectType({
  name: "Rocket",
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString },
  }),
});

//RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parent, args) {
        return axios
          .get("https://api.spacexdata.com/v3/launches")
          .then((rest) => rest.data);
      },
    },
    launch: {
      type: LaunchType,
      args: {
        flight_number: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return axios
          .get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
          .then((res) => res.data);
      },
    },
    rockets: {
      type: new GraphQLList(RocketType),
      resolve(parent, args) {
        return axios
          .get("https://api.spacexdata.com/v3/rockets")
          .then((rest) => rest.data);
      },
    },
    rocket: {
      type: RocketType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        return axios
          .get(`https://api.spacexdata.com/v3/rockets/${args.id}`)
          .then((res) => res.data);
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
