Electra
===

Electra is a boilerplate application for building SaaS developer tools. It has a lot of what you would need already baked in. 


### Quickstart

***Easiest:** [Open Electra on GitPod.io 🚀](https://gitpod.io/#https://github.com/anglinb/electra)*

#### Install
```
git clone https://github.com/anglinb/electra && cd electra
yarn
```

#### Run

*Note: You'll need some GitHub credentials to get started. Edit you .env to with GitHub App Credential*

```
yarn dev
```

### Workflow

Here is the workflow I follow to develop features:

- 1. Consider the data I need for a new feature
- 2. Create the schema in GraphQL `scr/graphql/schema.graphql`
- 3. Create [a Prsma database migration](https://www.prisma.io/docs/concepts/components/prisma-migrate) from editing the database schema `prisma/schema.prisma` 
- 4. (If I've added a new table) Update the [`codegen.yml`](https://github.com/anglinb/electra/blob/853a9e703ec26799657dd9ad50a451433f72aad6/codegen.yml#L32) to include the new tables.
- 5. Update my resolvers `src/server/resolvers`
- 6. Test at `http://localhost:4040/api/graphql`
- 7. Update my front end next app
- 8. Celebrate 🍻 

### Design

Electra's core lies in the GraphQL interface between the front end and the backend. The schema defined in  `src/graphql/schema.graphql` is the source of truth for all data exchanged between the client and the server. `graphql-codegen` generates typescript bindings & react hooks based on schema and queries defined in `src/queries`.

### Deployment

The application is split such that the front end and backend can be deployed seperately or together. The easiest way to get started is to simply deploy with Vercel or Heroku. 

#### Creating a GitHub App

[GitHub's documentation](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app)

- Set the Callback URL to `http://localhost:4040/api/auth/callback/github` and ensure `Request user authorization (OAuth) during installation` is checked. 

- Copy the `Client ID` and generate a Client Secret

- Paste both into the `.env` file
