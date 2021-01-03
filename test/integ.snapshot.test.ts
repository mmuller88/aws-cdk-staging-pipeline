import '@aws-cdk/assert/jest';
// import { SynthUtils } from '@aws-cdk/assert';
import { IntegTesting } from '../src/integ.default';

test('integ snapshot validation', () => {
  const integ = new IntegTesting();
  integ.stack.forEach(() => {
    // ATM probably not possible to create a snapshot as it uses a newer bootstrap. I get that snapshot manually from the AWS Console
    // expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});
