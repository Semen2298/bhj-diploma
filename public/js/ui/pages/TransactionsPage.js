class TransactionsPage {
  constructor(element) {
    if (!element) throw new Error("Element does not exist");
    this.element = element;
    this.registerEvents();
    this.lastOptions = null;
  }

  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  registerEvents() {
    this.element.addEventListener("click", (event) => {
      if (event.target.closest(".remove-account")) {
        this.removeAccount();
      }
      if (event.target.closest(".transaction__remove")) {
        const id = event.target.closest(".transaction__remove").dataset.id;
        this.removeTransaction(id);
      }
    });
  }

  removeAccount() {
    if (!this.lastOptions) return;
    if (!confirm("Вы действительно хотите удалить счёт?")) return;

    Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
      if (response && response.success) {
        this.clear();
        App.updateWidgets();
        App.updateForms();
      }
    });
  }

  removeTransaction(id) {
    if (!confirm("Вы действительно хотите удалить эту транзакцию?")) return;

    Transaction.remove({ id }, (err, response) => {
      if (response && response.success) {
        this.update();
        App.updateWidgets();
      }
    });
  }

  render(options) {
    if (!options) return;
    this.lastOptions = options;

    Account.get(options.account_id, (err, response) => {
      if (response && response.success) {
        this.renderTitle(response.data.name);
      }
    });

    Transaction.list(options, (err, response) => {
      if (response && response.success) {
        this.renderTransactions(response.data);
      }
    });
  }

  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOptions = null;
  }

  renderTitle(name) {
    this.element.querySelector(".content-title").textContent = name;
  }

  formatDate(date) {
    const d = new Date(date);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return d.toLocaleString("ru-RU", options).replace(" в", " в");
  }

  getTransactionHTML(item) {
    return `
      <div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">${item.sum} <span class="currency">₽</span></div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>`;
  }

  renderTransactions(data) {
    this.element.querySelector(".content").innerHTML = data
      .map(this.getTransactionHTML.bind(this))
      .join("");
  }
}
