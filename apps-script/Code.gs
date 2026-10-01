/**
 * Лендинг «ВТОРНИК» — чтение таблицы для сайта.
 *
 * Куда вставить:
 * 1. Откройте таблицу.
 * 2. Меню «Расширения» → «Apps Script».
 * 3. Удалите то, что уже написано в файле, и вставьте этот код целиком.
 * 4. Нажмите «Сохранить» (значок дискеты).
 *
 * Как опубликовать:
 * 1. Кнопка «Развернуть» → «Новое развёртывание».
 * 2. Тип: «Веб-приложение».
 * 3. Выполнять от имени: «Я».
 * 4. У кого есть доступ: «Все» (доступ по ссылке).
 * 5. «Развернуть» и скопируйте адрес веб-приложения.
 *
 * Если код потом меняли — откройте «Управление развёртываниями»,
 * карандаш у текущего, версия «Новая», и снова сохраните.
 * Сам адрес при этом не меняется.
 *
 * Вкладки таблицы должны называться точно так:
 * «Услуги», «Мастера», «Предложения», «Ф. Салона», «Основная инфа».
 * Первая строка каждой вкладки — заголовки, их не удалять.
 */

var TABS = {
  services: "Услуги",
  masters: "Мастера",
  offers: "Предложения",
  salon: "Ф. Салона",
  info: "Основная инфа",
};

function doGet() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var payload = {
    updated: new Date().toISOString(),
    services: readTab(book, TABS.services, mapService),
    masters: readTab(book, TABS.masters, mapMaster),
    offers: readTab(book, TABS.offers, mapOffer),
    salon: readTab(book, TABS.salon, mapSalon),
    info: readInfo(book),
  };

  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function readTab(book, name, mapRow) {
  var sheet = book.getSheetByName(name);
  if (!sheet) return [];

  var values = sheet.getDataRange().getValues();
  if (!values || values.length < 2) return [];

  var columns = headerMap(values[0]);
  var rows = [];

  for (var i = 1; i < values.length; i++) {
    if (isBlankRow(values[i])) continue;
    if (!isShown(cell(values[i], columns, "показывать"))) continue;
    var item = mapRow(values[i], columns);
    if (!item) continue;
    rows.push(item);
  }

  rows.sort(function (a, b) {
    return a.order - b.order;
  });
  return rows;
}

function mapService(row, columns) {
  var title = cell(row, columns, "название");
  if (!title) return null;
  return {
    order: orderOf(row, columns),
    title: title,
    description: cell(row, columns, "описание"),
    duration: cell(row, columns, "длительность"),
    price: cell(row, columns, "цена"),
  };
}

function mapMaster(row, columns) {
  var name = cell(row, columns, "имя");
  if (!name) return null;
  return {
    order: orderOf(row, columns),
    name: name,
    role: cell(row, columns, "роль"),
    photo: cell(row, columns, "фото_ссылка") || cell(row, columns, "фото"),
  };
}

function readInfo(book) {
  var sheet = book.getSheetByName(TABS.info);
  if (!sheet) return null;

  var values = sheet.getDataRange().getValues();
  if (!values || values.length < 2) return null;

  var columns = headerMap(values[0]);
  var hours = [];
  var address = "";
  var email = "";
  var phone = "";
  var socials = [];

  for (var i = 1; i < values.length; i++) {
    if (isBlankRow(values[i])) continue;
    var day =
      cell(values[i], columns, "дни_работы") || cell(values[i], columns, "день");
    var time = cell(values[i], columns, "время");
    if (day) hours.push({ days: day, time: time });
    if (!address) address = cell(values[i], columns, "адрес");
    if (!email) email = cell(values[i], columns, "почта");
    if (!phone) {
      phone = cell(values[i], columns, "номер") || cell(values[i], columns, "телефон");
    }
    var socialCol = columns["соц_сети"];
    if (socialCol === undefined) socialCol = columns["соцсети"];
    if (socialCol !== undefined) {
      var linked = cellLink(sheet, i + 1, socialCol);
      if (linked.label || linked.href) socials.push(linked);
    }
  }

  return {
    address: address,
    email: email,
    phone: phone,
    hours: hours,
    socials: socials,
  };
}

function mapSalon(row, columns) {
  var photo = cell(row, columns, "фото_ссылка") || cell(row, columns, "фото");
  if (!photo) return null;
  return {
    order: orderOf(row, columns),
    photo: photo,
  };
}

function mapOffer(row, columns) {
  var title = cell(row, columns, "название");
  if (!title) return null;
  return {
    order: orderOf(row, columns),
    title: title,
    description: cell(row, columns, "описание"),
    price: cell(row, columns, "цена"),
    photo: cell(row, columns, "фото_ссылка") || cell(row, columns, "фото"),
  };
}

function headerMap(headerRow) {
  var map = {};
  for (var i = 0; i < headerRow.length; i++) {
    var key = asText(headerRow[i]).toLowerCase().replace(/\s+/g, "_");
    if (key) map[key] = i;
  }
  return map;
}

function cellLink(sheet, rowNumber, colIndex) {
  var range = sheet.getRange(rowNumber, colIndex + 1);
  var formula = String(range.getFormula() || "");
  var formulaUrl = "";
  var formulaMatch = formula.match(/(?:HYPERLINK|ГИПЕРССЫЛКА)\(\s*"([^"]+)"/i);
  if (formulaMatch) formulaUrl = formulaMatch[1];

  var rich = range.getRichTextValue();
  var label = rich ? asText(rich.getText()) : asText(range.getValue());
  var url = formulaUrl;
  if (!url && rich) {
    url = rich.getLinkUrl() || "";
    if (!url) {
      var runs = rich.getRuns();
      for (var r = 0; r < runs.length; r++) {
        if (runs[r].getLinkUrl()) {
          url = runs[r].getLinkUrl();
          break;
        }
      }
    }
  }

  return { label: label, href: url };
}

function cell(row, columns, name) {
  if (!Object.prototype.hasOwnProperty.call(columns, name)) return "";
  return asText(row[columns[name]]);
}

function orderOf(row, columns) {
  var raw = cell(row, columns, "порядок");
  var value = Number(String(raw).replace(",", "."));
  return isFinite(value) ? value : 0;
}

function asText(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function isShown(value) {
  return asText(value).toLowerCase() === "да";
}

function isBlankRow(row) {
  for (var i = 0; i < row.length; i++) {
    if (asText(row[i])) return false;
  }
  return true;
}
