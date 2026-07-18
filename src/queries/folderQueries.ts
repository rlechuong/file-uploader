import { prisma } from "../config/prisma.js";

const createFolder = async (name: string, userId: string, parentId?: string | null) => {
  const folder = await prisma.folder.create({
    data: {
      name,
      user: { connect: { id: userId } },
      ...(parentId ? { parent: { connect: { id: parentId } } } : {}),
    },
  });

  return folder;
};

const findFolderById = async (id: string) => {
  const folder = await prisma.folder.findUnique({
    where: { id },
  });

  return folder;
};

const findFolderAndContents = async (id: string) => {
  const folder = await prisma.folder.findUnique({
    where: { id },
    include: { files: true, children: true },
  });

  if (!folder) return null;

  const { children, ...folderInfo } = folder;

  return { ...folderInfo, subfolders: children };
};

const findRootFolderContents = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { passwordHash: true },
    include: {
      folders: { where: { parentId: null } },
      files: { where: { folderId: null } },
    },
  });

  if (!user) return null;

  return { subfolders: user.folders, files: user.files };
};

const findSiblingFolderByName = async (name: string, userId: string, parentId?: string | null) => {
  const folder = await prisma.folder.findFirst({
    where: { name, userId, parentId: parentId ?? null },
  });

  return folder;
};

const updateFolder = async (id: string, name: string) => {
  const folder = await prisma.folder.update({
    where: { id },
    data: { name },
  });

  return folder;
};

const deleteFolder = async (id: string) => {
  const folder = await prisma.folder.delete({
    where: { id },
  });

  return folder;
};

const isDescendantOf = async (folderId: string, ancestorId: string): Promise<boolean> => {
  let currentFolderId: string | null = folderId;

  while (currentFolderId !== null) {
    if (currentFolderId === ancestorId) {
      return true;
    }

    const currentFolder = await findFolderById(currentFolderId);
    if (!currentFolder) {
      return false;
    }

    currentFolderId = currentFolder.parentId;
  }

  return false;
};

export {
  createFolder,
  findFolderById,
  findFolderAndContents,
  findRootFolderContents,
  findSiblingFolderByName,
  updateFolder,
  deleteFolder,
  isDescendantOf,
};
