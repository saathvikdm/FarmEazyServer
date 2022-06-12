var config = module.exports;

const userRoles = (config.userRoles = {
  guest: 0,
  farmer: 1,
  user: 2,
  renter: 3,
  admin: 4,
  manufacturer: 5,
  superAdmin: 8,
});

config.accessLevels = {
  guest:
    userRoles.guest | userRoles.user | userRoles.admin | userRoles.superAdmin,
  user:
    userRoles.user |
    userRoles.farmer |
    userRoles.renter |
    userRoles.manufacturer |
    userRoles.admin |
    userRoles.superAdmin,
  admin: userRoles.admin | userRoles.superAdmin,
  superAdmin: userRoles.superAdmin,
};
