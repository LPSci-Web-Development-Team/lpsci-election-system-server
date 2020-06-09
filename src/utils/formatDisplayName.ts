export interface IDisplayName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

/**
 * Returns a the user's name in a full name format
 * 'First Name M. Last Name'
 * @param params User's first, middle, and last name.
 */
export const formatDisplayName = ({
  firstName, middleName, lastName,
}: IDisplayName) => {
  const middleInitial = middleName
    ? `${middleName.charAt(0)}.`
    : '';

  return `${firstName} ${middleInitial} ${lastName}`;
};
