runGraphQLQuery() {
  local graphqlFileName=$1
  local queryOutput=$2

  gh api graphql -f query="$(cat ./.github/schema/${graphqlFileName}.graphql)" > ${queryOutput}
}

getProjectVariableID() {
  local envVarName=$1
  local fieldVarName=$2
  local field_id=$(jq ".data.user.projectV2.fields.nodes[] | select(.name==\"${fieldVarName}\") | .id" project_data.json)
  echo "${envVarName}=${field_id}" >> $GITHUB_ENV
}

testQueryFunc() {
  local graphqlFileName=$1

  query_line=$(grep -m 1 '^query' ./.github/schema/${graphqlFileName}.graphql)

  echo $query_line

}

runGraphQLMutation() {

  local graphqlFileName=$1
  local mutationOutput=$2

  mutationLine=$(grep -m 1 '^mutation' ./.github/schema/${graphqlFileName}.graphql)
  echo $mutationLine

  vars=$(echo ${mutationLine} | grep -oP -e '(?<=\$)\w*(?=\:)')

  echo "${vars[*]}"

  i=3

  queryArgString=""

  for var in $vars; do
    queryArgString="${queryArgString} -f ${var}=\$${i}"
    ((i++))
  done

  echo $queryArgString

  mutationPrefix="gh api graphql -f query=\"\$(cat ./.github/schema/\${graphqlFileName}.graphql)"

  mutationCommand="${mutationPrefix} ${queryArgString} > ${mutationOutput}"

  echo $mutationCommand

  eval $mutationCommand

}

