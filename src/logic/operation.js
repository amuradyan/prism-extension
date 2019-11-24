class Operation {
  static USER = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    REGISTER: 'register',
    FORGOT_PASSWORD: 'forgot_password',
  }

  static FACET = {
    ADD: 'add_facet',
    REMOVE: 'remove_facet'
  }

  static CONTEXT_MENU = {
    ADD_NOTE: 'add_note',
    PATCH_SECTION: 'patch_section',
    REMOVE_SECTION: 'remove_section'
  }
}

export default Operation