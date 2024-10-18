runGraphQLQuery() {

  local graphqlFileName=$1
  local queryOutput=$2

  queryPrefix="gh api graphql -f query=\"\$(cat ./.github/schema/\${graphqlFileName}.graphql)\""
  queryCommand=""

  queryLine=$(grep -m 1 '^query' ./.github/schema/${graphqlFileName}.graphql)
  echo $queryLine

  vars=$(echo ${queryLine} | grep -oP -e '(?<=\$)\w*(?=\:)')

  echo "test"

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


getProjectVariableID() {
  local envVarName=$1
  local fieldVarName=$2
  local field_id=$(jq ".data.user.projectV2.fields.nodes[] | select(.name==\"${fieldVarName}\") | .id" project_data.json)
  echo "${envVarName}=${field_id}" >> $GITHUB_ENV
}

getProjectItemID() {

  local fromOutputFile=$1
  local envVarName=$2
  local field_id=$(jq ".data.addProjectV2ItemById.item.id" ${fromOutputFile})
  echo "${envVarName}=${field_id}" >> $GITHUB_ENV

}

runGraphQLMutation() {

  local graphqlFileName=$1
  local mutationOutput=$2

  mutationLine=$(grep -m 1 '^mutation' ./.github/schema/${graphqlFileName}.graphql)
  echo $mutationLine

  vars=$(echo ${mutationLine} | grep -oP -e '(?<=\$)\w*(?=\:)')

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

