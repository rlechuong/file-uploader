import { prisma } from "../config/prisma.js";
import fs from "node:fs/promises";
import path from "node:path";

type CreateFileInput = {
  id?: string;
  name: string;
  storageKey: string;
  mimeType: string;
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

  await fs.unlink(path.join("uploads", file.storageKey));

  const deletedFile = await prisma.file.delete({ where: { id } });

  return deletedFile;
};

export { createFile, findFileById, updateFile, deleteFile };
