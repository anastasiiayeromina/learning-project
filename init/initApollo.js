// Other
import { serverGraphqlErrorLogger } from '../helpers/serverGraphqlErrorLogger';
import { serverGraphqlInformationLogger } from '../helpers/serverGraphqlInformationLogger';
import { environmentVerify } from '../helpers/verifyEnvironment';
import { initializeApollo } from './apollo';

export const initApollo = async (context, executor) => {
  const {isDevelopment} = environmentVerify();
  try {
    const apolloClient = initializeApollo({}, context);

    const userAgent = context.req.headers['user-agent'];

    const execute = async (query) => {
      try {
        if (isDevelopment) {
          serverGraphqlInformationLogger(query, {
            isStarted: true,
          });
        }

        const queryResult = await apolloClient.query({
          ...query,
          context: {
            headers: {
              'user-agent': userAgent,
            },
          },
        });

        return queryResult;
      } catch (err) {
        serverGraphqlErrorLogger(query, err, context);

        return undefined;
      } finally {
        if (isDevelopment) {
          serverGraphqlInformationLogger(query, {
            isFinished: true,
          });
        }
      }
    };

    await executor(execute);

    return apolloClient.cache.extract();
  } catch (err) {
    console.log('SOME ERROR', err.message);
    return {}
  }
}