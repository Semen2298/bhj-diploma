/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }

      if (!res || !res.success) {
        console.warn("Ошибка регистрации:", res?.error || "Неизвестная ошибка");
        return;
      }
      this.element.reset();
      App.setState('user-logged');
      App.getModal('register').close();
    });
  }
}