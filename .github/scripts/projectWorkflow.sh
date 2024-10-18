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

  query_line=$(grep '^query' ${graphqlFileName}.graphql)

  echo $query_line

}