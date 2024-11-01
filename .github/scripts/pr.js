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

export const getIssueItemID = async({github, issueItemIDVariables}) => {
    
    const getIssueInfoQuery = getGraphQLQuery('getIssueInfo');
    const issueInfoResult = await github.graphql(getIssueInfoQuery, issueItemIDVariables);

    const issueData = issueInfoResult.repository.issue;
    const issueProjectItems = issueData.projectItems.nodes;
    const issueCurrentProjectItem = issueProjectItems.find(
        (projectItem) => projectItem.project.number === 2
    )

    console.log(`Issue Project Item ID: ${issueCurrentProjectItem.id}`);

    return issueCurrentProjectItem.id;

}

export const addItemToProject = async({github}, vars) => {

    const addItemToProjectQuery = getGraphQLQuery('addIssueToProject');
    const addItemToProjectResult = await github.graphql(addItemToProjectQuery, vars);

    console.log(addItemToProjectResult)

}

export const getProjectFieldIDs = async({github}) => {

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

    return { priorityFieldID, sizeFieldID, departmentFieldID };

}