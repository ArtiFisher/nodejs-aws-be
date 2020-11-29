const generatePolicy = (principalId, resource, isAccessAllowed) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: isAccessAllowed ? 'Allow' : 'Deny',
        Resource: resource,
      }
    ]
  }
});

export const handler = async event => {
  try {
    if (event['type'] != 'TOKEN'){
      console.log(event)
      return `Unauthorized. ${JSON.stringify(event)}`;
    }
    const encodedCreds = event.authorizationToken.split(' ')[1];
    const [username, password] = Buffer.from(encodedCreds, 'base64').toString('utf-8').split(':');

    console.log(`username: ${username} password: ${password}`);

    const storedUserPassword = process.env[username];
    const isAccessAllowed = storedUserPassword && storedUserPassword === password;
    return generatePolicy(encodedCreds, event.methodArn, isAccessAllowed);
  } catch(e) {
    console.log(e)
    return `Unauthorized. ${JSON.stringify(e)}`;
  }
};
