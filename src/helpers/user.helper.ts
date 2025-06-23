import {User} from '../models';

export const prepareUpdateDataForUpdateUserProfile = (body: User) => {
  const {email, firstName, lastName, role} = body;
  const updatingData: Partial<User> = {};

  if (email) updatingData.email = email;
  if (firstName) updatingData.firstName = firstName;
  if (lastName) updatingData.lastName = lastName;
  if (role) updatingData.role = role;

  return updatingData;
};
