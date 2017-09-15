import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper'

export const VisibleOnlyAdmin = connectedAuthWrapper({
  authenticatedSelector: state => state.user !== null && state.user.isAdmin,
  wrapperDisplayName: 'VisibleOnlyAdmin',
})

export const VisibleOnlyUser = connectedAuthWrapper({
  authenticatedSelector: state => state.user === null || !state.user.isAdmin,
  wrapperDisplayName: 'VisibleOnlyUser',
})
