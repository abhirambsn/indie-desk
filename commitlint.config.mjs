const JIRAKEY_REGEX = 'IEDESK2024-\\d+';

export default {
  parserPreset: {
    parserOpts: {
      // JIRA KEY: subject ,
      headerPattern: /^(\w+): (.+)$/,
      headerCorrespondence: ['type', 'subject'],
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
          const { type, subject } = parsed;
          console.log(parsed);
          if (type === null && subject === null) {
            return [false, "header must be in format '<JIRA KEY>: subject'"];
          }
          return [true, ''];
        },
        'jira-type': (parsed) => {
          console.log(parsed);
          const { type } = parsed;
          console.log(type);
          if (type && !type.match(JIRAKEY_REGEX)) {
            return [false, 'type must be a JIRA key'];
          }
          return [true, ''];
        },
      },
    },
  ],
};
