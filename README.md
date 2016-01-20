Simple AWS lambda function to help scale heroku dynos.
The function receives SNS published events that contain a json
message specifying the dyno type and desired quantity.

    {type: 'worker', quantity: 1}

This can be published from the rails app, or anywhere else that knows a worker will be needed.

To develop:

    npm install
    node-lamba run

`node-lambda run` will use the event.json as sample input to the lambda function and
run it locally.

To deploy, copy the `deploy.env.example` file to `deploy.env` and update its contents
to match your needs and then

    `node-lambda deploy`

This will zip up the directory, including node_modules, upload the zip to AWS and make the deploy.env variables available on `process.env`
