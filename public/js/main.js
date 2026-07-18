document.addEventListener("DOMContentLoaded", () => {
  const modals = ["create", "rename", "upload", "share"];

  modals.forEach((name) => {
    const openButton = document.querySelector(`[data-action="open-${name}"]`);
    const dialog = document.querySelector(`#${name}Dialog`);
    const cancelButton = document.querySelector(`[data-action="cancel-${name}"]`);

    openButton?.addEventListener("click", () => dialog?.showModal());
    cancelButton?.addEventListener("click", () => dialog?.close());
  });

  document.querySelectorAll("dialog[data-open='true']").forEach((dialog) => {
    dialog.showModal();
  });
});
