import { prisma } from "../config/prisma.js";
import { cloudinary } from "../config/cloudinary.js";

type CreateFileInput = {
  id?: string;
  name: string;
  storageKey: string;
  mimeType: string;
  resourceType: string;
  size: bigint;
  url: string;
  userId: string;
  folderId?: string | null;
};

const createFile = async (fileData: CreateFileInput) => {
  const file = await prisma.file.create({
    data: {
      ...(fileData.id ? { id: fileData.id } : {}),
      name: fileData.name,
      storageKey: fileData.storageKey,
      mimeType: fileData.mimeType,
      resourceType: fileData.resourceType,
      size: fileData.size,
      url: fileData.url,
      user: { connect: { id: fileData.userId } },
      ...(fileData.folderId ? { folder: { connect: { id: fileData.folderId } } } : {}),
    },
  });

  return file;
};

const findFileById = async (id: string) => {
  const file = await prisma.file.findUnique({
    where: { id },
  });

  return file;
};

const updateFile = async (id: string, name: string) => {
  const file = await prisma.file.update({
    where: { id },
    data: { name },
  });

  return file;
};

const deleteFile = async (id: string) => {
  const file = await prisma.file.findUnique({ where: { id } });

  if (!file) return null;

  await cloudinary.uploader.destroy(file.storageKey, { resource_type: file.resourceType });

  const deletedFile = await prisma.file.delete({ where: { id } });

  return deletedFile;
};

export { createFile, findFileById, updateFile, deleteFile };
