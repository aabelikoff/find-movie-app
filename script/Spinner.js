class Spinner {
  showSpinner() {
    this.spinnerContainer = document.createElement("div");
    this.spinnerContainer.classList.add("spinnerContainer");
    this.spinnerContainer.innerHTML = `
    <div class="lds-roller"><div></div><div></div><div></div><div></div>
    `;
    document.body.append(this.spinnerContainer);
  }
  hideSpinner() {
    this.spinnerContainer.remove();
  }
}
