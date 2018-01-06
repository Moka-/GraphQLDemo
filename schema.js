const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// Post Type
const PostType = new GraphQLObjectType({
    name:'Post',
    fields:() => ({
        id: {type:GraphQLString},
        title: {type: GraphQLString},
        author: {type: GraphQLString}
    })
});

// Root Query
const RootQuery= new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        post:{
            type:PostType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/posts/'+ args.id)
                    .then(res => res.data);
            }
        },
        posts:{
            type: new GraphQLList(PostType),
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/posts')
                    .then(res => res.data);
            }
        }
    }
});

// Mutations
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addPost:{
            type:PostType,
            args:{
                title: {type: new GraphQLNonNull(GraphQLString)},
                author: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/posts', {
                    title:args.title,
                    author: args.author
                })
                .then(res => res.data);
            }
        },
        deletePost:{
            type:PostType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/posts/'+args.id)
                .then(res => res.data);
            }
        },
        editPost:{
            type:PostType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                title: {type: GraphQLString},
                author: {type: GraphQLString}
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/posts/'+args.id, args)
                .then(res => res.data);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});