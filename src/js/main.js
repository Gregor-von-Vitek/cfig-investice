$(function () {
  // Očičko u hesla - zobrazit/skrýt heslo
  $(document).on("click", ".show-password", function () {
    const passwordField = $(this).prev("input");
    const type = passwordField.attr("type") === "password" ? "text" : "password";
    passwordField.attr("type", type);
    $(this).toggleClass("fa-eye fa-eye-slash");
  });

  // Kopírování textu - ikona "Kopírovat" - univerzální
  $(document).on("click", ".fa-copy", function () {
    const valueToCopy = $(this).closest(".value").text().trim(); 
    const tempInput = $("<input>"); 
    $("body").append(tempInput);
    tempInput.val(valueToCopy).select(); 
    document.execCommand("copy"); 
    tempInput.remove(); 
  });

  // Zobrazit/skryt další informace dle nastavení (data-visible-divs)
  $(".card-form").each(function () {
    const visibleDivs = $(this).data("visible-divs");
    if (visibleDivs) {
      const children = $(this).children();
      children.slice(visibleDivs).hide(); 

      const toggleButton = $('<button class="text toggle-info p20"> Více informací <i class="fas fa-chevron-down"></i></button>');
      $(this).after(toggleButton);

      toggleButton.on("click", function () {
        const hiddenDivs = children.slice(visibleDivs);
        if (hiddenDivs.is(":visible")) {
          hiddenDivs.slideUp();
          $(this).html('Více informací <i class="fas fa-chevron-down"></i>');
        } else {
          hiddenDivs.slideDown();
          $(this).html('Méně informací <i class="fas fa-chevron-up"></i>');
        }
      });
    }
  });

  // Zobrazit/skryt uživatelské menu (změnit heslo, odhlásit se)
  $(document).on("click", ".user-info", function (e) {
    e.stopPropagation(); 
    const submenu = $(".user-submenu");
    const chevronIcon = $(this).find(".fa-chevron-down, .fa-chevron-up");

    if ($(".navigation").hasClass("show")) {
      $(".navigation").removeClass("show");
      $(document).off("click.hideNavigation");
      $(document).off("keyup.escapeNavigation");
    }

    if (submenu.is(":visible")) {
      submenu.hide();
      chevronIcon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
      $(document).off("click.hideSubmenu");
      $(document).off("keyup.escapeSubmenu");
    } else {
      submenu.show();
      chevronIcon.removeClass("fa-chevron-down").addClass("fa-chevron-up");

      setTimeout(function () {
        $(document).on("click.hideSubmenu", function (event) {
          if (!$(event.target).closest(".user-submenu").length) {
            submenu.hide();
            chevronIcon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
            $(document).off("click.hideSubmenu"); 
            $(document).off("keyup.escapeSubmenu"); 
          }
        });

        $(document).on("keyup.escapeSubmenu", function (event) {
          if (event.key === "Escape") {
            submenu.hide();
            chevronIcon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
            $(document).off("click.hideSubmenu");
            $(document).off("keyup.escapeSubmenu");
          }
        });
      }, 0);
    }
  });

  // Po kliknutí na uživatelské menu, zabránit zavření submenu
  $(document).on("click", ".user-submenu", function (e) {
    e.stopPropagation();
  });

  // Uživatelské menu - mobilní verze (změnit heslo, odhlásit se)
  $(document).on("click", ".mobile-menu", function (e) {
    e.stopPropagation(); 
    const navigation = $(".navigation");

    if ($(".user-submenu").is(":visible")) {
      $(".user-submenu").hide();
      $(".user-info").find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
      $(document).off("click.hideSubmenu");
      $(document).off("keyup.escapeSubmenu");
    }

    if (navigation.hasClass("show")) {
      navigation.removeClass("show");
      $(document).off("click.hideNavigation");
      $(document).off("keyup.escapeNavigation");
    } else {
      navigation.addClass("show");

      setTimeout(function () {
        $(document).on("click.hideNavigation", function (event) {
          if (!$(event.target).closest(".navigation").length) {
            navigation.removeClass("show");
            $(document).off("click.hideNavigation"); 
            $(document).off("keyup.escapeNavigation"); 
          }
        });

        $(document).on("keyup.escapeNavigation", function (event) {
          if (event.key === "Escape") {
            navigation.removeClass("show");
            $(document).off("click.hideNavigation");
            $(document).off("keyup.escapeNavigation");
          }
        });
      }, 0);
    }
  });

  // Po kliknutí na navigaci, zabránit zavření navigace
  $(document).on("click", ".navigation", function (e) {
    e.stopPropagation();
  });

  // Univerzální funkce pro zobrazení zprávy 
  // příklad: showMessage("success", "Úspěšně přihlášeno")
  window.showMessage = function (type, text) {
    var messageClass = type === "success" ? "success" : "error";
    var messageIcon = type === "success" ? "fa-check" : "fa-diamond-exclamation";
    var messageHtml = `
      <div class="message ${messageClass}">
      <div class="icon">
      <i class="fas ${messageIcon} message-icon"></i>
      </div>
      <div class="message-info">
      <span class="message-text">${text}</span>
      <i class="fas fa-times close-message"></i>
      </div>
      </div>
    `;
    $(".message-container").hide().html(messageHtml).fadeIn(500);
    $(document).on("click", ".close-message", function () {
      $(this).parent().parent().fadeOut(500);
    });

    setTimeout(function () {
      $(".message").fadeOut(500);
    }, 5000);

  };

  // Univerzální funkce pro zobrazení chybové hlášky u pole
  // Příklad: fieldError("contract", "Zadejte číslo smlouvy");
  window.fieldError = function (fieldID, message) {
    var field = $("#" + fieldID);
    field.addClass("error");
    field.next(".field-error").remove();
    var errorHtml = '<div class="field-error"><i class="fas fa-diamond-exclamation"></i>' + message + "</div>";
    field.after(errorHtml);
  };

  // Odstranění chybové hlášky při změně hodnoty pole
  $("input, select, textarea").on("input change", function () {
    $(this).removeClass("error");
    $(this).next(".field-error").remove();
  });

  // Login page - Zobrazit formulář pro zapomenuté heslo
  $(document).on("click", ".forgot-password", function (e) {
    e.preventDefault();
    $(".login-form").removeClass("show").addClass("hide");
    $(".forgot-password-form").removeClass("hide").addClass("show");
  });

  // Login page - Zobrazit přihlašovací formulář
  $(document).on("click", ".back-to-login", function (e) {
    e.preventDefault();
    $(".forgot-password-form").removeClass("show").addClass("hide");
    $(".register-form").removeClass("show").addClass("hide");
    $(".login-form").removeClass("hide").addClass("show");
  });

  // Pravidla pro zabezpečení hesla
  $("#new-password, #confirm-password, #register-password").on("input", function () {
    // Special handling for register password field
    if ($(this).attr("id") === "register-password") {
      var password = $("#register-password").val();
      confirmPassword = $("#register-password").val();
    } else {
      var password = $("#new-password").val();
      var confirmPassword = $("#confirm-password").val();
    }

    var allValid = true;

    $(".password-rules")
      .find("label")
      .each(function () {
        var rule = $(this).text().trim();
        var icon = $(this).find("i");
        if (rule.includes("Minimálně 8 znaků")) {
          if (password.length >= 8) {
            icon.removeClass("fa-circle").removeClass("far").addClass("fa").addClass("fa-check");
            $(this).addClass("check-success");
          } else {
            icon.removeClass("fa-check").removeClass("fa").addClass("far").addClass("fa-circle");
            $(this).removeClass("check-success");
            allValid = false;
          }
        } else if (rule.includes("Alespoň jedno velké písmeno")) {
          if (/[A-Z]/.test(password)) {
            icon.removeClass("fa-circle").removeClass("far").addClass("fa").addClass("fa-check");
            $(this).addClass("check-success");
          } else {
            icon.removeClass("fa-check").removeClass("fa").addClass("far").addClass("fa-circle");
            $(this).removeClass("check-success");
            allValid = false;
          }
        } else if (rule.includes("Alespoň jedno malé písmeno")) {
          if (/[a-z]/.test(password)) {
            icon.removeClass("fa-circle").removeClass("far").addClass("fa").addClass("fa-check");
            $(this).addClass("check-success");
          } else {
            icon.removeClass("fa-check").removeClass("fa").addClass("far").addClass("fa-circle");
            $(this).removeClass("check-success");
            allValid = false;
          }
        } else if (rule.includes("Alespoň jedno číslo")) {
          if (/[0-9]/.test(password)) {
            icon.removeClass("fa-circle").removeClass("far").addClass("fa").addClass("fa-check");
            $(this).addClass("check-success");
          } else {
            icon.removeClass("fa-check").removeClass("fa").addClass("far").addClass("fa-circle");
            $(this).removeClass("check-success");
            allValid = false;
          }
        }
      });

    if (password !== confirmPassword) {
      allValid = false;
    }

    console.log(allValid);
    if (allValid) {
      $(".login-button").prop("disabled", false);
      $(".register-button").prop("disabled", false);
    } else {
      $(".login-button").prop("disabled", true);
      $(".register-button").prop("disabled", true);
    }
  });

  // Sidebar navigation button
  // XXX
  var sidebarHtml = '<div class="sidebar" style="display: none; position: fixed; left: 0; top: 0; height: 100%; width: 250px; background-color: #333; color: #fff; padding: 20px;">' +
    "<h2 style='color: white'>HTML Soubory</h2>" +
    "<ul>" +
    '<li><a href="index.html" style="color: #fff;">index.html</a></li>' +
    '<li><a href="new-password.html" style="color: #fff;">new-password.html</a></li>' +
    '<li><a href="instrukce-k-zaplaceni.html" style="color: #fff;">instrukce-k-zaplaceni.html</a></li>' +
    '<li><a href="instrukce-k-zaplaceni-2.html" style="color: #fff;">instrukce-k-zaplaceni-2.html</a></li>' +
    '<li><a href="prehled-1.html" style="color: #fff;">prehled-1.html</a></li>' +
    '<li><a href="prehled-2.html" style="color: #fff;">prehled-2.html</a></li>' +
    '<li><a href="investice.html" style="color: #fff;">investice.html</a></li>' +
    '<li><a href="aktuality.html" style="color: #fff;">aktuality.html</a></li>' +
    '<li><a href="aktuality-detail.html" style="color: #fff;">aktuality-detail.html</a></li>' +
    '<li><a href="muj-ucet-osobni-udaje.html" style="color: #fff;">muj-ucet-osobni-udaje.html</a></li>' +
    '<li><a href="muj-ucet-zadosti-o-zmenu.html" style="color: #fff;">muj-ucet-zadosti-o-zmenu.html</a></li>' +
    '<li><a href="detail-o-investici.html" style="color: #fff;">detail-o-investici.html</a></li>' +
    '<li><a href="detail-platby.html" style="color: #fff;">detail-platby.html</a></li>' +
    '<li><a href="detail-dokumenty.html" style="color: #fff;">detail-dokumenty.html</a></li>' +
    '<li><a href="detail-kontakt.html" style="color: #fff;">detail-kontakt.html</a></li>' +
    "</ul>" +
    "</div>" +
    '<button class="sidebar-toggle" style="position: fixed; left: 0; top: 50%; transform: translateY(-50%); background-color: #333; color: #fff; border: none; padding: 10px; cursor: pointer;">☰</button>';
  $("body").append(sidebarHtml);

  $(document).on("click", ".sidebar-toggle", function () {
    $(".sidebar").toggle();
  });

  // Overlay functionality (modal/popup/sidebar)
  // Příklad: showOverlay("overlay-id");
  window.showOverlay = function (overlayId) {

    const sideOverlays = ['odklad-splatek-overlay', 'upravit-trvala-adresa-overlay', 'upravit-dorucovaci-adresa-overlay', 'napoveda-prehled-overlay', 'vytvorit-zadost-overlay', 'napoveda-zadosti-overlay', 'napoveda-smlouvy-overlay', 'napoveda-dokumenty-overlay', 'napoveda-vyuctovani-overlay', 'upravit-bankovni-ucet-overlay', 'upravit-majetkovy-ucet-overlay'];
    
    // Measure scrollbar width
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    // Add padding to main to prevent layout shift
    $("main").css("padding-right", scrollBarWidth > 0 ? scrollBarWidth + "px" : "");

    if (sideOverlays.includes(overlayId)) {
      


      $("#" + overlayId).addClass("active");
      $("#overlay-background").fadeIn(300);
      $("body").css("overflow", "hidden");
    } else {
      $("#overlay-background").fadeIn(300);
      $("#" + overlayId).fadeIn(300);
      $("body").css("overflow", "hidden");
    }

    if (overlayId === 'odklad-splatek-overlay') {
      $("#" + overlayId + " select:first").focus();
    }
    else if (overlayId === 'upravit-trvala-adresa-overlay' || overlayId === 'upravit-dorucovaci-adresa-overlay') {
      $("#" + overlayId + " .close-overlay:first").focus();
    }
    else if (overlayId === 'upravit-telefon-overlay' || overlayId === 'upravit-email-overlay') {
      $("#" + overlayId + " .close-overlay:first").focus();
    }
    else if (overlayId === 'photo-example-overlay') {
      $("#" + overlayId + " .close-photo-example:first").focus();
    } 
    else if (overlayId === 'upravit-majetkovy-ucet-overlay') {
      $("#" + overlayId + " .close-overlay:first:first").focus();
    }
    else if (overlayId === 'upravit-bankovni-ucet-overlay') {
      $("#" + overlayId + " .close-overlay:first:first").focus();
    }
    else {
      $("#" + overlayId + " button:first").focus();
    }

  };

  // Skrýt overlay (popup/modal/sidebar)
  // Příklad: hideOverlay();
  window.hideOverlay = function () {
    $(".overlay").fadeOut(300);
    $(".side-overlay").removeClass("active");
    $("#overlay-background").fadeOut(300);
    $("body").css("overflow", "");
    // Remove main padding when overlay closes
    $("main").css("padding-right", "");
  };

  // Upload souborů 
  $(document).on("change", ".file-upload", function () {
    const fileInput = $(this);
    const fileInputId = fileInput.attr('id');
    const fileName = fileInput[0]?.files[0]?.name;
    const fileUploadContainer = fileInput.siblings(".file-upload-container");
    const fileInfo = fileUploadContainer.find(".file-info");
    const fileDeleteIcon = fileInfo.find(".file-delete");
    let fileNameElement;

    if (fileInputId === 'document-upload') {
      fileNameElement = $("#file-name");
    } else if (fileInputId === 'trvala-op-predni') {
      fileNameElement = $("#trvala-file-name-predni");
    } else if (fileInputId === 'trvala-op-zadni') {
      fileNameElement = $("#trvala-file-name-zadni");
    } else {
      fileNameElement = fileUploadContainer.find("[id$='file-name']");
    }

    if (fileName && fileNameElement.length) {
      fileNameElement.text(fileName);
      fileDeleteIcon.addClass("visible");
      fileInfo.addClass("visible");
    } else {
      if (fileNameElement.length) {
        fileNameElement.text("");
      }
      fileDeleteIcon.removeClass("visible");
      fileInfo.removeClass("visible");
    }
  });

  // Tlačítko pro upload souboru
  $(document).on("click", ".file-upload-button", function (e) {
    e.preventDefault();
    $(this).closest(".file-upload-container").siblings(".file-upload").click();
  });

  // Odstranění nahraného souboru
  $(document).on("click", ".file-delete", function () {
    const fileUploadWrapper = $(this).closest(".file-upload-wrapper");
    const fileInput = fileUploadWrapper.find(".file-upload");
    const fileInfo = $(this).closest(".file-info");

    fileInput.val("").trigger("change");

    $(this).removeClass("visible");

    fileInfo.removeClass("visible");

    fileUploadWrapper.find("#file-name").text("");
  });

  // Zavřít overlay po kliknutí na křížek
  $(document).on("click", ".close-overlay", function () {
    hideOverlay();
  });

  // Zavřít overlay po kliknutí mimo
  $(document).on("click", "#overlay-background", function () {
    hideOverlay();
  });

  // Close overlay when pressing Escape key
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      if ($(".overlay:visible").length || $(".side-overlay.active").length) {
        hideOverlay();
      }
    }
  });

  // Po kliknutí na popup/modal/sidebar, zabránit zavření overlay
  $(document).on("click", ".overlay", function (e) {
    e.stopPropagation();
  });

  // Po kliknutí na popup/modal/sidebar, zabránit zavření overlay
  $(document).on("click", ".side-overlay", function (e) {
    e.stopPropagation();
  });

  // Zavření overlay po kliknutí na "Zavřít"
  $(document).on("click", "#cancel-payment-delay", function () {
    hideOverlay();
  });

  // Zavření overlay po kliknutí na "Zavřít"
  $(document).on("click", "#cancel-payment-request", function () {
    hideOverlay();
  });


  // Zavření overlay po kliknutí na "Zavřít"
  $(document).on("click", "#submit-payment-delay", function () {
    hideOverlay();
  });

  // Zavření overlay po kliknutí na "Zavřít"
  $(document).on("click", "#cancel-trvala-adresa, #cancel-dorucovaci-adresa", function () {
    hideOverlay();
  });

  // Zavření overlay po kliknutí na "Zavřít"
  $(document).on("click", "#submit-trvala-adresa", function () {
    hideOverlay();
  });

  // Zavření overlay po kliknutí na "Zavřít"
  $(document).on("click", "#submit-dorucovaci-adresa", function () {
    hideOverlay();
  });

  // Zavření overlay po kliknutí na "Zavřít"
  $(document).on("click", "#cancel-telefon", function () {
    hideOverlay();
  });

    // Zavření overlay po kliknutí na "Odeslat požadavek" - Žádost o vyplacení provize
  $(document).on("click", "#submit-vyplaceni-provize", function () {
    hideOverlay();
  });

  // Zavření overlay po kliknutí na "Zavřít"
  $(document).on("click", "#cancel-vyplaceni-provize", function () {
    hideOverlay();
  });

  // Zavření overlay po kliknutí na "Zavřít"
  $(document).on("click", "#zrusit-telefon", function () {
    hideOverlay();
  });

  // Zavření overlay po kliknutí na "Zavřít"
  $(document).on("click", "#zrusit-email", function () {
    hideOverlay();
  });

  // Zavření overlay "Zavřít"
  $(document).on("click", "#cancel-zadost-request", function () {
    hideOverlay();
  });

  // Zavření overlay s nápovědou
  $(document).on("click", "#close-napoveda", function () {
    hideOverlay();
  });

  // Zavření overlay po kliknutí na "Zavřít"
  $(document).on("click", "#cancel-heslo", function () {
    hideOverlay();
  })

   // Zavření overlay po kliknutí na "Nastavit nové heslo"
  $(document).on("click", "#submit-heslo", function () {
    hideOverlay();
  })

  // Zavření overlay po kliknutí na "Vytvořit"
  $(document).on("click", "#submit-zadost-request", function () {
    hideOverlay();
  })



  // Zobrazit validační ikonu vedle textového pole při změně hodnoty
  $('.side-overlay input[type="text"]').on("input change", function () {
    const input = $(this);
    const validationIcon = input.siblings(".validation-icon");

    if (input.val().trim() !== '') {
      validationIcon.addClass("visible");
    } else {
      validationIcon.removeClass("visible");
    }
  });

  // Zobrazit validační ikonu vedle textového pole při načtení stránky
  $('.side-overlay input[type="text"]').each(function () {
    const input = $(this);
    const validationIcon = input.siblings(".validation-icon");

    if (input.val().trim() !== '') {
      validationIcon.addClass("visible");
    } else {
      validationIcon.removeClass("visible");
    }
  });

  // Změna telefonu a e-mailu
  let newEmailAddress = "";
  let newPhoneNumber = "";

  $(document).on("click", "#submit-telefon", function () {
    const telefonniCislo = $("#nove-telefonni-cislo").val().trim();

    if (telefonniCislo && telefonniCislo.length >= 9) {
      newPhoneNumber = telefonniCislo;
      hideOverlay();
      showOverlay("upravit-telefon-overlay-step2");
    } else {
      $("#nove-telefonni-cislo").addClass("error");
      $("#nove-telefonni-cislo").after('<div class="field-error"><i class="fas fa-diamond-exclamation"></i>Zadejte platné telefonní číslo</div>');
    }
  });

  $(document).on("click", "#cancel-email", function () {
    hideOverlay();
  });

  $(document).on("click", "#submit-email", function () {
    const email = $("#novy-email").val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && emailRegex.test(email)) {
      newEmailAddress = email;

      hideOverlay();
      showOverlay("upravit-email-overlay-step2");
    } else {
      $("#novy-email").addClass("error");
      $("#novy-email").after('<div class="field-error"><i class="fas fa-diamond-exclamation"></i>Zadejte platný e-mail</div>');
    }
  });

  // Ověření telefonního čísla - krok 2
  $(document).on("click", "#potvrdit-telefon", function () {
    const kod = $("#overovaci-kod-telefon").val().trim();

    if (kod && kod.length === 6) {
      hideOverlay();

      const telefonValue = $(".card-form .name:contains('Telefon')").next(".value");
      telefonValue.html(`${newPhoneNumber} <i class="fas fa-edit edit-icon" onclick="showOverlay('upravit-telefon-overlay')" title="Upravit telefon"></i>`);
    } else {
      $("#overovaci-kod-telefon").addClass("error");
      $("#overovaci-kod-telefon").after('<div class="field-error"><i class="fas fa-diamond-exclamation"></i>Zadejte platný ověřovací kód</div>');
    }
  });

  // Ověření e-mailu - krok 2
  $(document).on("click", "#potvrdit-email", function () {
    const kod = $("#overovaci-kod-email").val().trim();

    if (kod && kod.length === 6) {
      hideOverlay();

      const emailValue = $(".card-form .name:contains('E-mail')").next(".value");
      emailValue.html(`${newEmailAddress} <i class="fas fa-edit edit-icon" onclick="showOverlay('upravit-email-overlay')" title="Upravit e-mail"></i>`);
    } else {
      $("#overovaci-kod-email").addClass("error");
      $("#overovaci-kod-email").after('<div class="field-error"><i class="fas fa-diamond-exclamation"></i>Zadejte platný ověřovací kód</div>');
    }
  });

  // Otevření modálního okna pro příklad fotografie dokladu
  $(document).on("click", ".show-photo-example", function (e) {
    e.preventDefault();
    $("#secondary-overlay-background").fadeIn(300);
    $("#photo-example-overlay").fadeIn(300);
    $("#photo-example-overlay .close-photo-example:first").focus();
  });

  // Zavřít modální okno pro příklad fotografie dokladu
  $(document).on("click", ".close-photo-example", function () {
    $("#photo-example-overlay").fadeOut(300);
    $("#secondary-overlay-background").fadeOut(300);
  });

  // Zavřít modální okno pro příklad fotografie dokladu při kliknutí mimo
  $(document).on("click", "#secondary-overlay-background", function () {
    $("#photo-example-overlay").fadeOut(300);
    $(this).fadeOut(300);
  });

  // Zavřít modální okno pro příklad fotografie dokladu při stisknutí klávesy Escape (ale neuzavírat boční overlay)
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $("#photo-example-overlay").is(":visible")) {
      $("#photo-example-overlay").fadeOut(300);
      $("#secondary-overlay-background").fadeOut(300);
      e.stopPropagation();
    }
  });


  // Správné zobrazení tabulek na mobilních zařízeních
  function setupResponsiveTables() {
    $('.payment-table').each(function () {
      const headers = $(this).find('thead th').map(function () {
        return $(this).text().trim();
      }).get();

      $(this).find('tbody tr').each(function () {
        $(this).find('td').each(function (i) {
          $(this).attr('data-label', headers[i]);
        });
      });
    });

    transformDocumentActions();

    $(window).on('resize', function () {
      transformDocumentActions();
    });
  }

  // Převod odkazů na tlačítka a zase zpět (desktop/mobile)
  function transformDocumentActions() {
    const isMobile = $(window).width() <= 768;

    $('.document-action').each(function () {
      const $cell = $(this);

      if (isMobile) {
        const $link = $cell.find('a');

        if ($link.length && !$cell.data('original-html')) {
          $cell.data('original-html', $cell.html());

          const linkHref = $link.attr('href');
          const linkText = $link.text().trim();
          const linkHtml = $link.html();

          const $button = $('<button class="light"></button>').html(linkHtml);

          const onClickAttr = $link.attr('onclick');
          if (onClickAttr) {
            $button.attr('onclick', onClickAttr);
          } else {
            $button.on('click', function (e) {
              e.preventDefault();
              window.location.href = linkHref;
            });
          }

          $link.replaceWith($button);
        }
      } else {
        const originalHtml = $cell.data('original-html');
        if (originalHtml) {
          $cell.html(originalHtml);
        }
      }
    });
  }

  // Upravit tabulky pro mobilní zařízení
  setupResponsiveTables();


  // Čerpání prostředků
  const $rangeInput = $('#amount-range');
  const $rangeValue = $('#range-value');
  const $amountSelected = $('#amount-selected');

  function updateRangeBackground() {
    const value = $rangeInput.val();
    const min = $rangeInput.attr('min');
    const max = $rangeInput.attr('max');
    const percentage = ((value - min) / (max - min)) * 100;

    $rangeInput.css('background', `linear-gradient(to right, #417190 ${percentage}%, #fff ${percentage}%)`);

  }

  $rangeInput.on('input change', function () {
    const value = $(this).val();
    $rangeValue.text(`${value} Kč`);
    $amountSelected.val(value);
    updateRangeBackground();
  });

  $amountSelected.on('input change', function () {
    const value = $(this).val();
    $rangeInput.val(value);
    $rangeValue.text(`${value} Kč`);
    updateRangeBackground();
  });

  $rangeValue.text(`${$rangeInput.val()} Kč`);
  updateRangeBackground();

  // Čerpání prostředků - odeslání požadavku
  // Příklad: showWaitingForSignature();
  window.showWaitingForSignature = function () {
    $('#cerpani-prostredku').hide();
    $('#waiting-for-signature').show();
  };

  // Čeprání prostředků - smluvní dokumentace hotova
  // Příklad: hideWaitingForSignature();
  window.hideWaitingForSignature = function () {
    $('#cerpani-prostredku').hide();
    $('#waiting-for-signature').hide();
    $('#signature').show();
  };


  ///////////////////////////////////////////
  //          PARTNERSKÝ PROGRAM           //
  ///////////////////////////////////////////

  // Login page - Zobrazit formulář pro registraci
  $(document).on("click", ".register-button", function (e) {
    e.preventDefault();
    $(".login-form").removeClass("show").addClass("hide");
    $(".register-form").removeClass("hide").addClass("show");
  });


  // Přehled - přepínání vlastního rozsahu
  $(document).on('change', '#date-range', function () {
    var val = $(this).val();
    if (val === '6') {
      $('.date-range-custom').removeClass('hide');
    } else {
      $('.date-range-custom').addClass('hide');
    }
  });

  $(document).on("click", ".show-filter", function () {
    const $filter = $(".filter");
    if ($filter.is(":visible")) {
      $filter.hide();
    } else {
      $filter.css("display", "flex");
    }
  });


   ////////////////////////////////////////////////////
  /////              Správa úvěru V2             /////
  ////////////////////////////////////////////////////
  
  // Formátování čísla karty (přidání mezer každé 4 číslice)
  $(document).on('input', '#card-number', function() {
    let value = $(this).val().replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue !== $(this).val()) {
      $(this).val(formattedValue);
    }
  });

  // Formátování data expirace (MM/YY)
  $(document).on('input', '#expiry-date', function() {
    let value = $(this).val().replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    $(this).val(value);
  });

  // Omezení CVC pouze na číslice 
  $(document).on('input', '#cvc', function() {
    let value = $(this).val().replace(/[^0-9]/g, '');
    $(this).val(value);
  });

  // Omezení jména na písmena, mezery a pomlčky
  $(document).on('input', '#holder', function() {
    let value = $(this).val().replace(/[^a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s\-]/g, '');
    $(this).val(value);
  });

  // Validace formuláře pro změnu karty
  function validateZmenaKartyForm() {
    const cardNumber = $('#card-number').val().trim().replace(/\s/g, '');
    const expiryDate = $('#expiry-date').val().trim();
    const cvc = $('#cvc').val().trim();
    const holder = $('#holder').val().trim();
    const agreement = $('#agreement').is(':checked');
    
    // Validace čísla karty (13-19 číslic)
    const isCardNumberValid = /^\d{13,19}$/.test(cardNumber);
    
    // Validace data expirace (MM/YY format a platné datum)
    const isExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate);
    let isExpiryDateValid = false;
    if (isExpiryValid) {
      const [month, year] = expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const expYear = parseInt(year, 10);
      const expMonth = parseInt(month, 10);
      
      isExpiryDateValid = expYear > currentYear || (expYear === currentYear && expMonth >= currentMonth);
    }
    
    // Validace CVC (3-4 číslice)
    const isCvcValid = /^\d{3,4}$/.test(cvc);
    
    // Validace jména (minimálně 2 znaky, obsahuje písmena)
    const isHolderValid = holder.length >= 2 && /[a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/.test(holder);
    
    const allFieldsValid = isCardNumberValid && isExpiryDateValid && isCvcValid && isHolderValid && agreement;
    
    // Zobrazení chyb
    if (cardNumber && !isCardNumberValid) {
      $('#card-number').addClass('error');
    } else {
      $('#card-number').removeClass('error');
    }
    
    if (expiryDate && !isExpiryDateValid) {
      $('#expiry-date').addClass('error');
    } else {
      $('#expiry-date').removeClass('error');
    }
    
    if (cvc && !isCvcValid) {
      $('#cvc').addClass('error');
    } else {
      $('#cvc').removeClass('error');
    }
    
    if (holder && !isHolderValid) {
      $('#holder').addClass('error');
    } else {
      $('#holder').removeClass('error');
    }
    
    const submitButton = $('#verifikacni-platba');
    if (allFieldsValid) {
      submitButton.prop('disabled', false);
    } else {
      submitButton.prop('disabled', true);
    }
  }
  
  // Po změně polí spustit validaci
  $(document).on('input change', '.zmena-karty-form input', validateZmenaKartyForm);
  
  // Spustit validaci při načtení stránky
  if ($('.zmena-karty-form').length) {
    validateZmenaKartyForm();
  }

  // Změnit kartu - odeslání požadavku
  // Příklad: showWaitingForBank();
  window.showWaitingForBank = function () {
    $('#zmenit-kartu').hide();
    $('#waiting-for-confirmation').show();
  };

  // Změnit kartu - karta nastavena
  // Příklad: hideWaitingForConfirmation();
  window.hideWaitingForConfirmation = function () {
    $('#zmenit-kartu').hide();
    $('#waiting-for-confirmation').hide();
    $('#card-set').show();
  };

});
