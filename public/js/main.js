document.addEventListener("DOMContentLoaded", () => {
  const createButton = document.querySelector('[data-action="open-create"]');
  const createDialog = document.querySelector("#createDialog");
  const createCancel = document.querySelector('[data-action="cancel-create"]');

  createButton?.addEventListener("click", () => createDialog?.showModal());
  createCancel?.addEventListener("click", () => createDialog?.close());

  const renameButton = document.querySelector('[data-action="open-rename"]');
  const renameDialog = document.querySelector("#renameDialog");
  const renameCancel = document.querySelector('[data-action="cancel-rename"]');

  renameButton?.addEventListener("click", () => renameDialog?.showModal());
  renameCancel?.addEventListener("click", () => renameDialog?.close());
});
