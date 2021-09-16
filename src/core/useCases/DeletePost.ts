export type DeletePostDTO = {
  userId: string;
  id: string;
};

export interface DeletePost {
  execute: ({ id, userId }: DeletePostDTO) => Promise<void>;
}
