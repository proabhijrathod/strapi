'use strict';

const {
  policy: { createPolicy },
} = require('@strapi/utils');
const { validateHasPermissionsInput } = require('../validation/policies/hasPermissions');

module.exports = createPolicy({
  name: 'plugin::content-manager.hasPermissions',
  validator: validateHasPermissionsInput,
  handler(ctx, config = {}) {
    const { actions = [], hasAtLeastOne = false } = config;

    const {
      state: { userAbility, isAuthenticatedAdmin },
      params: { model },
    } = ctx;

    if (!isAuthenticatedAdmin || !userAbility) {
      return true;
    }

    const isAuthorized = hasAtLeastOne
      ? actions.some(action => userAbility.can(action, model))
      : actions.every(action => userAbility.can(action, model));

    return isAuthorized;
  },
});
