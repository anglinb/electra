Electra
===

Electra is a boilerplate application for building SaaS developer tools. It has a lot of what you would need already baked in. 


### Quickstart

#### Install
```
git clone https://github.com/anglinb/electra && cd electra
yarn
```

#### Run

*Note: You'll need some GitHub credentials to get started. Edit you .env to with GitHub App Credential*

yarn dev

```

### Workflow

I usually start by thinking about data I will need. From there, I'll create changes in the GraphQL schema to expose that data or expose mutations. Next, I'll implement the appropriate resolver. Once I've done so, I'll manually test it in the GraphQL playground at `/api/graphql`. Then I'll go copy my query from the playground to `src/queries`. Once it's there, `graphql-codegen` generates the hooks and I'm good to go!

### Design

Electra's core lies in the GraphQL interface between the front end and the backend. The schema defined in  `src/graphql/schema.graphql` is the source of truth for all data exchanged between the client and the server. `graphql-codegen` generates typescript bindings & react hooks based on schema and queries defined in `src/queries`.

### Deployment

The application is split such that the front end and backend can be deployed seperately or together. The easiest way to get started is to simply deploy with Vercel or Heroku. 

#### Creating a GitHub App

[GitHub's documentation](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app)

- Set the Callback URL to `http://localhost:4040/api/auth/callback/github` and ensure `Request user authorization (OAuth) during installation` is checked. 

- Copy the `Client ID` and generate a Client Secret

- Paste both into the `.env` file