# Run a GraphQL Query from the command line.
runGraphQLQuery() {

  # Name of the GraphQL Query
  local graphqlFileName=$1
  # Name of the file to output the query's results.
  local queryOutput=$2

  # Command that calls the GraphQL query from the text file.
  queryPrefix="gh api graphql -f query=\"\$(cat ./.github/schema/\${graphqlFileName}.graphql)\""
  queryCommand=""

  # Search GraphQL file for line that contains query() call.
  queryLine=$(grep -m 1 '^query' ./.github/schema/${graphqlFileName}.graphql)
  echo $queryLine

  # Search for GraphQL variables and extract the variable names.
  # When there are none, ensure the grep process does not exit 
  # with an error code.
  vars=$(echo ${queryLine} | grep -oP -e '(?<=\$)\w*(?=\:)' || true)

  echo "test"

  # When variables exist, construct the command that
  # applies the arguments to our query.
  if [ -n "$vars" ]; then
    echo "Variables found"

    echo "${vars[*]}"

    i=3

    queryArgString=""

    for var in $vars; do
      queryArgString="${queryArgString} -f ${var}=\$${i}"
      ((i++))
    done

    echo $queryArgString

    queryCommand="${queryPrefix} ${queryArgString} > ${queryOutput}"
  else
    echo "No variables needed in this query."
    queryCommand="${queryPrefix} ${queryArgString} > ${queryOutput}"
  fi

  echo $queryCommand

  eval $queryCommand

}


getProjectID() {
  echo 'PROJECT_ID='$(jq '.data.user.projectV2.id' project_data.json) >> $GITHUB_ENV
}

# Get a Project's unique identifier from a json file.
getProjectVariableID() {
  local envVarName=$1
  local fieldVarName=$2
  local field_id=$(jq ".data.user.projectV2.fields.nodes[] | select(.name==\"${fieldVarName}\") | .id" project_data.json)
  echo "${envVarName}=${field_id}" >> $GITHUB_ENV
}

getProjectFieldOptionID() {

  local envVarName=$1
  local fieldVarName=$2
  local optionVarName=$3
  local field_id=$(jq ".data.user.projectV2.fields.nodes[] | select(.name==\"${fieldVarName}\") | .options[] | select(.name==\"${optionVarName}\") | .id" project_data.json) >> $GITHUB_ENV
  echo $field_id
  echo "${envVarName}=${field_id}" >> $GITHUB_ENV

}

# Get a Project Item's unique identifier from a json file.
getProjectItemID() {

  local fromOutputFile=$1
  local envVarName=$2
  local field_id=$(jq ".data.addProjectV2ItemById.item.id" ${fromOutputFile})
  echo "${envVarName}=${field_id}" >> $GITHUB_ENV

}

# Run a GraphQL Mutation from the command line.
runGraphQLMutation() {

  local graphqlFileName=$1
  local mutationOutput=$2

  # NOTE: Update workflow to work with multiline mutation blocks
  mutationLine=$(grep -m 1 '^mutation' ./.github/schema/${graphqlFileName}.graphql)
  echo $mutationLine

  vars=$(echo ${mutationLine} | grep -oP -e '(?<=\$)\w*(?=\:)' || true)

  echo "${vars[*]}"

  i=3

  mutationArgString=""

  for var in $vars; do
    mutationArgString="${mutationArgString} -f ${var}=\$${i}"
    ((i++))
  done

  echo $mutationArgString

  mutationPrefix="gh api graphql -f query=\"\$(cat ./.github/schema/\${graphqlFileName}.graphql)\""

  mutationCommand="${mutationPrefix} ${mutationArgString} > ${mutationOutput}"

  echo $mutationCommand

  eval $mutationCommand

}

