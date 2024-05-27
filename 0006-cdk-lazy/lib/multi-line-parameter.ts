/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { Construct } from 'constructs';
import { aws_ssm, CfnOutput, Lazy } from 'aws-cdk-lib';

export interface MultiLineParameterProps {
  parameterName: string;
}

export class MultiLineParameter extends Construct {
  readonly parameter: aws_ssm.StringParameter;

  // Stores temporarily the lines of our parameter's text
  private readonly lines: string[] = [];

  constructor(scope: Construct, id: string, props: MultiLineParameterProps) {
    super(scope, `${MultiLineParameter.name}-${id}`);

    // Define the wrapped parameter
    this.parameter = new aws_ssm.StringParameter(this, 'Parameter', {
      parameterName: props.parameterName,

      /*
      Here we make use of the Lazy function to assemble
      the lines of the text only at synth time.
       */
      stringValue: Lazy.string({ produce: () => this.lines.join('\n') })
    });

    // Print the name of the parameter we created
    new CfnOutput(this, 'ParameterName', {
      value: this.parameter.parameterName
    });
  }

  /**
   * `addLine` adds a line of text to the parameter
   *
   * @param line
   */
  addLine(line: string) {
    this.lines.push(line);
  }
}
