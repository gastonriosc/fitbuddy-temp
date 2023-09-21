/**
 *  Set Home URL based on User Roles
 */


const getHomeRoute = (role: string) => {

  if (role === 'Alumno') return '/mySettings/';
  else return '/plans/newPlan';
}

export default getHomeRoute;
