module.exports =
{
  'development': {
    'FRONT_URL': 'https://70474dd3.ngrok.io',
    'API_BASE_URL': 'http://34.211.102.93',
    'REDIS': {
      'port': 6379,
      'host': '127.0.0.1'
    },
    'SERVER': {
      'port': 8080,
      'host': 'localhost'
    }
  },
  'production': {
    'FRONT_URL': 'https://badgeit-front.now.sh',
    'API_BASE_URL': 'http://34.211.102.93',
    'REDIS': {
      'port': 6379,
      'host': '127.0.0.1'
    },
    'SERVER': {
      'port': 8080,
      'host': 'localhost'
    }
  }
}
