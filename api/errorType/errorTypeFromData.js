
function errorTypeFromData (req, res, response) {
    let data = '';

    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('end', () => {

        const jsonData = JSON.parse(data);

        const jsonErrorTypeDataS = jsonData.data.selectedPlatform.web.map((error) => error.error);

        res.send(jsonErrorTypeDataS);
    })
}

function errorTypeFromDataAndroid (req, res, response) {
    let data = ''

    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('end', () => {
        
        const jsonData = JSON.parse(data);

        const jsonErrorTypeDataS = jsonData.data.selectedPlatform.android.map((error) => error.error);

        res.send(jsonErrorTypeDataS);
    });
}

function errorTypeFromDataDevOps (req, res, response) {
    let data = ''

    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('end', () => {
        
        const jsonData = JSON.parse(data);

        const jsonErrorTypeDataS = jsonData.data.selectedPlatform.devops.map((error) => error.error);

        res.send(jsonErrorTypeDataS);
    });
}

module.exports = {
    errorTypeFromData: errorTypeFromData,
    errorTypeFromDataAndroid: errorTypeFromDataAndroid,
    errorTypeFromDataDevOps: errorTypeFromDataDevOps
};
