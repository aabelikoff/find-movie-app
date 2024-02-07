export default class Pagination {
  constructor(container, maxViewBtn, countFilms = 2) {
    this.container = container;
    this.maxCount = null; //max quantity of found movies
    this.countFilms = countFilms; //quantity of film items to show per one button
    this.maxCountButtons = null; //Math.ceil(this.maxCount / this.countFilms); //max count of buttons
    this.maxViewBtn = maxViewBtn; //max count of buttons to show
    this.currentCount = 1; //current left button
    this.paginationBlockElement = null;

    this.container.addEventListener("click", (e) => {
      if (e.target.dataset.move) {
        this.moveButtons(e.target.dataset.move);
      }
      if (e.target.dataset.btnIndex) {
        this.setActiveButton(e.target.dataset.btnIndex);
      }
    });
  }

  resetPagination() {
    this.currentCount = 1;
    this.maxCount = this.maxCountButtons = null;
    this.clearPaginationElem(true);
  }

  setActiveButton(btnIndex) {
    const pagElem = document.querySelector(".paginationBlock");
    if (pagElem) {
      const buttonsArray = [...pagElem.querySelectorAll("[data-btn-index]")];
      buttonsArray.forEach((button) => {
        if (button.dataset.btnIndex == btnIndex) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }
      });
    }
  }

  setMaxCount(num) {
    this.maxCount = num;
    this.maxCountButtons = Math.ceil(this.maxCount / this.countFilms);
  }

  clearPaginationElem(remove = true) {
    const pagElem = document.querySelector(".paginationBlock");
    if (pagElem && remove) {
      pagElem.remove();
      this.paginationBlockElement = null;
    }
    if (pagElem && !remove) {
      pagElem.innerHTML = "";
    }
  }

  createPaginationElem() {
    this.clearPaginationElem(true);
    let ulElem = document.createElement("ul");
    ulElem.classList.add("paginationBlock");
    this.paginationBlockElement = ulElem;
    this.container.querySelector(".movies").insertAdjacentElement("afterend", ulElem);
    this.renderPaginationElem();
  }

  renderPaginationElem() {
    this.paginationBlockElement.innerHTML = "";
    for (let i = 0; i < this.maxViewBtn; i++) {
      const liElem = document.createElement("li");
      const dataCountNumber = this.currentCount + i;
      if (dataCountNumber > this.maxCountButtons) break;
      liElem.textContent = dataCountNumber;
      liElem.dataset.btnIndex = dataCountNumber;
      liElem.classList.add("pagBtn");
      this.paginationBlockElement.append(liElem);
    }
    const moveLeftElem = document.createElement("li");
    moveLeftElem.className = "pageBtn move left";
    moveLeftElem.innerText = "<<";
    moveLeftElem.dataset.move = "left";
    const moveRightElem = document.createElement("li");
    moveRightElem.className = "pageBtn move right";
    moveRightElem.innerText = ">>";
    moveRightElem.dataset.move = "right";

    this.paginationBlockElement.append(moveLeftElem);
    this.paginationBlockElement.append(moveRightElem);

    this.setActiveButton(this.currentCount);
  }

  moveButtons(direction) {
    switch (direction) {
      case "left":
        if (this.currentCount > this.maxViewBtn) {
          this.currentCount -= this.maxViewBtn;
        }
        break;
      case "right":
        if (this.currentCount + this.maxViewBtn < this.maxCountButtons) {
          this.currentCount += this.maxViewBtn;
        }
        break;
      default:
        break;
    }
    this.renderPaginationElem();
  }
}
