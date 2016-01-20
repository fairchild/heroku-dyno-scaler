MAX_WORKERS = 3

var HerokuClient = require('heroku-client');
var heroku = new HerokuClient({ token: process.env.HEROKU_API_TOKEN });
var app = heroku.apps(process.env.HEROKU_APP_NAME);


exports.parsedSNSmessage = function(event) {
  return JSON.parse(event.Records[0].Sns.Message)
}

exports.formationUpdate = function (desiredState, context) {
  app.formation(desiredState.type)
      .update({quantity: desiredState.quantity}, function(err, data) {
      if (err) {
        console.log('error scaling up', err);
        context.fail
        return err
      }
      console.log('scaled',desiredState.type, data);
      context.succeed(data)
    }
  );
}

exports.handler = function(event, context) {
  console.log(process.env.HEROKU_APP_NAME);
  console.log(JSON.stringify(event));
  var desiredState = exports.parsedSNSmessage(event)
  console.log('desiredState --> ', desiredState);
  app.formation(desiredState.type).info(function(err, data) {
    if (err) {
      console.error('ERROR', err);
      context.fail
      return err;
    }
    console.log('there are currently '+ data.quantity +' '+ desiredState.type);
    if (+data.quantity <= MAX_WORKERS && desiredState.quantity !== +data.quantity) {
      this.formationUpdate(desiredState, context)
    } else {
      console.log('not scaling since there are already max workers or desired quantity reached');
    }
  });
};
