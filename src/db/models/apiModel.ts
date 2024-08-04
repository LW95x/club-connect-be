import fs  from "fs/promises";

export const findApi = () => {
    const filePath = `${__dirname}/../../endpoints.json`;
    console.log('Attempting to read file at path:', filePath);
    return fs.readFile(`${__dirname}/../../endpoints.json`, 'utf-8')
    .then((data) => {
        const parsedEndpoints = JSON.parse(data);
        return parsedEndpoints;
    })
}

/home/lw95/ts-events-platform/src/endpoints.json