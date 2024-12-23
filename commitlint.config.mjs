const JIRAKEY_REGEX = 'IEDESK2024-\\d+';

export default {
  parserPreset: {
    parserOpts: {
      headerPattern: /^IEDESK2024-(\d+): (.+)/,
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
          const { issueId, message } = parsed;
          if (issueId === null && message === null) {
            return [false, "header must be in format '<JIRA KEY>: subject'"];
          }
          return [true, ''];
        },
        'jira-type': (parsed) => {
          const { issueId } = parsed;
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
