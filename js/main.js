'use strict';

const sphereIcon = document.querySelector('dotlottie-player.menu__link-background');
const preloader = document.querySelector('.preloader');
const contentWrapper = document.querySelector('.body__container');
const creatingTablesForm = document.getElementById('create-tables-form');
const creatingTablesFormInput = document.getElementById('create-tables-password');

const passwordToSeeNumbers = 12345678;
let mutationObserver;







const overlay = document.querySelector('.viewport-overlay');
let scrollTimeout;

window.addEventListener('scroll', () => {
	// Если оверлей сейчас не в состоянии fade-in, запускаем анимацию появления
	if (!overlay.classList.contains('fade-in')) {
		overlay.classList.remove('fade-out');
		overlay.classList.add('fade-in');
	}

	clearTimeout(scrollTimeout);

	// Запускаем анимацию исчезновения через 400 мс после окончания скролла
	scrollTimeout = setTimeout(() => {
		overlay.classList.remove('fade-in');
		overlay.classList.add('fade-out');
	}, 400);
});







// Code for graph in the block who-uses

const GRAPH_CONFIG = {
	// Конфигурация графика-кольца. Данные вводить сдесь ! 
	segments: [
		{ value: 35, label: 'Молодые 18+', color: 'var(--color-green-light)' },
		{ value: 30, label: 'Работники', color: 'var(--color-green)' },
		{ value: 20, label: 'Трейдеры', color: 'var(--color-blue)' },
		{ value: 15, label: 'Таксисты', color: 'var(--color-violet)' }
	],
	baseWidth: 44,
	baseHeight: 30,
	baseGraphWidth: 174,
	labelOffset: 45
};

function initGraph() {
	document.querySelectorAll('.who-uses__graph-image-value').forEach(el => el.remove());
	document.querySelectorAll('.metrics-list__item').forEach(el => el.remove());

	updateGraphData();
	updateGraphLabels();

	const resizeObserver = new ResizeObserver(updateGraphLabels);
	resizeObserver.observe(document.querySelector('.who-uses__graph-image'));
}
function updateGraphData() {
	const graphElement = document.querySelector('.who-uses__graph');
	const metricsList = document.querySelector('.metrics-list');

	document.querySelectorAll('.who-uses__graph-image-value').forEach(el => el.remove());
	metricsList.innerHTML = '';

	GRAPH_CONFIG.segments.forEach((segment, index) => {
		graphElement.style.setProperty(`--value-${index + 1}`, segment.value);

		const valueElement = document.createElement('span');
		valueElement.className = 'who-uses__graph-image-value';
		valueElement.dataset.value = segment.value;
		graphElement.querySelector('.who-uses__graph-image').appendChild(valueElement);

		const item = document.createElement('div');
		item.className = 'metrics-list__item';

		const valueDiv = document.createElement('dt');
		valueDiv.className = 'metrics-list__value';
		valueDiv.style.background = segment.color;
		valueDiv.textContent = `${segment.value}%`;

		const labelDiv = document.createElement('dd');
		labelDiv.className = 'metrics-list__name';
		labelDiv.textContent = segment.label;

		item.append(valueDiv, labelDiv);
		metricsList.appendChild(item);
	});
}

function updateGraphLabels() {
	const graph = document.querySelector('.who-uses__graph-image');
	const graphWidth = graph.offsetWidth;
	const scaleFactor = graphWidth / GRAPH_CONFIG.baseGraphWidth;

	const graphRadius = graphWidth / 2;
	const ringInner = graphRadius * 0.48;
	const ringThickness = graphRadius * (0.70 - 0.48);

	document.querySelectorAll('.who-uses__graph-image-value').forEach((element, index) => {
		const angle = calculateSegmentAngle(index);
		const radians = angle * (Math.PI / 180);
		const radius = ringInner + ringThickness / 2 + GRAPH_CONFIG.labelOffset * scaleFactor;

		element.style.cssText = `
      width: ${GRAPH_CONFIG.baseWidth * scaleFactor}px;
      height: ${GRAPH_CONFIG.baseHeight * scaleFactor}px;
      transform: translate(
        calc(${radius * Math.cos(radians)}px - 50%), 
        calc(${radius * Math.sin(radians)}px - 50%)
				);
				`;
	});
}

function calculateSegmentAngle(index) {
	let cumulativeSum = 0;
	for (let i = 0; i < index; i++) {
		cumulativeSum += GRAPH_CONFIG.segments[i].value;
	}
	return (cumulativeSum + GRAPH_CONFIG.segments[index].value / 2) * 3.6 - 90;
}

initGraph();

// Code for translate page ( Google Translate Widget )

const languages = {
	ru: () => {
		localStorage.setItem("language", "ru");
		setLanguage('ru');
	},
	en: () => {
		localStorage.setItem("language", "en");
		setLanguage('en');
	},
	ar: () => {
		localStorage.setItem("language", "en");
		setLanguage('ar');
	},
	cn: () => {
		localStorage.setItem("language", "en");
		setLanguage('zh-CN');
	}
};

window.addEventListener('load', () => {
	const lang = localStorage.getItem('language') || 'en';
	showPreloader();
	if (!localStorage.getItem('language')) {
		document.getElementById('translate-to-english').click();
	} else {
		setTimeout(() => {
			hidePreloader();
		}, 3000);
	}
});

function setLanguage(lang) {
	contentWrapper.classList.add('hide-content');

	setTimeout(() => {
		showPreloader();
		document.cookie = "googtrans=/ru/" + lang;
		window.location.reload();
	}, 400);
}

document.getElementById('translate-to-english').addEventListener('click', languages.en);
document.getElementById('translate-to-arabic').addEventListener('click', languages.ar);
document.getElementById('translate-to-russian').addEventListener('click', languages.ru);
document.getElementById('translate-to-chinese').addEventListener('click', languages.cn);

// Code for plreloader and load page
function showPreloader() {
	preloader.classList.remove('hide-content');
	preloader.classList.add('show-content');


	if (!contentWrapper.classList.contains('visually-hidden')) {
		contentWrapper.classList.add('visually-hidden');
	}
	if (mutationObserver) {
		mutationObserver.disconnect();
	}

	mutationObserver = new MutationObserver(() => {
		hidePreloader();
		mutationObserver.disconnect();
	});

	mutationObserver.observe(contentWrapper, { childList: true, subtree: true, characterData: true });
}

function hidePreloader() {
	preloader.classList.add('hide-content');

	setTimeout(() => {
		preloader.classList.add('visually-hidden');
		contentWrapper.classList.remove('visually-hidden');
		contentWrapper.classList.remove('hide-content');
		contentWrapper.classList.add('show-content');
	}, 400);
}

// Code for creating secret tables ( form in block originality )
creatingTablesForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// const input = document.getElementById('create-tables-password');
	const inputValue = creatingTablesFormInput.value.trim();

	if (inputValue === '') {
		creatingTablesFormInput.setCustomValidity('The password is too short');
		creatingTablesFormInput.reportValidity();
		creatingTablesFormInput.style.cssText = "background-color: var(--color-pink);";
		setTimeout(() => creatingTablesFormInput.removeAttribute('style'), 2000);
	}
	else if (Number(inputValue) !== passwordToSeeNumbers) {
		creatingTablesFormInput.setCustomValidity('The password is incorrect, try again...');
		creatingTablesFormInput.reportValidity();
		creatingTablesFormInput.style.cssText = "background-color: var(--color-pink);";
		setTimeout(() => creatingTablesFormInput.removeAttribute('style'), 2000);
	}
	else {
		addTablesToHtml();
		creatingTablesFormInput.value = '';
	}
});

creatingTablesFormInput.addEventListener('input', () => {
	creatingTablesFormInput.setCustomValidity('');
	creatingTablesFormInput.removeAttribute('style');
	creatingTablesFormInput.reportValidity();
});

function cellPainting(rowsList) {
	// Code for invest tables (painting colors of cells)
	rowsList.forEach(row => {
		const tds = row.querySelectorAll('td');
		for (let i = 1; i < tds.length; i++) {
			const cell = tds[i];
			const value = parseFloat(cell.textContent.replace(/\s/g, '').replace(',', '.'));
			if (!isNaN(value) && value < 0) {
				cell.style.cssText = "color: var(--color-red); background-color: var(--color-pink);";
			}
		}
	});
}

function addTablesToHtml() {
	const startPointDriving = document.querySelector('.originality');
	let investTablesSection = document.querySelector('.invest-indicators');

	if (startPointDriving && investTablesSection === null) {
		const tableSections = `
						<section class="numbers section hide-content">
				<h2 class="visually-hidden">Цифры W</h2>

				<div class="numbers__inner">

					<div class="numbers__top-tables-group">
						<h3 class="numbers__title title-big">Цифры W</h3>

						<table class="numbers__table--readiness table">
							<caption class="numbers__table-title--readiness table__title">
								Готовность
							</caption>
							<thead class="table__head">
								<tr class="table__row table__row--head">
									<th>Блок</th>
									<th>Статус</th>
								</tr>
							</thead>
							<tbody>
								<tr class="table__row">
									<td>Бэк-енд</td>
									<td>100&nbsp;%</td>
								</tr>
								<tr class="table__row">
									<td>Фронт-енд</td>
									<td>100&nbsp;%</td>
								</tr>
								<tr class="table__row">
									<td>Интергация</td>
									<td>90&nbsp;%</td>
								</tr>
								<tr class="table__row">
									<td>Общая готовность продукта</td>
									<td>98&nbsp;%</td>
								</tr>
							</tbody>
						</table>

						<table class="numbers__table--metrics table">
							<caption class="numbers__table-title--metrics table__title">
								Ключевые метрики
							</caption>
							<thead class="table__head">
								<tr class="table__row table__row--head">
									<th>Показатель</th>
									<th>Значение</th>
								</tr>
							</thead>
							<tbody>
								<tr class="table__row">
									<td>CAC (ср.)</td>
									<td>0,0715&nbsp;$</td>
								</tr>
								<tr class="table__row">
									<td>ARPU</td>
									<td>0,2563&nbsp;$</td>
								</tr>
								<tr class="table__row">
									<td>LTV</td>
									<td>0,3661&nbsp;$</td>
								</tr>
								<tr class="table__row">
									<td>LTV&nbsp;/ CAC</td>
									<td>0,0512</td>
								</tr>
							</tbody>
						</table>

					</div>

						<table class="numbers__table--income-sources table">
							<caption class="numbers__table-title--income-sources table__title">
								Источники дохода
							</caption>

							<thead class="table__head">
								<tr class="table__row table__row--head">
									<th>Статья дохода</th>
									<th>%&nbsp;от&nbsp;оборота</th>
									<th>Комментарий</th>
								</tr>
							</thead>

							<tbody>
								<tr class="table__row">
									<td>Комиссия сети</td>
									<td>0,0099&nbsp;$ за&nbsp;транзакцию</td>
									<td>стандарт для внутренних переходов</td>
								</tr>
								<tr class="table__row">
									<td>Комиссия за фьючерсы</td>
									<td>0,0077&nbsp;% (после дисконта)</td>
									<td>включает партнёрскую скидку</td>
								</tr>
								<tr class="table__row">
									<td>Swap/финансирование</td>
									<td>0,01&nbsp;% в&nbsp;месяц на&nbsp;открытие позиции</td>
									<td>распределяется ежедневно</td>
								</tr>
							</tbody>
						</table>

				</div>

				<div class="numbers__decor-background section__decor-background "></div>
			</section>

						<section class="forecast forecast--three-month section hide-content">
				<h2 class="visually-hidden">Прогноз роста выручки платформы W за 1-3 месяца</h2>

				<div class="forecast__inner container">
					<table class="forecast__table calc-table">
						<caption class="calc-table__title">
							Прогноз роста выручки и пользовательской активности платформы (&nbsp;1-3 месяцев&nbsp;)
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>1</th>
								<th>2</th>
								<th>3</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row">
								<td>
									Доходная часть (по&nbsp;продуктам)
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--color-green calc-table__row--black-border">
								<td>
									Выручка
								</td>
								<td>19,22</td>
								<td>211,41</td>
								<td>595,80</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--gray-bg">
								<td>
									1. Платформа
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия сети (0,99$)
								</td>
								<td>14,85</td>
								<td>163,35</td>
								<td>460,35</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия Futures после реферального бонуса (0,77%)
								</td>
								<td>3,63</td>
								<td>39,89</td>
								<td>112,43</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									SWAP(1%)
								</td>
								<td>0,74</td>
								<td>8,17</td>
								<td>23,02</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--capt">
								<td>
									Активность пользователей
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Привлеченные пользователи
								</td>
								<td>10</td>
								<td>100</td>
								<td>200</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные пользователи (15%) (шт)
								</td>
								<td>1,5</td>
								<td>15</td>
								<td>30</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активы пользователей ($)
								</td>
								<td>74,25</td>
								<td>816,75</td>
								<td>2 301,75</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Количество транзакций (шт)
								</td>
								<td>15</td>
								<td>165</td>
								<td>465</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты (шт)
								</td>
								<td>0,75</td>
								<td>8,25</td>
								<td>23,25</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты после оттока (30%)
								</td>
								<td>0,525</td>
								<td>5,775</td>
								<td>16,28</td>
							</tr>
						</tbody>
					</table>

				</div>

				<div class="forecast__decor-background section__decor-background "></div>
			</section>

						<section class="forecast forecast--six-month section hide-content">
				<h2 class="visually-hidden">Прогноз роста выручки платформы W за 4-6 месяца</h2>

				<div class="forecast__inner container">
					<table class="forecast__table calc-table">
						<caption class="calc-table__title">
							Прогноз роста выручки и пользовательской активности платформы (&nbsp;4-6 месяцев&nbsp;)
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>4</th>
								<th>5</th>
								<th>6</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row">
								<td>
									Доходная часть (по&nbsp;продуктам)
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--color-green calc-table__row--black-border">
								<td>
									Выручка
								</td>
								<td>4 439</td>
								<td>14 049</td>
								<td>33 269</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--gray-bg">
								<td>
									1. Платформа
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия сети (0,99$)
								</td>
								<td>3 430</td>
								<td>10 855</td>
								<td>25 705</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия Futures после реферального бонуса (0,77%)
								</td>
								<td>838</td>
								<td>2 651</td>
								<td>6 278</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									SWAP(1%)
								</td>
								<td>172</td>
								<td>542</td>
								<td>1 285</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--capt">
								<td>
									Активность пользователей
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Привлеченные пользователи
								</td>
								<td>2 000</td>
								<td>5 000</td>
								<td>10 000</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные пользователи (15%) (шт)
								</td>
								<td>300</td>
								<td>750</td>
								<td>1 500</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активы пользователей ($)
								</td>
								<td>17 152</td>
								<td>54 277</td>
								<td>128 527</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Количество транзакций (шт)
								</td>
								<td>3 465</td>
								<td>10 965</td>
								<td>25 965</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты (шт)
								</td>
								<td>1 733</td>
								<td>5 483</td>
								<td>12 983</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты после оттока (30%)
								</td>
								<td>1 213</td>
								<td>3 838</td>
								<td>9 088</td>
							</tr>
						</tbody>
					</table>

				</div>

				<div class="forecast__decor-background section__decor-background "></div>
			</section>

			<section class="forecast forecast--nine-month section hide-content">
				<h2 class="visually-hidden">Прогноз роста выручки платформы W за 7-9 месяцев</h2>

				<div class="forecast__inner container">
					<table class="forecast__table calc-table">
						<caption class="calc-table__title">
							Прогноз роста выручки и пользовательской активности платформы (&nbsp;7-9 месяцев&nbsp;)
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>7</th>
								<th>8</th>
								<th>9</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row">
								<td>
									Доходная часть (по&nbsp;продуктам)
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr class="calc-table__row calc-table__row--color-green calc-table__row--black-border">
								<td>
									Выручка
								</td>

								<td>66 902</td>
								<td>105 341</td>
								<td>182 218</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--gray-bg">
								<td>
									1. Платформа
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия сети (0,99$)
								</td>
								<td>51 693</td>
								<td>81 393</td>
								<td>140 793</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия Futures после реферального бонуса (0,77%)
								</td>
								<td>12 625</td>
								<td>19 878</td>
								<td>34 385</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									SWAP(1%)
								</td>
								<td>2 585</td>
								<td>4 069</td>
								<td>7 039</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--capt">
								<td>
									Активность пользователей
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Привлеченные пользователи
								</td>
								<td>17 500</td>
								<td>20 000</td>
								<td>40 000</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные пользователи (15%) (шт)
								</td>
								<td>2 625</td>
								<td>3 000</td>
								<td>6 000</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активы пользователей ($)
								</td>
								<td>258 464</td>
								<td>406 964</td>
								<td>703 964</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Количество транзакций (шт)
								</td>
								<td>52 215</td>
								<td>82 215</td>
								<td>142 215</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты (шт)
								</td>
								<td>2 611</td>
								<td>4 111</td>
								<td>7 111</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты после оттока (30%)
								</td>
								<td>1 828</td>
								<td></td>
								<td></td>
							</tr>
						</tbody>
					</table>

				</div>

				<div class="forecast__decor-background section__decor-background "></div>
			</section>

						<section class="forecast forecast--twelve-month section hide-content">
				<h2 class="visually-hidden">Прогноз роста выручки платформы W за 10-12 месяцев</h2>

				<div class="forecast__inner container">
					<table class="forecast__table calc-table">
						<caption class="calc-table__title">
							Прогноз роста выручки и пользовательской активности платформы (&nbsp;10-12 месяцев&nbsp;)
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>10</th>
								<th>11</th>
								<th>12</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row">
								<td>
									Доходная часть (по&nbsp;продуктам)
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--color-green calc-table__row--black-border">
								<td>
									Выручка
								</td>

								<td>297 533</td>
								<td>451 287</td>
								<td>643 479</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--gray-bg">
								<td>
									1. Платформа
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия сети (0,99$)
								</td>
								<td>229 293</td>
								<td>348 693</td>
								<td>497 193</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Комиссия Futures после реферального бонуса (0,77%)
								</td>
								<td>56 146</td>
								<td>85 159</td>
								<td>121 427</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									SWAP(1%)
								</td>
								<td>11 495</td>
								<td>17 435</td>
								<td>24 859</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--capt">
								<td>
									Активность пользователей
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Привлеченные пользователи
								</td>
								<td>60 000</td>
								<td>80 000</td>
								<td>100 000</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные пользователи (15%) (шт)
								</td>
								<td>9 000</td>
								<td>12 000</td>
								<td>15 000</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активы пользователей ($)
								</td>
								<td>1 149 464</td>
								<td>1 743 464</td>
								<td>2 485 964</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Количество транзакций (шт)
								</td>
								<td>232 215</td>
								<td>352 215</td>
								<td>502 215</td>
							</tr>

							<tr class="calc-table__row">
								<td>
									Активные клиенты (шт)
								</td>
								<td>11 610</td>
								<td>17 610</td>
								<td>25 110</td>
							</tr>
						</tbody>
					</table>

				</div>

				<div class="forecast__decor-background forecast__decor-background--long section__decor-background "></div>
			</section>

			<section class="invest-indicators section hide-content">
				<h2 class="visually-hidden">Инвестиционные показатели платформы W</h2>

				<div class="invest-indicators__inner container">
					<table class="invest-indicators__table calc-table calc-table--invest" id="calc-table-invest-1">
						<caption class="calc-table__title calc-table__title--invest">
							Инвестиционные показатели (&nbsp;1-12 месяцев&nbsp;)
							<br>
							ROI <span class="calc-table__text calc-table__text--green">179.46%</span>
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>1</th>
								<th>2</th>
								<th>3</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row calc-table__row--bold calc-table__row--black-border">
								<td>
									Инвестиции
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title">
								<td>
									Расходы, $/мес
								</td>
								<td>2 766</td>
								<td>671</td>
								<td>1 672</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									ФОТ
								</td>
								<td>439</td>
								<td>439</td>
								<td>439</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Реферальная система
								</td>
								<td>8</td>
								<td>83</td>
								<td>233</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Нейросети
								</td>
								<td>0,02</td>
								<td>0,23</td>
								<td>0,45</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Социальная активность
								</td>
								<td>150</td>
								<td>150</td>
								<td>1 000</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Copeex (data centr)
								</td>
								<td>2 170</td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title">
								<td>
									Доходы, $/мес
								</td>
								<td></td>
								<td>19</td>
								<td>211</td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title calc-table__row-title--red">
									Баланс денежных средств
								</td>
								<td>-2 766</td>
								<td>-652</td>
								<td>-1 460</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title">
									Денежные средства на&nbsp;конец периода
								</td>
								<td>-2 766</td>
								<td>-3 418</td>
								<td>-4 879</td>
							</tr>

							<tr class="calc-table__row calc-table__row--blue">
								<td>
									Инвестиции
								</td>
								<td>35 000</td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title">
									Баланс денежных средств с учётом инвестиций
								</td>
								<td>32 234</td>
								<td>28 816</td>
								<td>23 937</td>
							</tr>
						</tbody>
					</table>

					<div class="block-text__decor-devider section__decor-background"></div>
						<table class="invest-indicators__table calc-table calc-table--invest" id="calc-table-invest-2">
							<caption class="visually-hidden">
								Таблица инвестиционных показателей платформы W за 3- 6 месяцев
							</caption>

							<thead>
								<tr class="calc-table__row calc-table__row--head">
									<th>Месяц</th>
									<th>4</th>
									<th>5</th>
									<th>6</th>
								</tr>
							</thead>

							<tbody>
								<tr class="calc-table__row calc-table__row--bold calc-table__row--black-border">
									<td>
										Инвестиции
									</td>
									<td></td>
									<td></td>
									<td></td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title">
									<td>
										Расходы, $/мес
									</td>
									<td>2 194</td>
									<td>5 996</td>
									<td>13 600</td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
									<td>
										ФОТ
									</td>
									<td>439</td>
									<td>439</td>
									<td>439</td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
									<td>
										Реферальная система
									</td>
									<td>1 735</td>
									<td>5 490</td>
									<td>13 001</td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
									<td>
										Нейросети
									</td>
									<td>4,5</td>
									<td>11,25</td>
									<td>22,5</td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
									<td>
										Социальная активность
									</td>
									<td>15,72</td>
									<td>56,37</td>
									<td>137,68</td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
									<td>
										Copeex (data centr)
									</td>
									<td></td>
									<td></td>
									<td></td>
								</tr>

								<tr class="empty-row">
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title">
									<td>
										Доходы, $/мес
									</td>
									<td>596</td>
									<td>4 439</td>
									<td>14 049</td>
								</tr>

								<tr class="calc-table__row calc-table__row--cash-balance">
									<td class="calc-table__row-title calc-table__row-title--red">
										Баланс денежных средств
									</td>
									<td>-1 598</td>
									<td>-1 557</td>
									<td>449</td>
								</tr>

								<tr class="empty-row">
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>

								<tr class="calc-table__row calc-table__row--cash-balance">
									<td class="calc-table__row-title">
										Денежные средства на&nbsp;конец периода
									</td>
									<td>-6 476</td>
									<td>-8 033</td>
									<td>-7 584</td>
								</tr>

								<tr class="calc-table__row calc-table__row--blue">
									<td>
										Инвестиции
									</td>
									<td></td>
									<td></td>
									<td></td>
								</tr>

								<tr class="calc-table__row calc-table__row--cash-balance">
									<td class="calc-table__row-title">
										Баланс денежных средств с учётом инвестиций
									</td>
									<td>17 461</td>
									<td>9 428</td>
									<td>1 844</td>
								</tr>
							</tbody>
						</table>

					<div class="block-text__decor-devider section__decor-background"></div>
						<table class="invest-indicators__table calc-table calc-table--invest" id="calc-table-invest-3">
						<caption class="visually-hidden">
							Таблица инвестиционных показателей платформы W за 7 - 9 месяцев
						</caption>

						<thead>
							<tr class="calc-table__row calc-table__row--head">
								<th>Месяц</th>
								<th>7</th>
								<th>8</th>
								<th>9</th>
							</tr>
						</thead>

						<tbody>
							<tr class="calc-table__row calc-table__row--bold calc-table__row--black-border">
								<td>
									Инвестиции
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title">
								<td>
									Расходы, $/мес
								</td>
								<td>26 903</td>
								<td>42 093</td>
								<td>72 506</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									ФОТ
								</td>
								<td>439</td>
								<td>439</td>
								<td>439</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Реферальная система
								</td>
								<td>26 145</td>
								<td>41 166</td>
								<td>71 210</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Нейросети
								</td>
								<td>39,38</td>
								<td>45</td>
								<td>90</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Социальная активность
								</td>
								<td>280</td>
								<td>443</td>
								<td>768</td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
								<td>
									Copeex (data centr)
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--yellow-title">
								<td>
									Доходы, $/мес
								</td>
								<td>33 269</td>
								<td>66 902</td>
								<td>105 341</td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title calc-table__row-title--red">
									Баланс денежных средств
								</td>
								<td>6 366</td>
								<td>24 809</td>
								<td>32 835</td>
							</tr>

							<tr class="empty-row">
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title">
									Денежные средства на&nbsp;конец периода
								</td>
								<td>-1 218</td>
								<td>23 591</td>
								<td>56 426</td>
							</tr>

							<tr class="calc-table__row calc-table__row--blue">
								<td>
									Инвестиции
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr class="calc-table__row calc-table__row--cash-balance">
								<td class="calc-table__row-title">
									Баланс денежных средств с учётом инвестиций
								</td>
								<td>625</td>
								<td>24 217</td>
								<td>80 643</td>
							</tr>
						</tbody>
					</table>

					<div class="block-text__decor-devider section__decor-background"></div>
						<table class="invest-indicators__table calc-table calc-table--invest" id="calc-table-invest-4">
							<caption class="visually-hidden">
								Таблица инвестиционных показателей платформы W за 10 - 12 месяцев
							</caption>

							<thead>
								<tr class="calc-table__row calc-table__row--head">
									<th>Месяц</th>
									<th>10</th>
									<th>11</th>
									<th>12</th>
								</tr>
							</thead>

							<tbody>
								<tr class="calc-table__row calc-table__row--bold calc-table__row--black-border">
									<td>
										Инвестиции
									</td>
									<td></td>
									<td></td>
									<td></td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title">
									<td>
										Расходы, $/мес
									</td>
									<td>118 103</td>
									<td>178 885</td>
									<td>254 851</td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
									<td>
										ФОТ
									</td>
									<td>439</td>
									<td>439</td>
									<td>439</td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
									<td>
										Реферальная система
									</td>
									<td>116 274</td>
									<td>176 360</td>
									<td>251 468</td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
									<td>
										Нейросети
									</td>
									<td>135</td>
									<td>180</td>
									<td>225</td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
									<td>
										Социальная активность
									</td>
									<td>1 356</td>
									<td>1 907</td>
									<td>2 720</td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
									<td>
										Copeex (data centr)
									</td>
									<td></td>
									<td></td>
									<td></td>
								</tr>

								<tr class="empty-row">
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>

								<tr class="calc-table__row calc-table__row--yellow-title">
									<td>
										Доходы, $/мес
									</td>
									<td>182 217</td>
									<td>297 533</td>
									<td>451 287</td>
								</tr>

								<tr class="calc-table__row calc-table__row--cash-balance">
									<td class="calc-table__row-title calc-table__row-title--red">
										Баланс денежных средств
									</td>
									<td>64 114</td>
									<td>118 647</td>
									<td>196 435</td>
								</tr>

								<tr class="empty-row">
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>

								<tr class="calc-table__row calc-table__row--cash-balance">
									<td class="calc-table__row-title">
										Денежные средства на&nbsp;конец периода
									</td>
									<td>120 540</td>
									<td>239 188</td>
									<td>435 623</td>
								</tr>

								<tr class="calc-table__row calc-table__row--blue">
									<td>
										Инвестиции
									</td>
									<td></td>
									<td></td>
									<td></td>
								</tr>

								<tr class="calc-table__row calc-table__row--cash-balance">
									<td class="calc-table__row-title">
										Баланс денежных средств с учётом инвестиций
									</td>
									<td>201 183</td>
									<td>440 371</td>
									<td>875 994</td>
								</tr>
							</tbody>
						</table>

				</div>

				<div class="invest-indicators__decor-background section__decor-background "></div>
			</section>
		`;
		startPointDriving.insertAdjacentHTML('afterend', tableSections);
		investTablesSection = document.querySelector('.invest-indicators');
		const investTableBalanceRows = investTablesSection.querySelectorAll('.calc-table__row--cash-balance');

		cellPainting(investTableBalanceRows);
		const hideSections = document.querySelectorAll('section.hide-content');
		hideSections.forEach(section => {
			setTimeout(() => {
				section.classList.remove('hide-content');
				section.classList.add('show-content');
			}, 400);

		});
	} else {
		console.log('There is already a table instance on the page...');
	}
};



