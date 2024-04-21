import { App, Aws } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ServerStack } from '../lib/stacks/server-stack';
import { OrganizationPrincipal } from 'aws-cdk-lib/aws-iam';
import { ClientStack } from '../lib/stacks/client-stack';

test('Stacks', async () => {
  const orgId = 'o-12345abcde';

  const app = new App();

  // --- Server ---
  const serverStack = new ServerStack(app, 'Server', {
    allowedPrincipals: [new OrganizationPrincipal(orgId)]
  });

  // --- Client ---

  const clientStack = new ClientStack(app, 'Client', {
    serverGatewayUrl: serverStack.apiGateway.url,
    serverGatewayRegion: Aws.REGION
  });

  // --- Tests ---

  const serverTemplate = Template.fromStack(serverStack);
  expect(serverTemplate).toMatchSnapshot();
  serverTemplate.resourceCountIs('AWS::ApiGateway::RestApi', 1);

  const clientTemplate = Template.fromStack(clientStack);
  expect(clientTemplate).toMatchSnapshot();
});
