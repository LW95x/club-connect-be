import fs  from "fs/promises";

export const findApi = () => {
    return fs.readFile(`${__dirname}/../../endpoints.json`, 'utf-8')
    .then((data) => {
        const parsedEndpoints = JSON.parse(data);
        return parsedEndpoints;
    })
}