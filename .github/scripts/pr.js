import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const getGraphQLQuery = ( queryName ) => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const queryPath = path.join(__dirname, '..', 'schema', `${queryName}.graphql`);
    console.log(queryPath)
    const query = readFileSync(queryPath, 'utf8');

    return query;

}

const getDataBase = (resultJSON) => {

    if (resultJSON.user !== undefined) {

        return resultJSON.user;

    } else {

        return resultJSON.organization;

    }

}

const getProjectFieldID = (projectData, fieldName) => {

    const projectVarID = projectData.fields.nodes.find(
        (field) => field.name === fieldName
    );

    return projectVarID;

}

export const getProjectInfo = async ({github}) => {

    const getProjectInfoQuery = getGraphQLQuery('getProjectInfo');
    const projectInfoResult = await github.graphql(getProjectInfoQuery);

    const dataBase = getDataBase(projectInfoResult)

    const priorityFieldID = getProjectFieldID(projectInfoResult, 'Priority')
    const sizeFieldID = getProjectFieldID(projectInfoResult, 'Size');
    const departmentFieldID = getProjectFieldID(projectInfoResult, 'Department');

    console.log(priorityFieldID);
    console.log(sizeFieldID);
    console.log(departmentFieldID);

}



/*export const extractPrimaryIssue = async ( resourcesBody, { github, resources } ) => {

    const match = text.match(/#(\d+)/);
    console.log(`Issue: ${match[1]}`)

    const getProjectInfoQuery = getGraphQLQuery('getProjectInfo');
    const projectInfoResult = await github.graphql(getProjectInfoQuery);

    const getIssueInfoVariables = {
        issueNumber: parseInt(match[1])
    }

    const getIssueInfoQuery = getGraphQLQuery('getIssueInfo');
    const issueInfoResult = await github.graphql(getIssueInfoQuery, getIssueInfoVariables);
    
    console.log(issueInfoResult);
    console.log(projectInfoResult)

} */