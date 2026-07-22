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

  const copyButton = document.querySelector("#copyShareLink");

  copyButton?.addEventListener("click", async () => {
    const input = document.querySelector("#shareLinkUrl");
    if (!input) {
      return;
    }
    const fullUrl = window.location.origin + input.value;
    await navigator.clipboard.writeText(fullUrl);
    copyButton.textContent = "Copied!";
    setTimeout(() => {
      copyButton.textContent = "Copy Link";
    }, 2000);
  });
});
