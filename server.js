const express = require('express');
const https = require('https');
const cors = require('cors');
const bodyParser = require('body-parser');
const aws = require("aws-sdk");
const {errorTypeFromData, errorTypeFromDataAndroid, errorTypeFromDataDevOps} = require("./api/errorType/errorTypeFromData");
const {platformFromData} = require("./api/platform/platformFromData");

const docClient = new aws.DynamoDB.DocumentClient({ region: 'ap-northeast-2' });

const corsOptions = {
    origin: '*',
    credentials: true
}

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());

aws.config.update ({
    region: 'ap-northeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

app.post('/errorTypeDataFromWeb', (req, res) => {
    https.get('https://czwpwf5o4m.execute-api.ap-northeast-2.amazonaws.com/stage/error/write', (response) => {

        errorTypeFromData(req, res, response);

    }).on('error', (error) => {
        console.error(error);
    })
})

app.post('/errorTypeDataFromAndroid', (req, res) => {
    https.get('https://czwpwf5o4m.execute-api.ap-northeast-2.amazonaws.com/stage/error/write', (response) => {

        errorTypeFromDataAndroid(req, res, response);

    }).on('error', (error) => {
        console.error(error);
    })
})

app.post('/errorTypeDataFromDevOps', (req, res) => {
    https.get('https://czwpwf5o4m.execute-api.ap-northeast-2.amazonaws.com/stage/error/write', (response) => {

        errorTypeFromDataDevOps(req, res, response);

    }).on('error', (error) => {
        console.error(error);
    })
})

app.post('/platformData', (req, res) => {
    https.get('https://czwpwf5o4m.execute-api.ap-northeast-2.amazonaws.com/stage/error/write', (response) => {

        platformFromData(req, res, response);

    }).on('error', (error) => {
        console.error(error);
    })
})

app.post('/errorBoardData', (req, res) => {

    const body = req.body;

    console.log(body);

    const params = {
        TableName: 'errorBoard',
        Item: body
    };

    docClient.put(params, (err, data) => {
        if (err) {
            console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            console.log('Added item:', JSON.stringify(data, null, 2));
            res.json(body);
        }
    });
})

app.post('/errorBoardData/detail/auth', (req, res) => {
    const body = req.body;

    const params = {
        TableName: 'errorBoard',
    }

    docClient.scan(params, (err, data) => {
        if (err) {
            console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            const filteringErrorBoardData = data.Items.filter(item => item.authuid === body.authuid);
            res.json(filteringErrorBoardData);
        }
    });
});

app.post('/errorBoardData/delete', (req, res) => {
    const body = req.body;

    console.log(body.uid);

    const params = {
        TableName: 'errorBoard',
        Key: {
            errorFile: body.errorFile,
            errorType: body.errorType,
        }
    };

    docClient.delete(params, (err, data) => {
        if (err) {
            console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            console.log('Added item:', JSON.stringify(data, null, 2));
            res.json(body);
        }
    });
})

app.post('/userData', (req, res) => {

    const body = req.body;

    console.log(body);

    const params = {
        TableName: 'ERRORUSER',
        Item: body
    }

    docClient.put(params, (err, data) => {
        if (err) {
            console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            console.log('Added Item:', JSON.stringify(data, null, 2));
            res.json(body);
        }
    });
})

app.post('/userData/detail', (req, res) => {

    const authuid = req.body.id;

    const params = {
        TableName: 'ERRORUSER',
        Key: {
            'id': authuid
        }
    }

    docClient.get(params, (err, data) => {
        if (err) {
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            res.json(data.Item);
        }
    });
})

app.post('/userData/update', (req, res) => {
    
    const authuid = req.body.authuid;
    const nickname = req.body.nickname;

    console.log(authuid);
    console.log(nickname);
})

app.post('/errorHelpingData', (req, res) => {
    const body = req.body;

    const params = {
        TableName: 'HELPING',
        Item: body
    }

    docClient.put(params, (err, data) => {
        if (err) {
            console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            console.log('Added Item:', JSON.stringify(data, null, 2));
            res.json(body);
        }
    })
}) 

app.post('/commentData', (req, res) => {
    const body = req.body;

    const params = {
        TableName: 'Comment',
        Item: body
    }

    docClient.put(params, (err, data) => {
        if (err) {
            console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            console.log('Added Item:', JSON.stringify(data, null, 2));
            res.json(body);
        }
    })
})

app.post('/errorHelpingData/get', (req, res) => {
    
    const params = {
        TableName: 'HELPING',
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            res.json(data.Items);
        }
    });
})

app.post('/commentData/get', (req, res) => {

    console.log(req.body.uid);

    const params = {
        TableName: 'Comment'
    };
    
    docClient.scan(params, (err, data) => {
        if (err) {
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            const filteringCommentDataFromAuth = data.Items.filter(item => item.authid === req.body.uid);
            const filteringCommentDataFromType = filteringCommentDataFromAuth.filter(item => item.type === req.body.type);

            res.json(filteringCommentDataFromType);
        }
    });
})

app.get('/detail', (req, res) => {
    const { author, uid, type, profile, content, situation, date } = req.query;

    res.json({
        author,
        uid,
        type,
        profile,
        content,
        situation,
        date
    });
});

app.get('/errorBoardData/get/status', (req, res) => {
    const params = {
        TableName: 'errorBoard',
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            const filteringStatusData = data.Items.filter(item => item.errorStatus === '진행 중');
            res.json(filteringStatusData);
        }
    })
})

app.get('/errorBoardData/get/web', (req, res) => {

    const params = {
        TableName: 'errorBoard',
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            const filteringWebTypeData = data.Items.filter(item => item.selectedPlatformData === '웹');
            res.json(filteringWebTypeData);
        }
    });
});

app.get('/errorFind/avg/android', (req, res) => {

    const params = {
        TableName: 'errorBoard'
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            const filteringSelectedPlatformAtAndroidData = data.Items.filter(item => item.selectedPlatformData === '안드로이드').length;
            res.json(filteringSelectedPlatformAtAndroidData)
        }
    })
})

app.get('/errorFind/avg/devops', (req, res) => {

    const params = {
        TableName: 'errorBoard'
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            const filteringSelectedPlatformAtDevopsData = data.Items.filter(item => item.selectedPlatformData === 'DevOps').length;
            res.json(filteringSelectedPlatformAtDevopsData)
        }
    })
})

app.get('/errorFind/avg/web', (req, res) => {

    const params = {
        TableName: 'errorBoard',
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            const filteringSelectedPlatformAtWebData = data.Items.filter(item => item.selectedPlatform === '웹').length;
            console.log(filteringSelectedPlatformAtWebData);
            res.json(filteringSelectedPlatformAtWebData)
        }
    })
})

app.get('/errorBoardData/get', (req, res) => {

    const params = {
        TableName: 'errorBoard',
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            res.json(data.Items);
        }
    });
})

app.post('/errorBoardData/update', (req, res) => {

    const authuid = req.body.authuid;
    const author = req.body.nickname;

    const params = {
        TableName: 'errorBoard',
        Key: {
            'id': authuid
        },
        UpdateExpression: 'set #author = :author',
        ExpressionAttributeNames: {
            '#author': 'author'
        },
        ExpressionAttributeValues: {
            ':author': author,
        }
    };

    docClient.update(params, (err, data) => {
        if (err) {
            console.error('Unable to update item. Error:', JSON.stringify(err, null, 2));
        } else {
            console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2));
        }
    })
})

app.post('/profile/boardData/count', (req, res) => {

    const authuid = req.body.authuid;
    
    const params = {
        TableName: 'errorBoard',
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            res.status(500).send('Error saving data to DynamoDB');
        } else {
            res.json(data.Items.filter(item => item.authUid === authuid).length);
        }
    });
})

app.listen(50000, () => {
    console.log('연결 완료')
})
