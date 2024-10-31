/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Не передан элемент');
    }

    this.element = element;
    this.pageTitle = this.element.querySelector('.content-title');
    this.content = this.element.querySelector('.content');
    this.registerEvents();

  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const deleteAccountButtons = [...this.element.querySelectorAll('.remove-account')];

    deleteAccountButtons
      .forEach((btn) => btn.addEventListener('click', () => this.removeAccount()));

    this.initRemoveTransactionButtons();
  }

  initRemoveTransactionButtons() {
    if (!this.content) {
      return;
    }

    const deleteTransactiontButtons = [...this.content.querySelectorAll('.transaction__remove')];

    deleteTransactiontButtons
      .forEach((btn) => btn.addEventListener('click', () => this.removeTransaction(btn.dataset.id)));

  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }

    const isUserAgree = confirm('Вы действительно хотите удалить счёт?');

    if (!isUserAgree) {
      return;
    }

    Account.remove({ id: this.lastOptions.account_id }, (err, res) => {
      if (err) {
        throw new Error(err);
      }

      if (!res.success) {
        return;
      }

      this.clear();
      App.updateWidgets();
      App.updateForms();
    });

  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    const isUserAgree = confirm('Вы действительно хотите удалить эту транзакцию?');

    if (!isUserAgree) {
      return;
    }

    Transaction.remove({ id }, (err, res) => {
      if (err) {
        throw new Error(err);
      }

      if (!res.success) {
        return;
      }

      App.update();
    });

  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    const isUserAgree = confirm('Вы действительно хотите удалить эту транзакцию?');

    if (!isUserAgree) {
      return;
    }

    Transaction.remove({ id }, (err, res) => {
      if (err) {
        throw new Error(err);
      }

      if (!res.success) {
        return;
      }

      App.update();
    });

  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;

  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    if (!this.pageTitle) {
      return;
    }

    this.pageTitle.innerText = name;

  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const dateObj = new Date(date);

    const monthName = dateObj.toLocaleString("ru", {
      month: 'long',
    });

    const hours = dateObj.getHours();
    const hoursView = hours > 9 ? hours : `0${hours}`;
    const minutes = dateObj.getMinutes();
    const minutesView = minutes > 9 ? minutes : `0${minutes}`;

    return `${dateObj.getDay()} ${monthName} ${dateObj.getFullYear()} г. в ${hoursView}:${minutesView}`;

  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
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
        <div class="transaction__summ">
            ${item.sum} <span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
              <i class="fa fa-trash"></i>  
          </button>
      </div>
    </div>
    `;

  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    if (data.length === 0) {
      this.content.innerHTML = '';
      return;
    }

    const markup = data.reduce((prev, item) => prev + this.getTransactionHTML(item), '');

    this.content.innerHTML = markup;

    this.initRemoveTransactionButtons();
  }

}
