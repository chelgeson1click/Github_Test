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

    const projectField = projectData.fields.nodes.find(
        (field) => field.name === fieldName
    );

    return projectField.id;

}

export const getIssueInfo = async({github, variables}) => {
    
    const getIssueInfoQuery = getGraphQLQuery('getIssueInfo');
    const issueInfoResult = await github.graphql(getIssueInfoQuery, variables);
    console.log(issueInfoResult)

    const issueData = issueInfoResult.repository.issue;
    console.log(issueData)
    const issueProjectItems = issueData.projectItems.nodes;
    console.log(issueProjectItems);
    console.log(issueProjectItems.project);
    console.log(issueProjectItems.fieldValues);


}

export const getProjectInfo = async ({github}) => {

    const getProjectInfoQuery = getGraphQLQuery('getProjectInfo');
    const projectInfoResult = await github.graphql(getProjectInfoQuery);

    const dataBase = getDataBase(projectInfoResult)
    const projectData = dataBase.projectV2;

    const priorityFieldID = getProjectFieldID(projectData, 'Priority')
    const sizeFieldID = getProjectFieldID(projectData, 'Size');
    const departmentFieldID = getProjectFieldID(projectData, 'Department');

    console.log(`Priority Field ID: ${priorityFieldID}`);
    console.log(`Size Field ID: ${sizeFieldID}`);
    console.log(`Department Field ID: ${departmentFieldID}`);

}