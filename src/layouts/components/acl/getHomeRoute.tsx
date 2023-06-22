/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'alumno') return '/acl'
  else return '/pages/plans/newPlan'
}

export default getHomeRoute
