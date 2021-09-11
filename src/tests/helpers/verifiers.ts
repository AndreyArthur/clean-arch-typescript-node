const regexp = {
  uuid: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
  sha265: /^[a-f0-9]{64}$/gi,
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

const isPost = (post: Record<string, any>): boolean => {
  if (!regexp.uuid.test(post.id)) return false;
  if (!post.title) return false;
  if (!post.content) return false;
  if (!regexp.uuid.test(post.userId)) return false;
  if (!isDate(post.createdAt) || !isDate(post.updatedAt)) return false;

  return true;
};

const isSha256 = (hash: string): boolean => {
  if (!hash) return false;
  if (!regexp.sha265.test(hash)) return false;

  return true;
};

export const verifiers = {
  isUser,
  isDate,
  isPost,
  isSha256,
};
