module.exports =
{
  'development': {
    'FRONT_URL': 'https://75f59aaa.ngrok.io',
    'API_BASE_URL': 'http://34.211.102.93:8080',
    'SERVER': {
      'port': 8080,
      'host': 'localhost'
    }
  },
  'production': {
    'FRONT_URL': process.env.FRONT_URL || 'https://badgeit-front.now.sh',
    'API_BASE_URL': process.env.API_BASE_URL || 'http://34.211.102.93',
    'SERVER': {
      'port': process.env.PORT || 8080,
      'host': process.env.HOST || 'localhost'
    }
  },
  'test': {
    'FRONT_URL': 'https://localhost:8080',
    'API_BASE_URL': 'http://34.211.102.93:8080',
    'SERVER': {
      'port': 8080,
      'host': 'localhost'
    }
  }
}
