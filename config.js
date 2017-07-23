module.exports =
{
  'development': {
    'FRONT_URL': 'https://6f18e775.ngrok.io',
    'API_BASE_URL': 'http://34.211.102.93',
    'REDIS': {
      'port': 6379,
      'host': '34.211.102.93'
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
      'host': '34.211.102.93'
    },
    'SERVER': {
      'port': 8080,
      'host': 'localhost'
    }
  }
}
