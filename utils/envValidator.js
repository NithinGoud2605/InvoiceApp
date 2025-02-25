const requiredVars = [
    'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST',
    'SESSION_KEY', 'CLIENT_ORIGIN'
  ];
  
  const validateEnvironment = () => {
    const missing = requiredVars.filter(variable => !process.env[variable]);
    
    if (missing.length > 0) {
      console.error('Missing environment variables:', missing.join(', '));
      process.exit(1);
    }
  };
  
  module.exports = validateEnvironment;