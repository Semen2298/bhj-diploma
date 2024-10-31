/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.parent = element.closest('.modal');
    this.accountsList = this.element.querySelector('[name="account_id"]');
    this.renderAccountsList();

  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    if (!this.accountsList) {
      return;
    }

    Account.list({}, (err, res) => {
      if (err) {
        throw new Error(err);
      }

      if (!res.success || res.data.length === 0) {
        return;
      }

      const markup = res.data.reduce((prev, item) => prev + this.getAccountHtml(item), '');

      this.accountsList.innerHTML = markup;
    });

  }

  getAccountHtml(data) {
    return `
    <option value="${data.id}">${data.name}</option>
    `;
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, res) => {
      if (err) {
        throw new Error(err);
      }

      if (!res.success) {
        return;
      }

      this.element.reset();
      this.closeModal(this.parent.dataset.modalId);
      App.update();
    });
  }
}