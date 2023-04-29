import { createRoot } from 'react-dom/client';

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// project imports
import * as serviceWorker from 'serviceWorker';
import App from 'App';
import { store } from 'store';

// style + assets
import 'assets/scss/style.scss';
import config from './config';

import * as Realm from 'realm-web';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import gql from 'graphql-tag';
// ==============================|| REACT DOM RENDER  ||============================== //

// Connect to your MongoDB Realm app
const APP_ID = 'data-xjupy';
const app = new Realm.App(APP_ID);
// Gets a valid Realm user access token to authenticate requests
async function getValidAccessToken() {
    // Guarantee that there's a logged in user with a valid access token
    if (!app.currentUser) {
        // If no user is logged in, log in an anonymous user. The logged in user will have a valid
        // access token.
        await app.logIn(Realm.Credentials.anonymous());
    } else {
        // An already logged in user's access token might be stale. Tokens must be refreshed after
        // 30 minutes. To guarantee that the token is valid, we refresh the user's access token.
        await app.currentUser.refreshAccessToken();
    }
    return app.currentUser.accessToken;
}

const graphqlUri = 'https://us-west-2.aws.realm.mongodb.com/api/client/v2.0/app/data-xjupy/graphql';
// Local apps should use a local URI!
// const graphqlUri = `https://us-east-1.aws.stitch.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`
// const graphqlUri = `https://eu-west-1.aws.stitch.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`
// const graphqlUri = `https://ap-southeast-1.aws.stitch.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`

const typeDefs = gql`
    extend type Candidate {
        item_id: ObjectId
    }
`;

const client = new ApolloClient({
    link: new HttpLink({
        uri: graphqlUri,
        fetch: async (uri, options) => {
            const accessToken = await getValidAccessToken();
            options.headers.Authorization = `Bearer ${accessToken}`;
            return fetch(uri, options);
        }
    }),
    cache: new InMemoryCache(),
    typeDefs
});

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <Provider store={store}>
        <BrowserRouter basename={config.basename}>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </BrowserRouter>
    </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
