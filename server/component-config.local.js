'use strict'
const config = require('config')

const components = {}

const nodeEnv = config.util.getEnv('NODE_ENV')

if (nodeEnv !== 'codegen') {
  const log = (...msg) => console.log('[component-config]', ...msg)
  log('url:', config.get('api.components'))
  if (config.has('api.components.rabbitmq') &&
      config.has('api.components.rabbitmq.uri') &&
      config.has('api.components.rabbitmq.restPort') &&
      config.has('api.components.rabbitmq.timeout')) {
    log('Component Config: Using RabbitMQ config:', config.get('api.components.rabbitmq'))
    log('url:', config.get('api.components.rabbitmq.uri'))

    components['loopback-component-mq'] = {
      'path': 'loopback-component-mq',
      'options': {
        'restPort': config.get('api.components.rabbitmq.restPort'),
        'acls': [{
          'accessType': '*',
          'principalType': 'ROLE',
          'principalId': '$unauthenticated',
          'permission': 'DENY',
        }],
      },
      'topology': {
        'connection': {
          'uri': config.get('api.components.rabbitmq.uri'),
          'timeout': parseInt(config.get('api.components.rabbitmq.timeout')),
        },
        'exchanges': [
          {
            'name': 'notification',
            'type': 'topic',
            'persistent': true,
          },
          {
            'name': 'lbseed',
            'type': 'topic',
            'persistent': true,
          },
        ],
        'queues': [
          {
            'name': 'notification::log',
            'subscribe': false,
          },
          {
            'name': 'lbseed::error',
            'subscribe': false,
          },
        ],
        'bindings': [
          {
            'exchange': 'notification',
            'target': 'notification::log',
            'keys': [
              'notification::log',
            ],
          },
          {
            'exchange': 'lbseed',
            'target': 'lbseed::error',
            'keys': [
              'lbseed::error',
            ],
          },
        ],
      },
    }
  }

  module.exports = components
}
