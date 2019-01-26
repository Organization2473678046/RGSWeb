const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  files: state => state.files.files,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  visits: state => state.taskpackage.visits
}
export default getters
