exports.handler = (event, context, callback) => {
  const {identity, user} = context.clientContext;

  console.log(identity);
  console.log(user);

  var data = {
    "x-hasura-user-id": user.sub,
    "x-hasura-role": "user",
  }

  console.log(data);

  callback(null, {
    body: JSON.stringify(data)
  });
};
