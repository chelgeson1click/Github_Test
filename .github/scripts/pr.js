import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const getGraphQLQuery = ( queryName ) => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const queryPath = path.join(__dirname, '..', 'schema', `${queryName}.graphql`);
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

export const getIssueItemInfo = async({github}, queryVars) => {
    
    const getIssueInfoQuery = getGraphQLQuery('getIssueInfo');
    const issueInfoResult = await github.graphql(getIssueInfoQuery, queryVars);

    const issueData = issueInfoResult.repository.issue;
    const issueProjectItems = issueData.projectItems.nodes;
    const issueCurrentProjectItem = issueProjectItems.find(
        (projectItem) => projectItem.project.number === 2
    )

    const issueProjectID = issueCurrentProjectItem.id;
    const priorityOptionID = issueCurrentProjectItem.priorityField.optionId;
    const sizeOptionID = issueCurrentProjectItem.sizeField.optionId;
    const departmentOptionID = issueCurrentProjectItem.departmentField.optionId;

    console.log(`Issue Project Item ID: ${issueProjectID}`);
    console.log(`Issue Priority Option: ${priorityOptionID}`);
    console.log(`Issue Size Option: ${sizeOptionID}`)
    console.log(`Issue Department Option: ${departmentOptionID}`);

    return { issueProjectID, priorityOptionID, sizeOptionID, departmentOptionID };

}

export const addItemToProject = async({github}, vars) => {

    const addItemToProjectQuery = getGraphQLQuery('addIssueToProject');
    const addItemToProjectResult = await github.graphql(addItemToProjectQuery, vars);

    return addItemToProjectResult.addProjectV2ItemById.item.id;

}

export const getProjectFieldIDs = async({github}) => {

    const getProjectInfoQuery = getGraphQLQuery('getProjectInfo');
    const projectInfoResult = await github.graphql(getProjectInfoQuery);

    const dataBase = getDataBase(projectInfoResult)
    const projectData = dataBase.projectV2;

    const projectID = projectData.id;
    const priorityFieldID = getProjectFieldID(projectData, 'Priority')
    const sizeFieldID = getProjectFieldID(projectData, 'Size');
    const departmentFieldID = getProjectFieldID(projectData, 'Department');

    console.log(`Project ID: ${projectID}`);
    console.log(`Priority Field ID: ${priorityFieldID}`);
    console.log(`Size Field ID: ${sizeFieldID}`);
    console.log(`Department Field ID: ${departmentFieldID}`);

    return { projectID, priorityFieldID, sizeFieldID, departmentFieldID };

}