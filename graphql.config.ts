import { IGraphQLConfig } from 'graphql-config';
import dotenv from 'dotenv';

dotenv.config();

export default {
	schema: 'githubSchema.graphql',
	documents: './*.{graphql,ts,yml}',
} satisfies IGraphQLConfig;
