/**
 *  Set Home URL based on User Roles
 */

const getHomeRoute = (role: string) => {

  if (role === 'Alumno') return '/mySettings/';
  else return '/mySettings/';
}

export default getHomeRoute;
