// import { SynthUtils } from '@aws-cdk/assert';
import { IntegTesting } from './integ.default';

test('integ snapshot validation', () => {
  const integ = new IntegTesting();
  integ.stack.forEach(() => {
    // expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});
