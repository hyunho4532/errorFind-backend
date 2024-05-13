function platformFromData(req, res, response) {
    let data = '';

    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('end', () => {

        const jsonData = JSON.parse(data);

        const jsonErrorTypeDataS = jsonData.data.platform.map((title) => title.title);

        console.log(jsonErrorTypeDataS);

        res.send(jsonErrorTypeDataS);
    })
}

module.exports = {
    platformFromData: platformFromData
}