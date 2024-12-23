const JIRAKEY_REGEX = 'IEDESK2024-\\d+';

export default {
  parserPreset: {
    parserOpts: {
      // JIRA KEY: subject ,
      headerPattern: /^IEDESK2024-(\d+): (.+)/, // Custom regex for the commit message
      headerCorrespondence: ['issueId', 'message'],
    },
  },
  rules: {
    'header-pattern': [2, 'always'],
    'jira-type': [2, 'always', JIRAKEY_REGEX],
  },
  plugins: [
    {
      rules: {
        'header-pattern': (parsed) => {
          console.log(parsed);
          const { issueId, message } = parsed;
          if (issueId === null && message === null) {
            return [false, "header must be in format '<JIRA KEY>: subject'"];
          }
          return [true, ''];
        },
        'jira-type': (parsed) => {
          console.log(parsed);
          const { issueId } = parsed;
          console.log(issueId);
          const key = `IEDESK2024-${issueId}`;
          if (issueId && !key.match(JIRAKEY_REGEX)) {
            return [false, 'type must be a JIRA key'];
          }
          return [true, ''];
        },
      },
    },
  ],
};
