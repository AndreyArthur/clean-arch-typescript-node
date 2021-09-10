const regexp = {
  uuid: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
};

const isDate = (date: Date): boolean => {
  try {
    const time = date.getTime();

    return typeof time === 'number';
  } catch {
    return false;
  }
};

const isUser = (
  user: Record<string, any>, password = true,
): boolean => {
  if (!regexp.uuid.test(user.id)) return false;
  if (!user.username) return false;
  if (!password && user.password) return false;
  if (password && !user.password) return false;
  if (!isDate(user.createdAt) || !isDate(user.updatedAt)) return false;

  return true;
};

export const verifiers = {
  isUser,
  isDate,
};
