import { prisma } from "../config/prisma.js";

const createShareLink = async (folderId: string, expiresAt: Date) => {
  const shareLink = await prisma.shareLink.create({
    data: { folder: { connect: { id: folderId } }, expiresAt },
  });

  return shareLink;
};

const findShareLinkByToken = async (token: string) => {
  const shareLink = await prisma.shareLink.findUnique({
    where: { token },
  });

  return shareLink;
};

export { createShareLink, findShareLinkByToken };
