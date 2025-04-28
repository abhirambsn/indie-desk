export const getTaskIdByProject = (project: any, existingIds: string[]) => {
  const initials = project.name
    .split(' ')
    .map((word: any) => word[0].toUpperCase())
    .join('');

  const existingNumbers = existingIds
    .filter((id) => id.startsWith(initials))
    .map((id) => parseInt(id.split('-')[1], 10))
    .filter((num) => !isNaN(num));

  const nextNumber = (existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0) + 1;

  return `${initials}-${nextNumber.toString().padStart(5, '0')}`;
};

export const getTicketIDFromProject = (project: any) => {
  const initials = project.name
    .split(' ')
    .map((word: any) => word[0].toUpperCase())
    .join('');
  const randomNumber = Math.floor(Math.random() * 90000) + 10000;
  return `${initials}${randomNumber}`;
};
