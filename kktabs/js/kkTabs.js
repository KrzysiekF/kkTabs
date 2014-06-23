/**
 * PLUGIN jQuery - kkTabs
 * v 0.1.0 BETA
 *
 * YOU NEED:
 * - jQuery >= 1.7
 *
 * API:
 *		
 *	- tabsVar.showTab(0); - open tab by index (remember index starts at 0)
 *	- tabsVar.nextTab(); - open next tab
 *	- tabsVar.prevTab(); - open prev tab
 * 
 */

;(function($){

	var defaults = {
		'menuContenerClass'	: 'kktabs-menu',		// Menu box class
		'menuElementClass'	: 'kktabs-link',		// Menu elements class
		'textContenerClass'	: 'kktabs-content',		// Klasa kontenera treści zakładek
		
		'titleTag'			: 'h2',					// HTML Tag with tab title

		'tabsCount'			: null,					// Specifies how many blocks you want to connect to tabs
		'showTitle'			: false,				// Do you want to show tabs title
		'showRandom'		: false,				// Do you want show random tab
		'hashLinks'			: true,					// Open tab by url

		'hoverClass'		: false,				// Do you want add class on hover menu element?
													// If you want, you can enter it here

		'firstButtonClass'	: 'first',				// Class for first menu element
		'lastButtonClass'	: 'last',				// Class for last menu element
		'activeButtonClass' : 'active',				// Class for active menu element

		onTabOpen			: function(){}			// Callback after open tab
													// You can use $(this) in this function
	};

	$.fn.kkTabs = function(options){

		/*
		Jeśli nie ma obietku to przerywamy wykonywanie pluginu
		 */
		if (this.length === 0) {
			return this;
		}

		/*
		Wsparcie dla wielu elementow
		 */
		if(this.length > 1){
			this.each(function(){
				$(this).kkTabs(options);
			});
			return this;
		}

		var tabs = {};		// Przestrzen nazw
		var iT = this;		// Obiekt pluginu

		var tabsMenuContener = null;	// Kontener dla menu zakladek
		var tabsTextContener = null;	// Kontener tresci zakladek

		/* 
		==========================================
		=========== FUNKCJE PRYWATNE =============
		========================================== 
		*/

		var init = function(){
			tabs.settings = $.extend({}, defaults, options);

			var tabBlocks = getBlocks(tabs.settings.tabsCount);

			// Jeśli nie znalazlem blokow to przerywamy wykonywanie pluginu
			if (tabBlocks.length === 0 || !tabBlocks) {
				return false;
			}

			createHTMLObjs();
			generateTabs(tabBlocks);
		};

		/**
		 * Tworzymy obiekty konteneru menu oraz tresci zakladek
		 */
		var createHTMLObjs = function(){
			tabsMenuContener = $(document.createElement('div')).addClass(tabs.settings.menuContenerClass);
			tabsTextContener = $(document.createElement('div')).addClass(tabs.settings.textContenerClass);

			iT.append(tabsMenuContener).append(tabsTextContener);
		};

		/**
		 * Pobieramy bloki, ktore maja wejsc w sklad zakladek
		 * @param  {int} number :: ilosc zakladek, jesli puste lub zero to pobieramy wszystko
		 */
		var getBlocks = function(number){
			if (iT.children().length > 0) {
				if (number) {
					return iT.children().filter(':lt(' + number + ')');
				}else{
					return iT.children();
				}
			}else{
				return false;
			}
		};

		/**
		 * Generujemy zakladki
		 * @param  {object} tabBlocks :: objekt zawierajacy bloki, z ktorych maja powstac zakladki
		 */
		var generateTabs = function(tabBlocks){
			var count = 1;
			tabBlocks.each(function(){
				var block = $(this);

				var blockID = block.attr('id');
				var blockObj = block.find(tabs.settings.titleTag + ':first');
				var blockTitle = blockObj.html();
				var blockName = blockObj.data('name');
				var blockHref = blockObj.attr('href');
				var blockTitleClass = null;

				if(blockObj.attr('class')){
					blockTitleClass = blockObj.attr('class');
				}

				var button = $(document.createElement('a'))
								.addClass(tabs.settings.menuElementClass)
								.addClass(blockTitleClass)
								.attr({ 'rel' : blockID, 'href' : blockHref })
								.data('name', blockName)
								.html(blockTitle);

				if (tabs.settings.hashLinks) {
					button.attr({'data-name' : setButtonName(button, count)});
				}

				// Dodajemy przycisk do menu
				tabsMenuContener.append(button);

				// Podpinamy eventy
				if(blockHref === undefined) {
					button.on('click', function(){
						iT.showTab($(this).index());
						return false;
					});
				}

				if (tabs.settings.hoverClass) {
					button.on('mouseenter', function(){
						button.addClass(tabs.settings.hoverClass);
					}).on('mouseleave', function(){
						button.removeClass(tabs.settings.hoverClass);
					});
				}

				// Usuwamy naglowek skoro jest juz w przycisku
				block.find(tabs.settings.titleTag + ':first').remove();

				// Ukrywany zakladke i dodajemy ja do kontenera zakladek
				block.hide();
				tabsTextContener.append(block);

				count++;
			});

			var buttons = tabsMenuContener.children();

			if (tabs.settings.firstButtonClass) {
				buttons.filter(':first').addClass(tabs.settings.firstButtonClass);
			}

			if (tabs.settings.lastButtonClass) {
				buttons.filter(':last').addClass(tabs.settings.lastButtonClass);
			}

			var matchingHash = false;

			if (tabs.settings.hashLinks) {
				matchingHash = checkHash();
			}

			if (matchingHash) {

				iT.showTabByHash(matchingHash);

			}else{

				if (tabs.settings.showRandom) {
					var nr = Math.floor(Math.random() * buttons.length );
					iT.showTab(nr);
				}else{
					iT.showTab(0);
				}

			}
		};

		var checkHash = function(){
			var hash = location.hash.split('#');
			
			hash = hash[1];
			var element = tabsMenuContener.find('[data-name="' + hash + '"]');

			if(element.length > 0){
				return hash;
			}else{
				return false;
			}

		};

		var setButtonName = function(button, count){

			if (button.data('name')) {
				return button.data('name');
			}else{
				return 'tab-' + count;
			}
		};

		var getOpenIndex = function(){
			return tabsMenuContener.find('.' + tabs.settings.activeButtonClass).index();
		};

		/* 
		==========================================
		========== FUNKCJE PUBLICZNE =============
		========================================== 
		*/

		/**
		 * Otwieramy wybrana zakladke
		 * @param  {int} index :: numer zakladki (zaczynajacy sie od 0)
		 */
		iT.showTab = function(index){
			tabsMenuContener.children()
							.removeClass(tabs.settings.activeButtonClass)
							.eq(index)
							.addClass(tabs.settings.activeButtonClass);

			tabsTextContener.children()
							.hide()
							.eq(index)
							.show(0, function(){
								tabs.settings.onTabOpen.call(this);
							});
		};

		iT.showTabByHash = function(hash){
			var index = tabsMenuContener.find('[data-name="' + hash + '"]').index();
			iT.showTab(index);
		};

		iT.nextTab = function(){
			var index = getOpenIndex();
			var nextIndex = index + 1;

			if (tabsMenuContener.children().eq(nextIndex).length > 0) {
				iT.showTab(nextIndex);
			}else{
				iT.showTab(0);
			}
		};

		iT.prevTab = function(){
			var index = getOpenIndex();
			var nextIndex = index - 1;

			if (tabsMenuContener.children().eq(nextIndex).length >= 0) {
				iT.showTab(nextIndex);
			}else{
				iT.showTab(tabsMenuContener.children().filter(':last').index());
			}
		};

		init();

		// Zwracamy obiekt pluginu
		return this;
	};

})(jQuery);

