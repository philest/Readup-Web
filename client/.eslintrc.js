module.exports = {
    "parser":"babel-eslint",
    "extends": [
      "airbnb",
      "plugin:flowtype/recommended",
    ],
    "plugins": [
        "react",
        "jsx-a11y",
        "import",
        "flowtype",
    ],
    "globals": {
      "Generator": true,
    },
    "rules": {
      semi:0,
      "no-multi-spaces":0,
      "no-multiple-empty-lines":0,
      "no-use-before-define":0,
      "arrow-parens":0,
      "import/extensions":0,
      "import/no-extraneous-dependencies":0,
      "padded-blocks": 0,
      "react/jsx-filename-extension": 0,
      "no-constant-condition": ["error", { "checkLoops": false }],
      "no-multi-str": 0,
      "quotes": 0,
      "react/sort-comp": ["warn", {
        order: [
          'type-annotations',
          'static-methods',
          'lifecycle',
          'everything-else',
          'render'
        ],
        groups: {
          lifecycle: [
            'displayName',
            'propTypes',
            'contextTypes',
            'childContextTypes',
            'mixins',
            'statics',
            'defaultProps',
            'constructor',
            'getDefaultProps',
            'getInitialState',
            'state',
            'getChildContext',
            'componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'componentDidUpdate',
            'componentWillUnmount'
          ]
        }
      }]
    },
};
