const { AuthenticationError, SchemaDirectiveVisitor } = require('apollo-server')
const { defaultFieldResolver, GraphQLString } = require('graphql')
const {formatDate} = require('./utils')

class FormatDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver
    const { format: defaultFormat } = this.args

    field.args.push({
      name: 'format',
      type: GraphQLString
    })

    field.resolve = async (root, { format, ...rest}, ctx, info) => {
      const result = await resolver.call(this, root, rest, ctx, info)
      return formatDate(result, format || defaultFormat)
    }

    field.type = GraphQLString
  }
}

class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver

    field.resolve = (root, args, context, info) => {
      if (!context.user) {
        throw new AuthenticationError('not authenticated user')
      }
      return resolver(root, args, context, info)
    }
  }
}

class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver
    const { role } = this.args

    field.resolve = (root, args, context, info) => {
      if (context.user.role !== role) {
        throw new ApolloError(`user does not have role ${role}`)
      }
      return resolver(root, args, context, info)
    }
  }
}

module.exports = {
  AuthenticationDirective,
  AuthorizationDirective,
  FormatDateDirective
}