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

export const handler = (event, ctx, callback) => {
  try {
    console.log(event)
    if (event['type'] != 'TOKEN'){
      console.log(event)
      callback(`Unauthorized. Wrong type. ${JSON.stringify(event)}`);
    }
    const encodedCreds = event.authorizationToken.split(' ')[1];
    const [username, password] = Buffer.from(encodedCreds, 'base64').toString('utf-8').split(':');

    console.log(`username: ${username} password: ${password}`);

    const storedUserPassword = process.env[username];
    const isAccessAllowed = storedUserPassword && storedUserPassword === password;
    callback(null, generatePolicy(encodedCreds, event.methodArn, isAccessAllowed));
  } catch(e) {
    console.log(e)
    callback(`Unauthorized. Error. ${JSON.stringify(e)}`);
  }
};
