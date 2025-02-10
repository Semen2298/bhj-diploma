/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const bodySidebar = document.querySelector(".sidebar-mini");
    const sidebarToggleBtn = document.querySelector(".sidebar-toggle");

    sidebarToggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      bodySidebar.classList.toggle("sidebar-open")
      bodySidebar.classList.toggle("sidebar-collapse")
    });

  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const btnRegister = document.querySelector(".menu-item_register");
    const btnLogin = document.querySelector(".menu-item_login");
    const btnLogout = document.querySelector(".menu-item_logout");

    if (btnRegister) {
      btnRegister.addEventListener("click", (e) => {
        e.preventDefault();
        App.getModal("register").open();
      });
    }

    if (btnLogin) {
      btnLogin.addEventListener("click", (e) => {
        e.preventDefault();
        App.getModal("login").open();
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        User.logout((err, response) => {
          if (response && response.success) {
            App.setState("init");
          }
        });
      });
    }
  }
}