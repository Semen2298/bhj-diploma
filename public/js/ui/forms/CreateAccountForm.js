/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, res) => {
      if (err) {
        console.error('Ошибка при создании счета:', err);
        return;
      }
  
      if (!res.success) {
        console.warn('Не удалось создать счёт', res.success);
        return;
      }
  
      App.getModal('createAccount').close();
      App.update();
      this.element.reset();
    });
  }
}