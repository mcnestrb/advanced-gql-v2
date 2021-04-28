const gql = require('graphql-tag')
const createTestServer = require('./helper')
const CREATE_POST = gql`
  mutation {
    createPost(input: {message: "hello"}) {
      message
    }
  }
`

describe('mutations', () => {
  test('createPost', async () => {
    const {mutate} = createTestServer({
      user: {id: 2},
      models: {
        Post: {
          createOne: jest.fn(() => ({id: 1, message: 'hello', createdAt: 12345839, likes: 20, views: 300, author: 2}))
        }
      }
    })

    const res = await mutate({query: CREATE_POST})
    expect(res).toMatchSnapshot()
  })
})