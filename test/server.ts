import fastify from 'fastify'

function build(opts = {}) {
  const app = fastify(opts)
  let count_503 = 1, count_500 = 1, count_400 = 1, count_524 = 1, count_504 = 1

  app.get('/temporary503failure', async function(request, reply) {
    if (count_503 < 2) {
      count_503++;
      return reply.code(503).send()
    }
    return { hello: 'world' }
  })

  app.get('/timeout504failure', async function(request, reply) {
    if (count_504 < 2) {
      count_504++;
      return reply.code(504).send()
    }
    return { hello: 'world' }
  })

  app.get('/timeout524failure', async function(request, reply) {
    if (count_524 < 2) {
      count_524++;
      return reply.code(524).send()
    }
    return { hello: 'world' }
  })

  app.get('/generic500failure', async function(request, reply) {
    if (count_500 < 2) {
      count_500++;
      return reply.code(500).send()
    }
    return { hello: 'world' }
  })

  app.get('/badrequest', async function(request, reply) {
    if (count_400 < 2) {
      count_400++;
      return reply.code(400).send()
    }
    return { hello: 'world' }
  })

  return app
}

const server = build({
  logger: {
    level: 'info',
  }
})

server.listen(3001, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
