const fs = require('fs');
const path = require('path');

const getGraphQLQuery = ( queryName ) => {

    const queryPath = path.join(__dirname, `${queryName}.graphql`);
    const query = fs.readFileSync(queryPath, 'utf8');

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

    const dataBase = getDataBase(projectData)

    const priorityFieldID = getProjectVariableID(projectInfoResult, 'Priority')
    const sizeFieldID = getProjectVariableID(projectInfoResult, 'Size');
    const departmentFieldID = getProjectVariableID(projectInfoResult, 'Department');

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