export const handler = ({ fail }: { fail?: boolean | 'log' }) => {
  if (fail === true) {
    throw new Error('This error was thrown!');
  }

  if (fail === 'log') {
    console.error('This is an error logged via console.error');
  } else {
    console.log('All good!');
  }
};
