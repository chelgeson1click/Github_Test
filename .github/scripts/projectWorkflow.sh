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
  # local mutationOutput=$2

  mutationLine=$(grep -m 1 '^query' ./.github/schema/${graphqlFileName}.graphql)

  vars=$(echo ${mutationLine} | grep -oP '(?<=\$)\w*(?=\:)')

  echo $vars

}

