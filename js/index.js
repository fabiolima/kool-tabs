const KoolTabs = function(settings) {

  /**
   * Element id of root element.
   */
  const _id = settings.id;

  /**
   * If `settings.theme` is not given, this will be the default theme.
   */
  const _theme = settings.theme;

  /**
   * Main elements of KoolTabs.
   */
  const [ _$rootElement, _$tabsHeader, _$tabs, _$tabsBody, _$tabsContent ] = _getElements(_id);

  /**
   * Kind of a border to accent the active tab.
   */
  const _$activeLine = $("<div class='line'></div>").css('width', _$tabs.first().outerWidth());
  _$tabsHeader.after(_$activeLine);

  if (_theme) {_applyTheme(_theme); }

  /**
   * Tabs listeners/behaviors.
   */
  _$tabs.on('click', _onTabClick);
  _$tabs.on('active', _onTabActive);
  _$tabs.on('deactivate', _onTabDeactivate);

  /**
   * Tab content listeners/behaviors.
   */
  _$tabsContent.on('active', _onTabContentActive);
  _$tabsContent.on('deactivate', _onTabContentDeactivate);

  /**
   * Active line listeners/behaviors.
   */
  _$activeLine.on('tabChange', _onActiveLineTabChange);


  //////////////////// PRIVATE FUNCTIONS ////////////////////

  /**
   * Apply theme when initializes.
   *
   * @param theme { the given theme. }
   */
  function _applyTheme(theme) {
    _$tabs.css('backgroundColor', _theme.bgTabs);
    _$tabsBody.css('backgroundColor', _theme.bgBody);
    _$tabs.filter('.is-active').css('backgroundColor', _theme.bgActiveTab);
    _$activeLine.css('backgroundColor', _theme.line);
  }

  /**
   * Handler for `active` event binded on every `.tab` element.
   *
   * @param event:Event
   */
  function _onTabActive(event) {
    const $tab = $(event.target);

    $tab.addClass('is-active');

    if (_theme) {
      $tab.css('backgroundColor', _theme.bgActiveTab);
    }
  }

  /**
   * Handler for `deactivate` event binded on every `.tab` element.
   *
   * @param event:Event
   */
  function _onTabDeactivate(event) {
    const $tab = $(event.target);

    $tab.removeClass('is-active');

    if (_theme) {
      $tab.css('backgroundColor', _theme.bgTabs);
    }
  }

  /**
   * Handler for `onClick` event binded on every `.tab` element.
   *
   * @param event:Event
   */
  function _onTabClick(event) {
    const $newTab = $(event.target);
    const $currentTab = _$tabs.filter('.is-active');

    // Avoiding unnecessary triggers.
    if ($newTab.hasClass('is-active') === false) {

      $currentTab.trigger('deactivate');
      $newTab.trigger('active');

      const $targetTabContent = $($newTab.data('target'));
      $targetTabContent.trigger('active');

      _$activeLine.trigger('tabChange');
    }
  }

  /**
   * Handler for `active` event binded on every `.tab-content` element.
   *
   * This event adds the `.is-active` class on target. Also, triggers the `deactivate` event
   * on current `.tab-content.is-active`.
   *
   * @param event:Event
   */
  function _onTabContentActive(event) {
    const $newContent = $(event.target);
    const $currentContent = _$tabsContent.filter('.is-active');

    $currentContent.trigger('deactivate');
    $newContent.addClass('is-active').addClass('enter');

    const [currentIndex, newIndex] = [
      Array.from(_$tabsContent).indexOf($currentContent[0]),
      Array.from(_$tabsContent).indexOf($newContent[0])
    ];

    newIndex > currentIndex ?
      $newContent.addClass('from-left'):
      $newContent.addClass('from-right');

    setTimeout(() => {
      $newContent
        .removeClass('enter')
        .removeClass('from-left')
        .removeClass('from-right');
    }, 400);
  }

  /**
   * Handler for `deactivate` event binded on every `.tab-content` element.
   *
   * This event removes the `.is-active` class from target.
   *
   * @param event:Event
   */
  function _onTabContentDeactivate(event) {
    const $currentContent = $(event.target);
    $currentContent.removeClass('is-active');
  }

  /**
   * Handler for `tabChange` event binded on `.line` element.
   *
   * @param event:Event
   */
  function _onActiveLineTabChange(event) {
    const $line = $(event.target);
    const totalTabs = _$tabs.length;
    const newTabIndex = Array.from(_$tabs).indexOf(_$tabs.filter('.is-active')[0]);

    const offsetPercentage = (newTabIndex * 100) / totalTabs;
    $line.css('margin-left', `${offsetPercentage}%`);
  }

  /**
   * Given the id of rootElement, return all the main elements of KoolTabs component.
   *
   * @param id:string
   */
  function _getElements(id) {
    const rootElement = $(`#${id}`);

    return [
      rootElement,
      $('.tabs-header', rootElement),
      $('.tab', rootElement),
      $('.tabs-body', rootElement),
      $('.tab-content', rootElement)
    ]
  }
};

const a = new KoolTabs({ id: 'tabs-1' });

const b = new KoolTabs({ id: 'tabs-2' });

const c = new KoolTabs({ id: 'tabs-3' });

const d = new KoolTabs({
  id: 'tabs-4',
  theme: {
    bgTabs: '#FFEB3B',
    bgActiveTab: '#FBC02D',
    bgBody: '#FAFAFA',
    line: '#FF9B00',
  }
});
